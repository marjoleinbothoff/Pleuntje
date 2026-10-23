<?php
// Mails aan gasten: bevestiging, de dag voor aankomst, de avond voor vertrek en de vertrekdag.
// De teksten zijn de eigen Airbnb-berichten van Marjolein; ze past ze aan op /beheer.
// Geheime gegevens (code sleutelkluisje) staan alleen op de server, nooit in de code.
defined('PLEUNTJE') or exit;

require_once __DIR__ . '/reviews.php';
require_once __DIR__ . '/gastmails-vertaald.php';

// De check-out lijst van Marjolein (23 okt 2026, haar papieren lijst uit het huisje). Aan te passen op /beheer.
// Staat ook op de pagina "Informatie voor je verblijf" (src/components/RoutePaginas.tsx).
const STANDAARD_UITCHECKEN = "Voor je vertrek vragen we je of je het volgende wilt doen:\n"
    . "- Vloer: Pleuntje bezemschoon achter te laten. In de grote slaapkamer hangt een bezem, links om de hoek naast de deur, een stofzuiger vind je in de smalle kast links naast het raam.\n"
    . "- Keuken: al het keukengerei schoon en droog op te bergen in de kasten.\n"
    . "- Bedden: de bedden af te halen en het beddengoed op de grond te leggen, bij voorkeur alles op één plek.\n"
    . "- Badkamer: natte handdoeken op de verwarming in de badkamer te hangen. Als ze droog zijn, kunnen ze bij het beddengoed op de grond worden gelegd.\n"
    . "- Overig: de sleutel en de tag van de slagboom weer in het sleutelkluisje aan de schuur te doen.\n"
    . "- Afval: afval weg te gooien in de afvalcontainers voor restafval, glas en papier. Deze containers staan aan de rechterkant van de weg naar de uitgang, ter hoogte van de gastank.\n\n"
    . "De plattegrond met de afvalcontainers en de uitgang vind je hier:\nhttps://boshuispleuntje.nl/afval-en-uitgang/";
// Het lijstje uit Airbnb dat tot 23 okt 2026 de standaard was
const STANDAARD_UITCHECKEN_OUD = "Voordat je vertrekt:\n"
    . "- Gebruikte handdoeken verzamelen, het beddengoed afhalen en naast het bed leggen.\n"
    . "- Afval weggooien: het afval kan op het park weggegooid worden. De bakken staan schuin tegenover het speeltuintje aan de rechterkant als je het park afrijdt.\n"
    . "- De verwarming op 15 zetten.\n"
    . "- De deuren op slot doen.\n"
    . "- Graag de sleutel met de tag weer in het sleutelkastje doen.\n"
    . "- Het huisje bezemschoon en hondenharenvrij achterlaten.";

// Pagina "Informatie voor je verblijf" (huisregels, check-out lijst, afval en uitgang), 23 okt 2026
const INFOLINK = 'https://boshuispleuntje.nl/informatie/';

// Link naar de plattegrond met de route naar Pleuntje (pagina /route-naar-pleuntje).
const ROUTELINK = 'https://boshuispleuntje.nl/route-naar-pleuntje/';
const ROUTEZIN = "Op deze plattegrond zie je de route naar Pleuntje, te voet en met de auto:\n" . ROUTELINK . "\n\n";
// Zo stond de zin in versie 6 (één link voor route én uitgang/afval); versie 7 splitst dat in twee kopjes.
const ROUTEZIN_V6 = "Bekijk hier de plattegrond met de route, te voet en met de auto. Daar zie je ook waar de uitgang is en waar je je afval kwijt kunt:\n" . ROUTELINK . "\n\n";
// Tweede kopje in de aankomstmail (versie 7): plattegrond van het park met afval en uitgang.
const PARKLINK = 'https://boshuispleuntje.nl/afval-en-uitgang/';
const PARKBLOK = "Plattegrond park (afval en uitgang):\nOp deze plattegrond zie je waar je je afval kwijt kunt en waar de uitgang is:\n" . PARKLINK . "\n\n";
// Zo stond de zin in versie 5 (zonder uitgang en afval); versie 6 vervangt hem.
const ROUTEZIN_V5 = "Bekijk hier de plattegrond met de route, te voet en met de auto:\n" . ROUTELINK . "\n\n";
// Zo stond de zin tot en met versie 4 (lager in de mail); versie 5 zet hem direct onder 'Routebeschrijving:'.
const ROUTEZIN_OUD = "Op deze plattegrond zie je hoe je bij Pleuntje komt, te voet en met de auto:\n" . ROUTELINK . "\n\n";

