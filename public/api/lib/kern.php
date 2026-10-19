<?php
// Gedeelde onderdelen voor de agenda van boshuispleuntje.nl.
// Dit bestand is niet los op te vragen (zie .htaccess en de regel hieronder).
defined('PLEUNTJE') or exit;

date_default_timezone_set('Europe/Amsterdam');

const AIRBNB_VERVERS_SECONDEN = 15 * 60;
const MAX_MISLUKTE_POGINGEN = 8;
const BLOKKEER_SECONDEN = 15 * 60;

function instellingen(): array
{
    static $instellingen = null;
    if ($instellingen === null) {
        $instellingen = require __DIR__ . '/instellingen.php';
    }
    return $instellingen;
}

// De gegevens staan bij voorkeur buiten de map van de website, zodat ze nooit
// via een webadres op te vragen zijn. Lukt dat niet, dan in een afgeschermde map.
function gegevensmap(): string
{
    static $map = null;
    if ($map !== null) return $map;

    $kandidaten = [
        dirname(__DIR__, 3) . '/pleuntje-gegevens',
        __DIR__ . '/gegevens',
    ];
    foreach ($kandidaten as $kandidaat) {
        if (!is_dir($kandidaat)) @mkdir($kandidaat, 0700, true);
        if (is_dir($kandidaat) && is_writable($kandidaat)) {
            $map = $kandidaat;
            return $map;
        }
    }
    throw new RuntimeException('Geen schrijfbare map voor gegevens gevonden.');
}

function lees_json(string $naam, $standaard)
{
    $pad = gegevensmap() . '/' . $naam;
    if (!is_file($pad)) return $standaard;
    $inhoud = @file_get_contents($pad);
    if ($inhoud === false) return $standaard;
    $data = json_decode($inhoud, true);
    return $data === null ? $standaard : $data;
}

function schrijf_json(string $naam, $data): void
{
    $pad = gegevensmap() . '/' . $naam;
    $tijdelijk = $pad . '.' . bin2hex(random_bytes(4)) . '.tmp';
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (@file_put_contents($tijdelijk, $json, LOCK_EX) === false || !@rename($tijdelijk, $pad)) {
        @unlink($tijdelijk);
        throw new RuntimeException('Opslaan mislukt.');
    }
    // Bewaar ook een reservekopie per dag, voor het geval er iets misgaat.
    if ($naam === 'blokkades.json') {
        @copy($pad, gegevensmap() . '/reserve-blokkades-' . date('Y-m-d') . '.json');
    }
}

// Een slot zodat twee wijzigingen tegelijk elkaar niet overschrijven.
function met_slot(callable $taak)
{
    $slot = fopen(gegevensmap() . '/.slot', 'c');
    flock($slot, LOCK_EX);
    try {
        return $taak();
    } finally {
        flock($slot, LOCK_UN);
        fclose($slot);
    }
}

function geldige_datum($datum): bool
{
    if (!is_string($datum) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $datum)) return false;
    [$j, $m, $d] = array_map('intval', explode('-', $datum));
    return checkdate($m, $d, $j);
}

function volgende_dag(string $datum, int $aantal = 1): string
{
    return (new DateTimeImmutable($datum))->modify(($aantal >= 0 ? '+' : '') . $aantal . ' day')->format('Y-m-d');
}

// Alle nachten van aankomst tot (niet met) vertrek.
function nachten(string $aankomst, string $vertrek): array
{
    $uit = [];
    for ($dag = $aankomst; $dag < $vertrek; $dag = volgende_dag($dag)) {
        $uit[] = $dag;
        if (count($uit) > 800) break; // veiligheidsgrens
    }
    return $uit;
}

// ---------- Inloggen op /beheer ----------

const COOKIE_NAAM = 'pleuntje_beheer';
const INLOG_DAGEN = 90;

function opgeslagen(): array
{
    return lees_json('instellingen.json', []);
}

