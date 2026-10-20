<?php
// Mails aan gasten: bevestiging, de dag voor aankomst, de avond voor vertrek en de vertrekdag.
// De teksten zijn de eigen Airbnb-berichten van Marjolein; ze past ze aan op /beheer.
// Geheime gegevens (code sleutelkluisje) staan alleen op de server, nooit in de code.
defined('PLEUNTJE') or exit;

require_once __DIR__ . '/reviews.php';

// Uit Marjoleins Airbnb ("Doen voor vertrek"). Aan te passen op /beheer.
const STANDAARD_UITCHECKEN = "Voordat je vertrekt:\n"
    . "- Gebruikte handdoeken verzamelen, het beddengoed afhalen en naast het bed leggen.\n"
    . "- Afval weggooien: het afval kan op het park weggegooid worden. De bakken staan schuin tegenover het speeltuintje aan de rechterkant als je het park afrijdt.\n"
    . "- De verwarming op 15 zetten.\n"
    . "- De deuren op slot doen.\n"
    . "- Graag de sleutel met de tag weer in het sleutelkastje doen.\n"
    . "- Het huisje bezemschoon en hondenharenvrij achterlaten.";

// Link naar de plattegrond met de route naar Pleuntje (pagina /route-naar-pleuntje).
const ROUTELINK = 'https://boshuispleuntje.nl/route-naar-pleuntje/';
const ROUTEZIN = "Op deze plattegrond zie je hoe je bij Pleuntje komt, te voet en met de auto:\n" . ROUTELINK . "\n\n";

const ONDERTEKENING = "Groetjes van Marjolein\n\nBoshuis Pleuntje\nboshuispleuntje.nl";

// Wanneer elke mail gaat. 'dag' = dagen t.o.v. aankomst of vertrek, 'tijd' = uur.
const GEPLANDE_MAILS = [
    'aankomst' => ['ten_opzichte_van' => 'aankomst', 'dag' => -1, 'tijd' => '09:00', 'naam' => 'Dag voor aankomst'],
    'avond_voor_vertrek' => ['ten_opzichte_van' => 'vertrek', 'dag' => -1, 'tijd' => '18:00', 'naam' => 'Avond voor vertrek'],
    'vertrekdag' => ['ten_opzichte_van' => 'vertrek', 'dag' => 0, 'tijd' => '09:00', 'naam' => 'Vertrekdag'],
];

// Een geplande mail die door een storing veel te laat zou komen, slaan we over.
const MAIL_UITERLIJK_UREN = 12;