// Het plaatje van de route op de server (public_html/photos), meegestuurd in de aankomstmail.
const PLATTEGROND_BESTAND = __DIR__ . '/../../photos/plattegrond-route.jpg';
// Het hele park met de route naar de uitgang en de afvalcontainers (20 okt 2026).
const PLATTEGROND_UITGANG_BESTAND = __DIR__ . '/../../photos/plattegrond-uitgang-afval.jpg';

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
                . "Routebeschrijving naar Pleuntje:\n"
                . ROUTEZIN
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
                . infoblok('nl')
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

// Eenmalige aanpassing (versie 5, 20 okt 2026, wens Marjolein): de link naar de plattegrond
// direct onder 'Routebeschrijving:' (stond lager in de mail).
function mailteksten_bijwerken_v5(): void
{
    $alle = lees_json('instellingen.json', []);
    if (empty($alle['mails']['teksten']) || ($alle['mails']['versie'] ?? 1) >= 5) return;
    met_slot(function () {
        $alle = lees_json('instellingen.json', []);
        if (empty($alle['mails']['teksten']) || ($alle['mails']['versie'] ?? 1) >= 5) return;
        $tekst = $alle['mails']['teksten']['aankomst']['tekst'] ?? null;
        if (is_string($tekst) && strpos($tekst, 'Routebeschrijving:') !== false) {
            $tekst = str_replace(["\r\n", "\r"], "\n", $tekst);
            $tekst = str_replace(ROUTEZIN_OUD, '', $tekst);
            $tekst = str_replace(trim(ROUTEZIN_OUD), '', $tekst);
            $tekst = preg_replace('~Routebeschrijving:[ \t]*\n~', "Routebeschrijving:\n" . ROUTEZIN, $tekst, 1);
            $alle['mails']['teksten']['aankomst']['tekst'] = preg_replace("/\n{3,}/", "\n\n", $tekst);
        }
        $alle['mails']['versie'] = 5;
        schrijf_json('instellingen.json', $alle);
    });
}

// Eenmalige aanpassing (versie 6, 20 okt 2026): de zin bij de plattegrondlink noemt ook de uitgang en het afval.
function mailteksten_bijwerken_v6(): void
{
    $alle = lees_json('instellingen.json', []);
    if (empty($alle['mails']['teksten']) || ($alle['mails']['versie'] ?? 1) >= 6) return;
    met_slot(function () {
        $alle = lees_json('instellingen.json', []);
        if (empty($alle['mails']['teksten']) || ($alle['mails']['versie'] ?? 1) >= 6) return;
        $tekst = $alle['mails']['teksten']['aankomst']['tekst'] ?? null;
        if (is_string($tekst)) {
            $tekst = str_replace(["\r\n", "\r"], "\n", $tekst);
            $alle['mails']['teksten']['aankomst']['tekst'] = str_replace(trim(ROUTEZIN_V5), trim(ROUTEZIN_V6), $tekst);
        }
        $alle['mails']['versie'] = 6;
        schrijf_json('instellingen.json', $alle);
    });
}