function opzet_nodig(): bool
{
    $o = opgeslagen();
    return empty($o['wachtwoord_hash']) || ($o['opzet_id'] ?? '') !== instellingen()['opzet_id'];
}

function ingelogd(): bool
{
    $token = $_COOKIE[COOKIE_NAAM] ?? '';
    if (!is_string($token) || strlen($token) !== 64 || opzet_nodig()) return false;
    $sessies = lees_json('sessies.json', []);
    $verloopt = $sessies[hash('sha256', $token)] ?? 0;
    return $verloopt > time();
}

// ---------- Blokkades van Marjolein ----------

function blokkades(): array
{
    $data = lees_json('blokkades.json', null);
    if ($data === null) {
        // Eerste keer: neem de boekingen over die al op de site stonden.
        $data = require __DIR__ . '/startdata.php';
        schrijf_json('blokkades.json', $data);
    }
    return $data;
}

// ---------- Boekingsregels (in te stellen op /beheer) ----------

const STANDAARD_REGELS = [
    'minNachten' => 2,       // minimaal aantal nachten
    'maxNachten' => 21,      // maximaal aantal nachten (3 weken)
    'dagenVooraf' => 2,      // zoveel dagen van tevoren minimaal boeken
    'maandenVooruit' => 12,  // zo ver vooruit kan men boeken
];

const REGEL_GRENZEN = [
    'minNachten' => [1, 30],
    'maxNachten' => [1, 120],
    'dagenVooraf' => [0, 60],
    'maandenVooruit' => [1, 23],
];

function regels(): array
{
    $opgeslagen = lees_json('instellingen.json', [])['regels'] ?? [];
    $regels = STANDAARD_REGELS;
    foreach ($regels as $sleutel => $standaard) {
        if (isset($opgeslagen[$sleutel]) && is_int($opgeslagen[$sleutel])) $regels[$sleutel] = $opgeslagen[$sleutel];
    }
    return $regels;
}

// Geeft een foutmelding terug als een periode niet aan de regels voldoet, anders null.
function controleer_regels(string $aankomst, string $vertrek): ?string
{
    $r = regels();
    $vandaag = date('Y-m-d');
    $n = count(nachten($aankomst, $vertrek));
    if ($aankomst < volgende_dag($vandaag, $r['dagenVooraf'])) {
        return $r['dagenVooraf'] === 0
            ? 'Die aankomstdag is al voorbij.'
            : "Boeken kan minstens {$r['dagenVooraf']} dagen van tevoren.";
    }
    $laatste = (new DateTimeImmutable($vandaag))->modify("+{$r['maandenVooruit']} months")->format('Y-m-d');
    if ($aankomst > $laatste) return "Boeken kan tot {$r['maandenVooruit']} maanden vooruit.";
    if ($n < $r['minNachten']) return "Je boekt minimaal {$r['minNachten']} nachten.";
    if ($n > $r['maxNachten']) return "Je boekt maximaal {$r['maxNachten']} nachten.";
    return null;
}

// ---------- Eigen notities bij Airbnb-boekingen (alleen zichtbaar op /beheer) ----------

// Vaste sleutel per Airbnb-boeking: de reserveringscode (blijft gelijk als de datums wijzigen), anders de datums
function airbnb_sleutel(array $b): string
{
    if (!empty($b['link']) && preg_match('~/details/([A-Za-z0-9]+)$~', $b['link'], $m)) return $m[1];
    return $b['aankomst'] . '_' . $b['vertrek'];
}

function airbnb_notities(): array
{
    $lijst = lees_json('airbnb-notities.json', []);
    // Privacy: notities 30 dagen na vertrek vanzelf opruimen
    $grens = volgende_dag(date('Y-m-d'), -30);
    $bewaren = array_filter($lijst, fn($n) => ($n['vertrek'] ?? '') >= $grens);
    if (count($bewaren) !== count($lijst)) schrijf_json('airbnb-notities.json', $bewaren);
    return $bewaren;
}