function standaard_mailteksten(): array
{
    return [
        'bevestiging' => [
            'onderwerp' => 'Je boeking bij Pleuntje is bevestigd',
            'tekst' => "Beste {voornaam},\n\n"
                . "Leuk dat je voor Pleuntje hebt gekozen! Je betaling is ontvangen en je boeking is definitief.\n\n"
                . "Aankomst: {aankomst}, inchecken vanaf 15:00\n"
                . "Vertrek: {vertrek}, uitchecken om 11:00\n"
                . "Aantal nachten: {nachten}\n"
                . "Personen: {personen}\n"
                . "Betaald: {bedrag}\n\n"
                . "Bij je boeking ben je akkoord gegaan met onze huisregels en voorwaarden. Je kunt ze hier nog eens nalezen: https://boshuispleuntje.nl/algemene-voorwaarden/\n\n"
                . "Een dag van tevoren krijg je alle praktische info omtrent het inchecken. "
                . "Mocht je in de tussentijd vragen hebben, laat het me vooral weten: beantwoord gewoon deze mail.\n\n"
                . ONDERTEKENING,
        ],
        'aankomst' => [
            'onderwerp' => 'Morgen ga je logeren bij Pleuntje!',
            'tekst' => "Beste {voornaam},\n\n"
                . "Nog één nachtje slapen en dan ga je uit logeren bij Pleuntje! In dit bericht vind je alle informatie die je nodig hebt voor een fijn verblijf.\n\n"
                . "Je hebt geboekt van {aankomst} tot {vertrek} en je mag inchecken vanaf 15:00. Het uitchecken is om 11:00.\n\n"
                . "Routebeschrijving:\n"
                . "Navigeer naar Poolseweg 27 in Putten. Parkeer je auto op de parkeerplaats of in de berm en loop naar Pleun.\n\n"
                . "Route te voet:\n"
                . "Vanaf de parkeerplaats / slagboom sla je linksaf en neem dan het tweede pad rechts \"De Berkenlaan\". "
                . "Vervolgens is Pleuntje het derde chalet aan je linkerhand, nummer 125.\n\n"
                . "Aan de zijkant van de schuur vind je het sleutelkastje, open deze met de code {sleutelcode}. "
                . "In het sleutelkastje vind je de sleutel en de 'tag' waarmee je de slagboom kunt openen. "
                . "Neem ze mee, open de slagboom met de tag.\n\n"
                . "Route op het park met de auto naar Pleuntje:\n"
                . "Je rijdt het park op onder de slagboom door rechtdoor totdat je links een speeltuintje ziet, "
                . "daar rijd je voorbij en sla je linksaf na het chaletje op de hoek. "
                . "Dan sla je weer linksaf en dan rechtsaf, dan het tweede pad naar links en dan is Pleun aan je rechterhand nummer 125.\n\n"
                . ROUTEZIN
                . "Lukt er iets niet bij aankomst? Bel of app me gerust op 06 42 90 28 07.\n\n"
                . "De vakantie kan beginnen!\n\n"
                . ONDERTEKENING,
        ],
        'avond_voor_vertrek' => [
            'onderwerp' => 'Morgen vertrek je uit Pleuntje',
            'tekst' => "Beste {voornaam},\n\n"
                . "Bedankt dat je bij ons te gast was en ik wens jullie een goede thuisreis toe. "
                . "De vertrektijd is morgenochtend 11:00 uur.\n\n"
                . "{uitchecken}\n\n"
                . ONDERTEKENING,
        ],
        'vertrekdag' => [
            'onderwerp' => 'Bedankt voor je verblijf bij Pleuntje',
            'tekst' => "Hoi {voornaam},\n\n"
                . "Ik hoop dat jullie hebben genoten van jullie verblijf en wie weet tot een volgende keer!\n\n"
                . "We horen graag hoe je het vond! Wil je een review voor ons achterlaten? Dat kan hier:\n{reviewlink}\n\n"
                . "Fijne reis naar huis!\n\n"
                . ONDERTEKENING,
        ],
    ];
}

// Eenmalige aanvulling van eerder opgeslagen teksten (versie 2: telefoonnummer en voorwaarden).
// Daarna niet meer, zodat Marjolein deze zinnen zelf weer kan weghalen als ze dat wil.
function mailteksten_bijwerken(): void
{
    $alle = lees_json('instellingen.json', []);
    if (empty($alle['mails']['teksten']) || ($alle['mails']['versie'] ?? 1) >= 2) return;
    met_slot(function () {
        $alle = lees_json('instellingen.json', []);
        if (empty($alle['mails']['teksten']) || ($alle['mails']['versie'] ?? 1) >= 2) return;
        $t = &$alle['mails']['teksten'];
        if (isset($t['aankomst']['tekst']) && strpos($t['aankomst']['tekst'], '42 90 28 07') === false) {
            $tekst = $t['aankomst']['tekst'];
            $zin = "Lukt er iets niet bij aankomst? Bel of app me gerust op 06 42 90 28 07.\n\n";
            $t['aankomst']['tekst'] = strpos($tekst, 'De vakantie kan beginnen!') !== false
                ? str_replace('De vakantie kan beginnen!', $zin . 'De vakantie kan beginnen!', $tekst)
                : rtrim($tekst) . "\n\n" . trim($zin);
        }
        if (isset($t['bevestiging']['tekst']) && strpos($t['bevestiging']['tekst'], 'algemene-voorwaarden') === false) {
            $tekst = $t['bevestiging']['tekst'];
            $zin = "Bij je boeking ben je akkoord gegaan met onze huisregels en voorwaarden. Je kunt ze hier nog eens nalezen: https://boshuispleuntje.nl/algemene-voorwaarden/\n\n";
            $t['bevestiging']['tekst'] = strpos($tekst, 'Een dag van tevoren') !== false
                ? str_replace('Een dag van tevoren', $zin . 'Een dag van tevoren', $tekst)
                : rtrim($tekst) . "\n\n" . trim($zin);
        }
        unset($t);
        $alle['mails']['versie'] = 2;
        schrijf_json('instellingen.json', $alle);
    });
}

