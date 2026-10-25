<?php
// Privé-agenda voor Marjoleins eigen Google Agenda: ALLE boekingen met zoveel mogelijk informatie
// (boekingen via de site, Airbnb, eigen blokkades). Alleen op te vragen met de geheime sleutel
// uit de link op /beheer. Zonder of met een verkeerde sleutel: niets.
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';
require __DIR__ . '/lib/boeken.php';
tel_computer(null, ['Google Agenda', 'haalt je boekingen op voor je eigen Google Agenda']);

const INCHECK_TIJD = '15:00';
const UITCHECK_TIJD = '11:00';

function ical_tekst(string $s): string
{
    // Komma, puntkomma en backslash beschermen; regeleinden als \n
    return str_replace(["\r\n", "\r", "\n"], '\n', addcslashes($s, ",;\\"));
}

// Lange regels netjes vouwen (iCal-regel: max. 75 tekens per regel)
function ical_vouw(string $regel): string
{
    $uit = '';
    while (strlen($regel) > 74) {
        $stuk = mb_strcut($regel, 0, 74, 'UTF-8');
        $uit .= $stuk . "\r\n ";
        $regel = substr($regel, strlen($stuk));
    }
    return $uit . $regel;
}

// Lokale tijd (Nederland) omzetten naar UTC voor de agenda
function ical_tijd(string $datum, string $tijd): string
{
    $d = new DateTimeImmutable("$datum $tijd", new DateTimeZone('Europe/Amsterdam'));
    return $d->setTimezone(new DateTimeZone('UTC'))->format('Ymd\THis\Z');
}

$k = (string) ($_GET['k'] ?? '');
try {
    $sleutel = prive_agenda_sleutel();
} catch (Throwable $e) {
    http_response_code(503);
    exit;
}
if (strlen($k) !== 32 || !hash_equals($sleutel, $k)) {
    usleep(300000);
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Niet gevonden.';
    exit;
}