// Eenmalige aanpassing (versie 7, 20 okt 2026, wens Marjolein): twee duidelijke kopjes met elk een eigen link:
// 'Routebeschrijving naar Pleuntje' (route) en 'Plattegrond park (afval en uitgang)'.
function mailteksten_bijwerken_v7(): void
{
    $alle = lees_json('instellingen.json', []);
    if (empty($alle['mails']['teksten']) || ($alle['mails']['versie'] ?? 1) >= 7) return;
    met_slot(function () {
        $alle = lees_json('instellingen.json', []);
        if (empty($alle['mails']['teksten']) || ($alle['mails']['versie'] ?? 1) >= 7) return;
        $tekst = $alle['mails']['teksten']['aankomst']['tekst'] ?? null;
        if (is_string($tekst)) {
            $tekst = str_replace(["\r\n", "\r"], "\n", $tekst);
            $tekst = str_replace(trim(ROUTEZIN_V6), trim(ROUTEZIN), $tekst);
            $tekst = preg_replace('~^Routebeschrijving:[ \t]*$~m', 'Routebeschrijving naar Pleuntje:', $tekst, 1);
            if (strpos($tekst, PARKLINK) === false) {
                if (strpos($tekst, 'Lukt er iets niet') !== false) {
                    $tekst = preg_replace('~Lukt er iets niet~', PARKBLOK . 'Lukt er iets niet', $tekst, 1);
                } elseif (strpos($tekst, 'De vakantie kan beginnen') !== false) {
                    $tekst = preg_replace('~De vakantie kan beginnen~', PARKBLOK . 'De vakantie kan beginnen', $tekst, 1);
                } else {
                    $tekst = rtrim($tekst) . "\n\n" . trim(PARKBLOK);
                }
            }
            $alle['mails']['teksten']['aankomst']['tekst'] = preg_replace("/\n{3,}/", "\n\n", $tekst);
        }
        $alle['mails']['versie'] = 7;
        schrijf_json('instellingen.json', $alle);
    });
}

// Eenmalige aanpassing (versie 8, 23 okt 2026, wens Marjolein): in de aankomstmail één kopje met de link
// naar de pagina "Informatie voor je verblijf" (huisregels, check-out lijst, afval) in plaats van het
// kopje met de parkplattegrond; in de avondmail haar nieuwe check-out lijst in plaats van het oude
// lijstje (zij koos: vervangen, niet erbij). Ook in de opgeslagen Duitse, Engelse en Franse teksten.
function aankomst_naar_v8(string $tekst, string $taal): string
{
    $tekst = str_replace(["\r\n", "\r"], "\n", $tekst);
    if (strpos($tekst, infolink($taal)) !== false) return $tekst;
    $oud = oud_parkblok($taal);
    if (strpos($tekst, $oud) !== false) {
        $tekst = str_replace($oud, trim(infoblok($taal)), $tekst);
    } elseif (strpos($tekst, parklink($taal)) !== false) {
        // Kopje met eigen woorden: alleen de link vervangen, met een korte zin erbij
        $tekst = str_replace(parklink($taal), infolink($taal), $tekst);
    } else {
        $tekst = rtrim($tekst) . "\n\n" . trim(infoblok($taal));
    }
    return preg_replace("/\n{3,}/", "\n\n", $tekst);
}