// Eenmalige aanvulling (versie 3, 20 okt 2026): de plattegrondlink in de aankomstmail
// wordt de eigen pagina /route-naar-pleuntje/ (was een tinyurl-link).
function mailteksten_bijwerken_v3(): void
{
    $alle = lees_json('instellingen.json', []);
    if (empty($alle['mails']['teksten']) || ($alle['mails']['versie'] ?? 1) >= 3) return;
    met_slot(function () {
        $alle = lees_json('instellingen.json', []);
        if (empty($alle['mails']['teksten']) || ($alle['mails']['versie'] ?? 1) >= 3) return;
        $t = &$alle['mails']['teksten'];
        if (isset($t['aankomst']['tekst']) && strpos($t['aankomst']['tekst'], 'route-naar-pleuntje') === false) {
            $tekst = $t['aankomst']['tekst'];
            // De oude zin met tinyurl-link vervangen
            $nieuw = preg_replace('~[^\n]*plattegrond[^\n]*\n\s*https?://tinyurl\.com/\S+\s*~iu', ROUTEZIN, $tekst, 1, $aantal);
            if (!$aantal) {
                $nieuw = preg_replace('~https?://tinyurl\.com/\S+~i', ROUTELINK, $tekst, 1, $aantal);
            }
            if (!$aantal) {
                $nieuw = strpos($tekst, 'Lukt er iets niet') !== false
                    ? preg_replace('~Lukt er iets niet~', ROUTEZIN . 'Lukt er iets niet', $tekst, 1)
                    : rtrim($tekst) . "\n\n" . trim(ROUTEZIN);
            }
            $t['aankomst']['tekst'] = $nieuw;
        }
        unset($t);
        $alle['mails']['versie'] = 3;
        schrijf_json('instellingen.json', $alle);
    });
}

// Eenmalige aanvulling (versie 4, 20 okt 2026): straatnaam in de looproute is de Berkenlaan
// (stond als Beukenlaan; Marjolein bevestigde dat Berkenlaan klopt).
function mailteksten_bijwerken_v4(): void
{
    $alle = lees_json('instellingen.json', []);
    if (empty($alle['mails']['teksten']) || ($alle['mails']['versie'] ?? 1) >= 4) return;
    met_slot(function () {
        $alle = lees_json('instellingen.json', []);
        if (empty($alle['mails']['teksten']) || ($alle['mails']['versie'] ?? 1) >= 4) return;
        if (isset($alle['mails']['teksten']['aankomst']['tekst'])) {
            $alle['mails']['teksten']['aankomst']['tekst'] = str_replace('Beukenlaan', 'Berkenlaan', $alle['mails']['teksten']['aankomst']['tekst']);
        }
        $alle['mails']['versie'] = 4;
        schrijf_json('instellingen.json', $alle);
    });
}

function mailinstellingen(): array
{
    mailteksten_bijwerken();
    mailteksten_bijwerken_v3();
    mailteksten_bijwerken_v4();
    $o = lees_json('instellingen.json', [])['mails'] ?? [];
    $teksten = standaard_mailteksten();
    foreach ($teksten as $soort => $t) {
        if (isset($o['teksten'][$soort]['onderwerp'], $o['teksten'][$soort]['tekst'])) {
            $tekst = (string) $o['teksten'][$soort]['tekst'];
            // Opgeslagen vertrekmail van vóór de reviews: de oude zin vervangen door de reviewlink
            if ($soort === 'vertrekdag' && strpos($tekst, '{reviewlink}') === false) {
                $tekst = str_replace(
                    'We horen graag hoe je het vond. Beantwoord gewoon deze mail.',
                    "We horen graag hoe je het vond! Wil je een review voor ons achterlaten? Dat kan hier:\n{reviewlink}",
                    $tekst
                );
            }
            $teksten[$soort] = [
                'onderwerp' => (string) $o['teksten'][$soort]['onderwerp'],
                'tekst' => $tekst,
            ];
        }
    }
    return [
        'sleutelcode' => (string) ($o['sleutelcode'] ?? ''),
        'uitchecken' => (string) ($o['uitchecken'] ?? STANDAARD_UITCHECKEN),
        'teksten' => $teksten,
    ];
}