// ---------- Privé-agenda voor Marjoleins eigen Google Agenda ----------

// Geheime sleutel in de link van de privé-agenda. Wordt de eerste keer vanzelf gemaakt.
function prive_agenda_sleutel(bool $nieuw = false): string
{
    // Bestaat de sleutel al, dan alleen lezen (geen slot nodig)
    if (!$nieuw) {
        $bestaand = lees_json('instellingen.json', [])['prive_agenda_sleutel'] ?? '';
        if (is_string($bestaand) && strlen($bestaand) === 32) return $bestaand;
    }
    return met_slot(function () use ($nieuw) {
        $o = lees_json('instellingen.json', []);
        if ($nieuw || empty($o['prive_agenda_sleutel'])) {
            $o['prive_agenda_sleutel'] = bin2hex(random_bytes(16));
            schrijf_json('instellingen.json', $o);
        }
        return $o['prive_agenda_sleutel'];
    });
}

// ---------- Aanvragen via het formulier op boshuispleuntje.nl ----------

function aanvragen(): array
{
    $lijst = lees_json('aanvragen.json', []);
    // Privacy: open aanvragen waarvan de vertrekdatum ruim voorbij is, worden vanzelf opgeruimd.
    $grens = volgende_dag(date('Y-m-d'), -30);
    $bewaren = array_values(array_filter($lijst, fn($a) => $a['vertrek'] >= $grens));
    if (count($bewaren) !== count($lijst)) schrijf_json('aanvragen.json', $bewaren);
    return $bewaren;
}

// ---------- E-mail ----------

const MAIL_AFZENDER = 'info@boshuispleuntje.nl';
const MAIL_AFZENDER_NAAM = 'Boshuis Pleuntje';
const MAIL_MARJOLEIN = 'info@boshuispleuntje.nl';

// Verstuurt een e-mail via de mailserver van Vimexx. Antwoorden gaan naar info@ (mailbox bij Vimexx, staat in haar Gmail-app).
function stuur_mail(string $aan, string $onderwerp, string $tekst, ?string $antwoordAan = null): bool
{
    if (!filter_var($aan, FILTER_VALIDATE_EMAIL)) return false;
    // Antwoordadres: standaard info@; bij een formulier van een gast diens eigen adres
    $antwoord = ($antwoordAan && filter_var($antwoordAan, FILTER_VALIDATE_EMAIL)) ? $antwoordAan : MAIL_MARJOLEIN;
    $koppen = [
        'From: ' . mb_encode_mimeheader(MAIL_AFZENDER_NAAM, 'UTF-8') . ' <' . MAIL_AFZENDER . '>',
        'Reply-To: ' . $antwoord,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'X-Mailer: boshuispleuntje.nl',
    ];
    return @mail(
        $aan,
        mb_encode_mimeheader($onderwerp, 'UTF-8'),
        str_replace(["\r\n", "\r"], "\n", $tekst),
        implode("\r\n", $koppen),
        '-f' . MAIL_AFZENDER
    );
}

// Mail met één bijlage (voor de reservekopie)
function stuur_mail_met_bijlage(string $aan, string $onderwerp, string $tekst, string $bestandsnaam, string $inhoud, string $soort = 'application/json'): bool
{
    if (!filter_var($aan, FILTER_VALIDATE_EMAIL)) return false;
    $grens = 'pleuntje-' . bin2hex(random_bytes(12));
    $koppen = [
        'From: ' . mb_encode_mimeheader(MAIL_AFZENDER_NAAM, 'UTF-8') . ' <' . MAIL_AFZENDER . '>',
        'Reply-To: ' . MAIL_MARJOLEIN,
        'MIME-Version: 1.0',
        'Content-Type: multipart/mixed; boundary="' . $grens . '"',
        'X-Mailer: boshuispleuntje.nl',
    ];
    $body = "--$grens\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . str_replace(["\r\n", "\r"], "\n", $tekst) . "\r\n"
        . "--$grens\r\n"
        . "Content-Type: $soort; name=\"$bestandsnaam\"\r\n"
        . "Content-Transfer-Encoding: base64\r\n"
        . "Content-Disposition: attachment; filename=\"$bestandsnaam\"\r\n\r\n"
        . chunk_split(base64_encode($inhoud)) . "\r\n"
        . "--$grens--\r\n";
    return @mail($aan, mb_encode_mimeheader($onderwerp, 'UTF-8'), $body, implode("\r\n", $koppen), '-f' . MAIL_AFZENDER);
}