function mailteksten_bijwerken_v8(): void
{
    $alle = lees_json('instellingen.json', []);
    if (empty($alle['mails']) || ($alle['mails']['versie'] ?? 1) >= 8) return;
    met_slot(function () {
        $alle = lees_json('instellingen.json', []);
        if (empty($alle['mails']) || ($alle['mails']['versie'] ?? 1) >= 8) return;
        $m = &$alle['mails'];
        $oudeNlAankomst = isset($m['teksten']['aankomst']) ? nl_basis_mail($m['teksten']['aankomst']) : nl_basis_mail(standaard_mailteksten()['aankomst']);
        $oudeNlUit = nl_basis((string) ($m['uitchecken'] ?? STANDAARD_UITCHECKEN_OUD));
        if (isset($m['teksten']['aankomst']['tekst'])) {
            $m['teksten']['aankomst']['tekst'] = aankomst_naar_v8((string) $m['teksten']['aankomst']['tekst'], 'nl');
        }
        $m['uitchecken'] = STANDAARD_UITCHECKEN;
        $nieuweNlAankomst = isset($m['teksten']['aankomst']) ? nl_basis_mail($m['teksten']['aankomst']) : nl_basis_mail(standaard_mailteksten()['aankomst']);
        $nieuweNlUit = nl_basis(STANDAARD_UITCHECKEN);
        $stdUit = standaard_uitchecken_vertaald();
        foreach (VERTAALDE_TALEN as $taal) {
            if (!is_array($m['vertalingen'][$taal] ?? null)) continue;
            $v = &$m['vertalingen'][$taal];
            if (isset($v['teksten']['aankomst']['tekst'])) {
                $v['teksten']['aankomst']['tekst'] = aankomst_naar_v8((string) $v['teksten']['aankomst']['tekst'], $taal);
                // Was de vertaling bijgewerkt met de Nederlandse tekst, dan blijft dat zo
                if (($v['basis']['aankomst'] ?? '') === $oudeNlAankomst) $v['basis']['aankomst'] = $nieuweNlAankomst;
            }
            if (isset($v['uitchecken'])) {
                $v['uitchecken'] = $stdUit[$taal];
                if (($v['basis']['uitchecken'] ?? '') === $oudeNlUit) $v['basis']['uitchecken'] = $nieuweNlUit;
            }
            unset($v);
        }
        $m['versie'] = 8;
        unset($m);
        schrijf_json('instellingen.json', $alle);
    });
}

function mailinstellingen(): array
{
    mailteksten_bijwerken();
    mailteksten_bijwerken_v3();
    mailteksten_bijwerken_v4();
    mailteksten_bijwerken_v5();
    mailteksten_bijwerken_v6();
    mailteksten_bijwerken_v7();
    mailteksten_bijwerken_v8();
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
    $uitchecken = (string) ($o['uitchecken'] ?? STANDAARD_UITCHECKEN);
    return [
        'sleutelcode' => (string) ($o['sleutelcode'] ?? ''),
        'uitchecken' => $uitchecken,
        'teksten' => $teksten,
        'vertalingen' => mailvertalingen($o['vertalingen'] ?? [], $teksten, $uitchecken),
    ];
}

// Vingerafdruk van een Nederlandse tekst. Bij elke vertaling bewaren we op welke Nederlandse
// tekst hij gebaseerd is. Past Marjolein later de Nederlandse tekst aan, dan ziet ze op
// /beheer dat de vertaling misschien niet meer klopt.
function nl_basis(string $tekst): string
{
    return substr(hash('sha256', str_replace(["\r\n", "\r"], "\n", trim($tekst))), 0, 16);
}

function nl_basis_mail(array $t): string
{
    return nl_basis($t['onderwerp'] . "\n" . $t['tekst']);
}

// De vertaalde teksten (opgeslagen door Marjolein, anders de standaardvertaling),
// met per tekst of de Nederlandse versie sindsdien is veranderd ('verouderd').
function mailvertalingen(array $opgeslagen, array $nlTeksten, string $nlUitchecken): array
{
    $standaard = standaard_mailteksten_vertaald();
    $standaardUit = standaard_uitchecken_vertaald();
    $nlStandaard = standaard_mailteksten();
    $uit = [];
    foreach (VERTAALDE_TALEN as $taal) {
        $o = is_array($opgeslagen[$taal] ?? null) ? $opgeslagen[$taal] : [];
        $teksten = [];
        $basis = [];
        $verouderd = [];
        foreach ($standaard[$taal] as $soort => $std) {
            $t = $o['teksten'][$soort] ?? null;
            if (isset($t['onderwerp'], $t['tekst'])) {
                $teksten[$soort] = ['onderwerp' => (string) $t['onderwerp'], 'tekst' => (string) $t['tekst']];
                $basis[$soort] = (string) ($o['basis'][$soort] ?? nl_basis_mail($nlStandaard[$soort]));
            } else {
                $teksten[$soort] = $std;
                $basis[$soort] = nl_basis_mail($nlStandaard[$soort]);
            }
            $verouderd[$soort] = $basis[$soort] !== nl_basis_mail($nlTeksten[$soort]);
        }
        $uitchecken = isset($o['uitchecken']) ? (string) $o['uitchecken'] : $standaardUit[$taal];
        $basis['uitchecken'] = (string) ($o['basis']['uitchecken'] ?? nl_basis(STANDAARD_UITCHECKEN));
        $verouderd['uitchecken'] = $basis['uitchecken'] !== nl_basis($nlUitchecken);
        $uit[$taal] = [
            'uitchecken' => $uitchecken,
            'teksten' => $teksten,
            'basis' => $basis,
            'verouderd' => $verouderd,
        ];
    }
    return $uit;
}