// Vult {voornaam}, {aankomst} enz. in
function vul_in(string $tekst, array $gast, array $instellingen): string
{
    $voornaam = trim(explode(' ', trim($gast['naam'] ?? ''))[0] ?? '');
    $vervang = [
        '{voornaam}' => $voornaam !== '' ? $voornaam : 'gast',
        '{naam}' => $gast['naam'] ?? '',
        '{aankomst}' => datum_nl($gast['aankomst']),
        '{vertrek}' => datum_nl($gast['vertrek']),
        '{nachten}' => (string) count(nachten($gast['aankomst'], $gast['vertrek'])),
        '{personen}' => (string) ($gast['personen'] ?? ''),
        '{bedrag}' => isset($gast['bedrag']) ? euro((float) $gast['bedrag']) : '',
        '{sleutelcode}' => $instellingen['sleutelcode'] !== '' ? $instellingen['sleutelcode'] : '(de code krijg je nog van ons)',
        '{uitchecken}' => trim($instellingen['uitchecken']),
        '{reviewlink}' => !empty($gast['blokkade']) ? review_link($gast['blokkade']) : 'https://boshuispleuntje.nl/review/?voorbeeld=1',
    ];
    $uit = strtr($tekst, $vervang);
    return preg_replace("/\n{3,}/", "\n\n", $uit); // lege regels van een leeg onderdeel opruimen
}

function verstuur_gastmail(string $soort, array $gast, bool $kopieNaarMarjolein = true): bool
{
    $inst = mailinstellingen();
    $t = $inst['teksten'][$soort] ?? null;
    if (!$t || !filter_var($gast['email'] ?? '', FILTER_VALIDATE_EMAIL)) return false;
    // Vangnet: is de reviewlink per ongeluk uit de vertrekmail gehaald, zet hem er dan onder
    if ($soort === 'vertrekdag' && strpos($t['tekst'], '{reviewlink}') === false) {
        $t['tekst'] = rtrim($t['tekst']) . "\n\nWil je een review voor ons achterlaten? Dat kan hier:\n{reviewlink}";
    }
    $onderwerp = vul_in($t['onderwerp'], $gast, $inst);
    $tekst = vul_in($t['tekst'], $gast, $inst);
    // Staat de routelink in de mail, dan komt de plattegrond er als plaatje in (tik = grote kaart)
    $html = strpos($tekst, ROUTELINK) !== false ? mail_met_plattegrond($tekst) : null;
    $gelukt = stuur_mail($gast['email'], $onderwerp, $tekst, null, $html);
    if ($gelukt && $kopieNaarMarjolein) {
        $kop = "Deze mail is zojuist verstuurd naar {$gast['email']}:\n\n------\n\n";
        stuur_mail(MAIL_MARJOLEIN, 'Kopie aan ' . $gast['naam'] . ': ' . $onderwerp, $kop . $tekst, null, $html === null ? null : mail_met_plattegrond($kop . $tekst));
    }
    return $gelukt;
}

// Maakt van de gewone mailtekst een mail met opmaak: links klikbaar, en bij de routelink
// het plaatje van de route (klik erop = de pagina met de grote kaart). De link blijft eronder staan
// voor mailprogramma's die plaatjes niet meteen tonen.
function mail_met_plattegrond(string $tekst): string
{
    $plaatje = 'https://boshuispleuntje.nl/photos/plattegrond-route.jpg';
    $regels = [];
    foreach (explode("\n", $tekst) as $regel) {
        $r = htmlspecialchars($regel, ENT_QUOTES, 'UTF-8');
        if (trim($regel) === ROUTELINK) {
            $regels[] = '<a href="' . ROUTELINK . '"><img src="' . $plaatje . '" width="560" alt="Plattegrond met de route naar Pleuntje (nummer 125)" '
                . 'style="display:block;width:100%;max-width:560px;height:auto;border:1px solid #d9dccb;border-radius:8px;margin:6px 0"></a>'
                . '<span style="font-size:13px;color:#5b6146">Tik op de kaart om hem groot te openen: <a href="' . ROUTELINK . '" style="color:#4a5a1f">' . ROUTELINK . '</a></span>';
            continue;
        }
        $regels[] = preg_replace('~https?://[^\s<]+~', '<a href="$0" style="color:#4a5a1f">$0</a>', $r);
    }
    return '<!doctype html><html><body style="margin:0;padding:16px;background:#ffffff">'
        . '<div style="max-width:600px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#2b2f1f">'
        . implode("<br>\n", $regels)
        . '</div></body></html>';
}