// ---------- Airbnb ----------

function airbnb_link(): ?string
{
    $opgeslagen = lees_json('instellingen.json', []);
    return $opgeslagen['airbnb_link'] ?? null;
}

// Haalt de Airbnb-agenda op (hooguit eens per kwartier) en geeft de boekingen terug.
// Airbnb-agenda, zonder de dagen die Airbnb zelf automatisch dichtzet (te kort tussen twee boekingen,
// te snel na vandaag, te ver vooruit). Die zijn op de site toch al niet te boeken (eigen regels), dus
// ze hoeven niet als "bezet" of als "geblokkeerd in Airbnb" te verschijnen (wens Marjolein, 19 okt 2026).
function airbnb_boekingen(bool $forceer = false): array
{
    $data = airbnb_ophalen($forceer);
    $data['boekingen'] = zonder_automatische_airbnb_blokkades($data['boekingen'] ?? []);
    return $data;
}

function zonder_automatische_airbnb_blokkades(array $lijst): array
{
    $r = regels();
    $vandaag = date('Y-m-d');
    $eersteAankomst = volgende_dag($vandaag, $r['dagenVooraf']);
    $laatsteAankomst = (new DateTimeImmutable($vandaag))->modify("+{$r['maandenVooruit']} months")->format('Y-m-d');
    $verstePunt = volgende_dag($laatsteAankomst, $r['maxNachten']);

    // Begin- en einddatums van al het andere dat bezet is
    $begint = [];
    $eindigt = [];
    foreach (blokkades() as $b) { $begint[$b['aankomst']] = true; $eindigt[$b['vertrek']] = true; }
    foreach ($lijst as $b) { $begint[$b['aankomst']] = true; $eindigt[$b['vertrek']] = true; }

    $uit = [];
    foreach ($lijst as $b) {
        if ($b['soort'] === 'geblokkeerd') {
            // Helemaal vóór de eerste dag waarop je nog kunt aankomen, of helemaal na het verste punt
            if ($b['vertrek'] <= $eersteAankomst || $b['aankomst'] >= $verstePunt) continue;
            // Een gat tussen twee bezette periodes dat korter is dan het minimum aantal nachten
            $start = max($b['aankomst'], $eersteAankomst);
            $linksDicht = $b['aankomst'] <= $eersteAankomst || isset($eindigt[$b['aankomst']]);
            $rechtsDicht = isset($begint[$b['vertrek']]);
            if ($linksDicht && $rechtsDicht && count(nachten($start, $b['vertrek'])) < $r['minNachten']) continue;
        }
        $uit[] = $b;
    }
    return $uit;
}

function airbnb_ophalen(bool $forceer = false): array
{
    $cache = lees_json('airbnb-cache.json', ['opgehaald' => 0, 'boekingen' => [], 'gelukt' => false]);
    $link = airbnb_link();
    if (!$link) return ['boekingen' => [], 'gelukt' => false, 'opgehaald' => 0];

    $verouderd = time() - ($cache['opgehaald'] ?? 0) > AIRBNB_VERVERS_SECONDEN;
    if (!$forceer && !$verouderd) return $cache;

    $tekst = haal_op($link);
    if ($tekst === null || strpos($tekst, 'BEGIN:VCALENDAR') === false) {
        // Ophalen mislukt: gebruik de laatste goede versie en probeer het over een kwartier opnieuw.
        $cache['gelukt'] = false;
        $cache['opgehaald'] = time();
        schrijf_json('airbnb-cache.json', $cache);
        return $cache;
    }

    $nieuw = ['opgehaald' => time(), 'gelukt' => true, 'boekingen' => lees_ical($tekst)];
    schrijf_json('airbnb-cache.json', $nieuw);
    return $nieuw;
}