try {
    onderhoud();
    $vanaf = volgende_dag(date('Y-m-d'), -30); // ook de afgelopen maand, voor het overzicht
    $stempel = gmdate('Ymd\THis\Z');
    $items = [];

    $periode = function (string $aankomst, string $vertrek): string {
        $n = count(nachten($aankomst, $vertrek));
        return 'Aankomst: ' . datum_nl($aankomst) . ' (vanaf ' . INCHECK_TIJD . ")\n"
            . 'Vertrek: ' . datum_nl($vertrek) . ' (vóór ' . UITCHECK_TIJD . ")\n"
            . 'Nachten: ' . $n;
    };

    // Airbnb-boekingen per periode: een eigen blokkade die ermee samenvalt is dezelfde gast
    // (bijv. een Airbnb-boeking die vroeger ook met de hand is ingevuld). Die tonen we maar één keer.
    $airbnb = airbnb_boekingen();
    $airbnb['boekingen'] = zonder_airbnb_vooraf_dicht($airbnb['boekingen'] ?? []);
    $airbnbPeriodes = [];
    foreach ($airbnb['boekingen'] ?? [] as $a) {
        if ($a['soort'] === 'boeking') $airbnbPeriodes[$a['aankomst'] . '_' . $a['vertrek']] = $a;
    }
    // Airbnb-boeking die (deels) samenvalt met deze periode, of null. Een eigen blokkade die overlapt met
    // een Airbnb-boeking is vrijwel altijd dezelfde gast (met de hand ingevuld, datums soms net anders).
    $overlappendeAirbnb = function (string $aankomst, string $vertrek) use ($airbnbPeriodes): ?string {
        foreach ($airbnbPeriodes as $sleutel => $a) {
            if ($aankomst < $a['vertrek'] && $vertrek > $a['aankomst']) return $sleutel;
        }
        return null;
    };
    $samengevoegd = []; // periode => omschrijving van de eigen blokkade

    // 1) Eigen blokkades en boekingen via de site
    $boekingenOpId = [];
    foreach (boekingen() as $b) $boekingenOpId[$b['id']] = $b;
    foreach (blokkades() as $bl) {
        if ($bl['vertrek'] < $vanaf) continue;
        $b = !empty($bl['boeking']) ? ($boekingenOpId[$bl['boeking']] ?? null) : null;
        if ($b) {
            $titel = 'Pleuntje via website – ' . (trim((string) ($bl['weergavenaam'] ?? '')) ?: $b['naam']);
            $tekst = "Geboekt en betaald via boshuispleuntje.nl\n" . $periode($b['aankomst'], $b['vertrek']) . "\n"
                . 'Gasten: ' . (int) $b['personen'] . "\n"
                . 'Honden: ' . ((int) $b['honden'] > 0 ? (int) $b['honden'] : 'geen') . "\n"
                . (!empty($b['telefoon']) ? 'Telefoon: ' . $b['telefoon'] . "\n" : '')
                . (!empty($b['email']) ? 'E-mail: ' . $b['email'] . "\n" : '')
                . 'Bedrag: ' . euro((float) $b['bedrag'])
                . (trim((string) ($b['bericht'] ?? '')) !== '' ? "\nBericht van de gast: " . trim($b['bericht']) : '')
                . (trim((string) ($bl['notitie'] ?? '')) !== '' ? "\nJouw notitie: " . trim($bl['notitie']) : '');
        } else {
            $omschrijving = trim((string) ($bl['omschrijving'] ?? '')) ?: 'Geblokkeerd';
            $periodeSleutel = empty($bl['email']) ? $overlappendeAirbnb($bl['aankomst'], $bl['vertrek']) : null;
            if ($periodeSleutel !== null) {
                $samengevoegd[$periodeSleutel] = $samengevoegd[$periodeSleutel]
                    ?? $omschrijving . (trim((string) ($bl['notitie'] ?? '')) !== '' ? "\n" . trim($bl['notitie']) : '');
                continue;
            }
            $titel = 'Pleuntje – ' . $omschrijving;
            $tekst = "Zelf ingevuld op boshuispleuntje.nl/beheer\n" . $periode($bl['aankomst'], $bl['vertrek'])
                . (!empty($bl['email']) ? "\nE-mail: " . $bl['email'] : '')
                . (trim((string) ($bl['notitie'] ?? '')) !== '' ? "\nNotitie: " . trim($bl['notitie']) : '');
        }
        $items[] = ['uid' => 'blok-' . $bl['id'], 'aankomst' => $bl['aankomst'], 'vertrek' => $bl['vertrek'], 'titel' => $titel, 'tekst' => $tekst];
    }

    // Nachten die al in een eigen blokkade/boeking staan. Die stuurt de site door naar Airbnb, en Airbnb
    // geeft ze terug als "geblokkeerd": die dubbele afspraken laten we weg.
    $eigenNachten = [];
    foreach (blokkades() as $bl) foreach (nachten($bl['aankomst'], $bl['vertrek']) as $n) $eigenNachten[$n] = true;

    // 2) Airbnb (Airbnb geeft zelf geen namen of aantallen door: die komen uit Marjoleins notitie op /beheer)
    $notities = airbnb_notities();
    foreach ($airbnb['boekingen'] ?? [] as $a) {
        if ($a['vertrek'] < $vanaf) continue;
        $sl = airbnb_sleutel($a);
        $notitie = trim((string) ($notities[$sl]['tekst'] ?? ''));
        // Geen notitie, maar wel een eigen blokkade met dezelfde datums? Gebruik die omschrijving.
        $eigen = $samengevoegd[$a['aankomst'] . '_' . $a['vertrek']] ?? '';
        if ($notitie === '' && $eigen !== '' && !in_array(mb_strtolower($eigen), ['gasten', 'geblokkeerd', 'bezet'], true)) $notitie = $eigen;
        $eersteRegel = trim(strtok($notitie, "\n") ?: '');
        if ($a['soort'] === 'geblokkeerd') {
            $alGedekt = true;
            foreach (nachten($a['aankomst'], $a['vertrek']) as $n) if (!isset($eigenNachten[$n])) $alGedekt = false;
            if ($alGedekt && $notitie === '') continue;
            // Overlapt met een eigen blokkade (bijv. in Airbnb met de hand een dag verschoven dichtgezet): zelfde periode, niet dubbel tonen
            $overlaptEigen = false;
            foreach (blokkades() as $bl) if ($a['aankomst'] < $bl['vertrek'] && $a['vertrek'] > $bl['aankomst']) $overlaptEigen = true;
            if ($overlaptEigen) continue;
            $titel = 'Pleuntje – Geblokkeerd in Airbnb' . ($eersteRegel !== '' ? ': ' . $eersteRegel : '');
            $tekst = "Geblokkeerd in Airbnb\n" . $periode($a['aankomst'], $a['vertrek'])
                . ($notitie !== '' ? "\nReden: " . $notitie : '');
        } else {
            $titel = 'Pleuntje via Airbnb' . ($eersteRegel !== '' ? ' – ' . $eersteRegel : '');
            $tekst = "Geboekt via Airbnb\n" . $periode($a['aankomst'], $a['vertrek']) . "\n"
                . ($notitie !== ''
                    ? 'Notitie: ' . $notitie
                    : 'Namen, aantal gasten en hond: vul ze in bij deze boeking op boshuispleuntje.nl/beheer, dan staan ze ook hier.')
                . (!empty($a['link']) ? "\nReservering in Airbnb: " . $a['link'] : '');
        }
        // Vangnet: precies dezelfde afspraak (zelfde titel en datums) maar één keer tonen
        $dubbel = false;
        foreach ($items as $it) if ($it['titel'] === $titel && $it['aankomst'] === $a['aankomst'] && $it['vertrek'] === $a['vertrek']) $dubbel = true;
        if ($dubbel) continue;
        $items[] = ['uid' => 'airbnb-' . preg_replace('/[^A-Za-z0-9_-]/', '', $sl), 'aankomst' => $a['aankomst'], 'vertrek' => $a['vertrek'], 'titel' => $titel, 'tekst' => $tekst];
    }

    usort($items, fn($x, $y) => strcmp($x['aankomst'], $y['aankomst']));

    $regels = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//boshuispleuntje.nl//Mijn agenda//NL',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:Pleuntje',
        'X-WR-CALDESC:' . ical_tekst('Alle boekingen van Pleuntje (eigen site, Airbnb en eigen blokkades)'),
        'X-WR-TIMEZONE:Europe/Amsterdam',
        'X-APPLE-CALENDAR-COLOR:#0047AB',
        'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
        'X-PUBLISHED-TTL:PT1H',
    ];
    foreach ($items as $it) {
        $regels[] = 'BEGIN:VEVENT';
        $regels[] = 'UID:' . $it['uid'] . '@boshuispleuntje.nl';
        $regels[] = 'DTSTAMP:' . $stempel;
        $regels[] = 'DTSTART:' . ical_tijd($it['aankomst'], INCHECK_TIJD);
        $regels[] = 'DTEND:' . ical_tijd($it['vertrek'], UITCHECK_TIJD);
        $regels[] = ical_vouw('SUMMARY:' . ical_tekst($it['titel']));
        $regels[] = ical_vouw('DESCRIPTION:' . ical_tekst($it['tekst'] . "\n\nOverzicht: " . SITE_URL . '/beheer'));
        $regels[] = 'COLOR:cobalt';
        $regels[] = 'TRANSP:OPAQUE';
        $regels[] = 'END:VEVENT';
    }
    $regels[] = 'END:VCALENDAR';

    header('Content-Type: text/calendar; charset=utf-8');
    header('Content-Disposition: inline; filename="pleuntje-mijn-agenda.ics"');
    header('Cache-Control: no-store, private');
    header('X-Robots-Tag: noindex, nofollow');
    echo implode("\r\n", $regels) . "\r\n";
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Agenda tijdelijk niet beschikbaar.';
}