// De gast bij een blokkade: via een boeking op de site, of zelf ingevuld bij het blokkeren
function gast_bij_blokkade(array $blokkade): ?array
{
    if (!empty($blokkade['boeking'])) {
        $b = zoek_boeking($blokkade['boeking']);
        if (!$b || $b['status'] !== 'betaald') return null;
        if (($b['mollie_sleutel_soort'] ?? '') === 'test') return null; // testboeking: geen mails
        return ['naam' => $b['naam'], 'email' => $b['email'], 'aankomst' => $blokkade['aankomst'], 'vertrek' => $blokkade['vertrek'], 'personen' => $b['personen'], 'bedrag' => $b['bedrag'], 'blokkade' => $blokkade['id']];
    }
    if (!empty($blokkade['email'])) {
        return ['naam' => $blokkade['gastnaam'] ?? $blokkade['omschrijving'], 'email' => $blokkade['email'], 'aankomst' => $blokkade['aankomst'], 'vertrek' => $blokkade['vertrek'], 'blokkade' => $blokkade['id']];
    }
    return null;
}

function moment_van(string $soort, array $blokkade): int
{
    $p = GEPLANDE_MAILS[$soort];
    $dag = volgende_dag($blokkade[$p['ten_opzichte_van']], $p['dag']);
    return strtotime("$dag {$p['tijd']}:00");
}

// Overzicht per blokkade voor /beheer: wat is verstuurd, wat komt nog
function mailplanning(array $blokkade): array
{
    if (!gast_bij_blokkade($blokkade)) return [];
    $uit = [];
    foreach (GEPLANDE_MAILS as $soort => $p) {
        $verstuurd = $blokkade['mails'][$soort] ?? null;
        $uit[] = [
            'naam' => $p['naam'],
            'moment' => date('Y-m-d H:i', moment_van($soort, $blokkade)),
            'status' => $verstuurd ? ($verstuurd === 'overgeslagen' ? 'overgeslagen' : 'verstuurd') : 'gepland',
        ];
    }
    return $uit;
}

// Wordt door onderhoud() aangeroepen: verstuurt de mails die nu aan de beurt zijn
function verstuur_geplande_mails(): void
{
    $nu = time();
    foreach (blokkades() as $blokkade) {
        if ($blokkade['vertrek'] < date('Y-m-d', $nu - 86400)) continue;
        $gast = gast_bij_blokkade($blokkade);
        if (!$gast) continue;
        foreach (GEPLANDE_MAILS as $soort => $p) {
            if (!empty($blokkade['mails'][$soort])) continue;
            $moment = moment_van($soort, $blokkade);
            if ($nu < $moment) continue;
            // Te laat? Normaal slaan we een mail over die meer dan 12 uur te laat zou komen.
            // Uitzondering: is de boeking pas ná het geplande moment gemaakt (last-minute),
            // dan krijgt de gast de aankomstmail alsnog meteen, zolang hij nog niet is aangekomen.
            $teLaat = $nu > $moment + MAIL_UITERLIJK_UREN * 3600;
            $lastMinute = isset($blokkade['aangemaakt']) && strtotime($blokkade['aangemaakt']) >= $moment;
            if ($lastMinute) {
                $teLaat = !($soort === 'aankomst' && $nu < strtotime($blokkade['aankomst'] . ' 20:00:00'));
            }
            // Eerst vastleggen, dan pas versturen: zo gaat een mail nooit twee keer
            $resultaat = $teLaat ? 'overgeslagen' : date('Y-m-d H:i', $nu);
            $vastgelegd = met_slot(function () use ($blokkade, $soort, $resultaat) {
                $lijst = blokkades();
                foreach ($lijst as $i => $b) {
                    if ($b['id'] === $blokkade['id']) {
                        if (!empty($b['mails'][$soort])) return false;
                        $lijst[$i]['mails'][$soort] = $resultaat;
                        schrijf_json('blokkades.json', $lijst);
                        return true;
                    }
                }
                return false;
            });
            if ($vastgelegd && $resultaat !== 'overgeslagen') verstuur_gastmail($soort, $gast);
        }
    }
}