function haal_op(string $url): ?string
{
    if (!function_exists('curl_init')) return null;
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_USERAGENT => 'boshuispleuntje.nl agenda',
    ]);
    $tekst = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ($tekst !== false && $code >= 200 && $code < 300) ? $tekst : null;
}

// Leest een iCal-agenda en geeft per afspraak aankomst, vertrek en soort terug.
function lees_ical(string $tekst): array
{
    $tekst = str_replace(["\r\n", "\r"], "\n", $tekst);
    $tekst = preg_replace("/\n[ \t]/", '', $tekst); // samengevouwen regels weer aan elkaar
    $boekingen = [];
    foreach (explode('BEGIN:VEVENT', $tekst) as $i => $blok) {
        if ($i === 0) continue;
        $velden = [];
        foreach (explode("\n", $blok) as $regel) {
            if (!preg_match('/^([A-Z-]+)(?:;[^:]*)?:(.*)$/', $regel, $m)) continue;
            $velden[$m[1]] = $m[2];
        }
        $start = ical_datum($velden['DTSTART'] ?? '');
        $eind = ical_datum($velden['DTEND'] ?? '');
        if (!$start) continue;
        if (!$eind || $eind <= $start) $eind = volgende_dag($start);
        $titel = trim($velden['SUMMARY'] ?? '');
        $item = [
            'aankomst' => $start,
            'vertrek' => $eind,
            'soort' => stripos($titel, 'not available') !== false ? 'geblokkeerd' : 'boeking',
        ];
        // Airbnb zet een link naar de reservering in de omschrijving; alleen dat soort link overnemen
        if (preg_match('~https://(?:www\.)?airbnb\.[a-z.]{2,8}/hosting/reservations/details/[A-Za-z0-9]{4,20}~', $blok, $m)) {
            $item['link'] = $m[0];
        }
        $boekingen[] = $item;
    }
    usort($boekingen, fn($a, $b) => strcmp($a['aankomst'], $b['aankomst']));
    return $boekingen;
}

function ical_datum(string $waarde): ?string
{
    if (!preg_match('/^(\d{4})(\d{2})(\d{2})/', trim($waarde), $m)) return null;
    $datum = "$m[1]-$m[2]-$m[3]";
    return geldige_datum($datum) ? $datum : null;
}

// ---------- Samen ----------

// Alle bezette nachten: van Marjolein én van Airbnb.
function bezette_nachten(?string $zonderBoeking = null): array
{
    $set = [];
    foreach (blokkades() as $b) {
        foreach (nachten($b['aankomst'], $b['vertrek']) as $n) $set[$n] = true;
    }
    foreach (airbnb_boekingen()['boekingen'] as $b) {
        foreach (nachten($b['aankomst'], $b['vertrek']) as $n) $set[$n] = true;
    }
    // Datums die even vastgehouden worden terwijl iemand aan het betalen is
    foreach (lees_json('boekingen.json', []) as $b) {
        if (($b['status'] ?? '') === 'wacht' && ($b['vasthouden_tot'] ?? 0) > time() && $b['id'] !== $zonderBoeking) {
            foreach (nachten($b['aankomst'], $b['vertrek']) as $n) $set[$n] = true;
        }
    }
    $lijst = array_keys($set);
    sort($lijst);
    $vandaag = date('Y-m-d');
    return array_values(array_filter($lijst, fn($n) => $n >= volgende_dag($vandaag, -1)));
}

function stuur_json($data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