// Vult {voornaam}, {aankomst} enz. in
function vul_in(string $tekst, array $gast, array $instellingen): string
{
    $taal = gast_taal($gast['taal'] ?? '');
    $z = mail_zinnetjes($taal);
    $voornaam = trim(explode(' ', trim($gast['naam'] ?? ''))[0] ?? '');
    $uitchecken = $taal === 'nl' ? $instellingen['uitchecken'] : $instellingen['vertalingen'][$taal]['uitchecken'];
    $vervang = [
        '{voornaam}' => $voornaam !== '' ? $voornaam : $z['gast'],
        '{naam}' => $gast['naam'] ?? '',
        '{aankomst}' => datum_taal($gast['aankomst'], $taal),
        '{vertrek}' => datum_taal($gast['vertrek'], $taal),
        '{nachten}' => (string) count(nachten($gast['aankomst'], $gast['vertrek'])),
        '{personen}' => (string) ($gast['personen'] ?? ''),
        '{bedrag}' => isset($gast['bedrag']) ? euro_taal((float) $gast['bedrag'], $taal) : '',
        '{sleutelcode}' => $instellingen['sleutelcode'] !== '' ? $instellingen['sleutelcode'] : $z['geen_code'],
        '{uitchecken}' => trim($uitchecken),
        '{reviewlink}' => !empty($gast['blokkade'])
            ? review_link($gast['blokkade'], $taal)
            : 'https://boshuispleuntje.nl' . ($taal === 'nl' ? '' : '/' . $taal) . '/review/?voorbeeld=1',
    ];
    $uit = strtr($tekst, $vervang);
    return preg_replace("/\n{3,}/", "\n\n", $uit); // lege regels van een leeg onderdeel opruimen
}

function verstuur_gastmail(string $soort, array $gast, bool $kopieNaarMarjolein = true): bool
{
    $inst = mailinstellingen();
    // Gast via de Duitse, Engelse of Franse website: de mail in die taal
    $taal = gast_taal($gast['taal'] ?? '');
    $z = mail_zinnetjes($taal);
    $t = $taal === 'nl' ? ($inst['teksten'][$soort] ?? null) : ($inst['vertalingen'][$taal]['teksten'][$soort] ?? null);
    if (!$t || !filter_var($gast['email'] ?? '', FILTER_VALIDATE_EMAIL)) return false;
    // Vangnet: is de reviewlink per ongeluk uit de vertrekmail gehaald, zet hem er dan onder
    if ($soort === 'vertrekdag' && strpos($t['tekst'], '{reviewlink}') === false) {
        $t['tekst'] = rtrim($t['tekst']) . "\n\n" . $z['review_vangnet'] . "\n{reviewlink}";
    }
    $onderwerp = vul_in($t['onderwerp'], $gast, $inst);
    $tekst = vul_in($t['tekst'], $gast, $inst);
    // Staat de routelink in de mail, dan gaat de plattegrond mee als bijlage onderaan.
    // Gewone tekst, geen plaatje in de tekst: dat toonden veel mail-apps als leeg vak (20 okt 2026, Marjolein).
    $plaatjes = [];
    $route = routelink($taal);
    $park = parklink($taal);
    if (strpos($tekst, $route) !== false && is_readable(PLATTEGROND_BESTAND)) {
        $plaatjes['plattegrond-route-naar-pleuntje'] = PLATTEGROND_BESTAND;
        $tekst = preg_replace('~' . preg_quote($route, '~') . '(?![\w/-])~', $route . "\n" . $z['bijlage'], $tekst, 1);
    }
    if (strpos($tekst, $park) !== false && is_readable(PLATTEGROND_UITGANG_BESTAND)) {
        $plaatjes['plattegrond-park-afval-en-uitgang'] = PLATTEGROND_UITGANG_BESTAND;
        $tekst = preg_replace('~' . preg_quote($park, '~') . '(?![\w/-])~', $park . "\n" . $z['bijlage'], $tekst, 1);
    }
    // Met opmaak meesturen, zodat links in elke mail-app aanklikbaar zijn
    $gelukt = stuur_mail($gast['email'], $onderwerp, $tekst, null, tekst_als_html($tekst), $plaatjes);
    if ($gelukt && $kopieNaarMarjolein) {
        $kop = "Deze mail is zojuist verstuurd naar {$gast['email']}"
            . ($taal === 'nl' ? '' : ' (in het ' . TAALNAAM_NL[$taal] . ')') . ":\n\n------\n\n";
        stuur_mail(MAIL_MARJOLEIN, 'Kopie aan ' . $gast['naam'] . ($taal === 'nl' ? '' : ' (' . TAALNAAM_NL[$taal] . ')') . ': ' . $onderwerp, $kop . $tekst, null, tekst_als_html($kop . $tekst), $plaatjes);
    }
    return $gelukt;
}


// Gewone mailtekst als eenvoudige opmaak: zelfde tekst, maar met aanklikbare links. Geen plaatjes
// in de tekst (die toonden mail-apps als leeg vak).
function tekst_als_html(string $tekst): string
{
    $regels = [];
    foreach (explode("\n", str_replace(["\r\n", "\r"], "\n", $tekst)) as $regel) {
        $r = htmlspecialchars($regel, ENT_QUOTES, 'UTF-8');
        $r = preg_replace('~https?://[^\s<]+[^\s<.,;:!?)]~', '<a href="$0" style="color:#3f5a1a;font-weight:bold">$0</a>', $r);
        // Korte regel die eindigt op ':' (zoals 'Routebeschrijving naar Pleuntje:') = kopje, vet
        $kaal = trim($regel);
        if ($kaal !== '' && mb_strlen($kaal) <= 60 && str_ends_with($kaal, ':') && stripos($kaal, 'http') === false) {
            $r = '<strong style="font-size:16px;color:#2f3d12">' . $r . '</strong>';
        }
        $regels[] = $r;
    }
    return '<!doctype html><html><body style="margin:0;padding:12px"><div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#222">'
        . implode("<br>\n", $regels) . '</div></body></html>';
}

// De gast bij een blokkade: via een boeking op de site, of zelf ingevuld bij het blokkeren
function gast_bij_blokkade(array $blokkade): ?array
{
    if (!empty($blokkade['boeking'])) {
        $b = zoek_boeking($blokkade['boeking']);
        if (!$b || $b['status'] !== 'betaald') return null;
        if (($b['mollie_sleutel_soort'] ?? '') === 'test') return null; // testboeking: geen mails
        return ['naam' => $b['naam'], 'email' => $b['email'], 'aankomst' => $blokkade['aankomst'], 'vertrek' => $blokkade['vertrek'], 'personen' => $b['personen'], 'bedrag' => $b['bedrag'], 'blokkade' => $blokkade['id'], 'taal' => gast_taal($b['taal'] ?? '')];
    }
    if (!empty($blokkade['email'])) {
        return ['naam' => $blokkade['gastnaam'] ?? $blokkade['omschrijving'], 'email' => $blokkade['email'], 'aankomst' => $blokkade['aankomst'], 'vertrek' => $blokkade['vertrek'], 'blokkade' => $blokkade['id'], 'taal' => gast_taal($blokkade['taal'] ?? '')];
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
