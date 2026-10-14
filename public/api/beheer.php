<?php
// Achterkant van boshuispleuntje.nl/beheer: inloggen en blokkades beheren.
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';
require __DIR__ . '/lib/boeken.php';
require_once __DIR__ . '/lib/reviews.php';

// ---------- Hulpjes ----------

function invoer(): array
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') stuur_json(['fout' => 'Ongeldig verzoek.'], 405);
    // Alleen verzoeken vanaf de eigen beheerpagina (andere sites kunnen deze kop niet meesturen).
    if (($_SERVER['HTTP_X_PLEUNTJE'] ?? '') !== '1') stuur_json(['fout' => 'Ongeldig verzoek.'], 403);
    $data = json_decode(file_get_contents('php://input') ?: '', true);
    return is_array($data) ? $data : [];
}

function bezoeker_sleutel(): string
{
    return substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '?') . '|pleuntje'), 0, 16);
}

function controleer_niet_geblokkeerd(): void
{
    $pogingen = lees_json('pogingen.json', []);
    $p = $pogingen[bezoeker_sleutel()] ?? null;
    if ($p && $p['aantal'] >= MAX_MISLUKTE_POGINGEN && time() - $p['sinds'] < BLOKKEER_SECONDEN) {
        stuur_json(['fout' => 'Te vaak een verkeerd wachtwoord geprobeerd. Wacht een kwartier en probeer het dan opnieuw.'], 429);
    }
}

function noteer_poging(bool $gelukt): void
{
    met_slot(function () use ($gelukt) {
        $pogingen = lees_json('pogingen.json', []);
        $sleutel = bezoeker_sleutel();
        if ($gelukt) {
            unset($pogingen[$sleutel]);
        } else {
            $p = $pogingen[$sleutel] ?? ['aantal' => 0, 'sinds' => time()];
            if (time() - $p['sinds'] >= BLOKKEER_SECONDEN) $p = ['aantal' => 0, 'sinds' => time()];
            $p['aantal']++;
            $pogingen[$sleutel] = $p;
        }
        // Oude pogingen opruimen
        $pogingen = array_filter($pogingen, fn($p) => time() - $p['sinds'] < BLOKKEER_SECONDEN);
        schrijf_json('pogingen.json', $pogingen);
    });
}

function maak_sessie(): void
{
    $token = bin2hex(random_bytes(32));
    met_slot(function () use ($token) {
        $sessies = array_filter(lees_json('sessies.json', []), fn($verloopt) => $verloopt > time());
        $sessies[hash('sha256', $token)] = time() + INLOG_DAGEN * 86400;
        schrijf_json('sessies.json', $sessies);
    });
    setcookie(COOKIE_NAAM, $token, [
        'expires' => time() + INLOG_DAGEN * 86400,
        'path' => '/api/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
}

function stop_sessies(bool $alle): void
{
    $token = $_COOKIE[COOKIE_NAAM] ?? '';
    met_slot(function () use ($token, $alle) {
        $sessies = $alle ? [] : lees_json('sessies.json', []);
        if (is_string($token)) unset($sessies[hash('sha256', $token)]);
        schrijf_json('sessies.json', $sessies);
    });
    setcookie(COOKIE_NAAM, '', ['expires' => time() - 3600, 'path' => '/api/', 'secure' => true, 'httponly' => true, 'samesite' => 'Strict']);
}

function eis_ingelogd(): void
{
    if (!ingelogd()) stuur_json(['fout' => 'Je bent niet (meer) ingelogd.', 'uitgelogd' => true], 401);
}

function controleer_wachtwoord_sterkte(string $w): void
{
    if (mb_strlen($w) < 8) stuur_json(['fout' => 'Kies een wachtwoord van minstens 8 tekens.'], 400);
    if (mb_strlen($w) > 200) stuur_json(['fout' => 'Dat wachtwoord is te lang.'], 400);
}

function ontsleutel_airbnb(string $code): ?string
{
    $ruw = base64_decode(instellingen()['airbnb_versleuteld'] ?? '', true);
    if ($ruw === false || strlen($ruw) < 29) return null;
    $sleutel = hash('sha256', 'pleuntje-opzet-v1|' . $code, true);
    $link = openssl_decrypt(substr($ruw, 28), 'aes-256-gcm', $sleutel, OPENSSL_RAW_DATA, substr($ruw, 0, 12), substr($ruw, 12, 16));
    return $link === false ? null : $link;
}

function overzicht(): array
{
    $vandaag = date('Y-m-d');
    $eigen = array_values(array_filter(blokkades(), fn($b) => $b['vertrek'] >= $vandaag));
    $eigen = array_map(function ($b) {
        $b['mailplanning'] = mailplanning($b);
        unset($b['mails']);
        return $b;
    }, $eigen);
    usort($eigen, fn($a, $b) => strcmp($a['aankomst'], $b['aankomst']));
    $airbnb = airbnb_boekingen();
    $airbnbToekomst = array_values(array_filter($airbnb['boekingen'], fn($b) => $b['vertrek'] >= $vandaag));
    $eigenNachten = [];
    foreach ($eigen as $b) {
        foreach (nachten($b['aankomst'], $b['vertrek']) as $n) $eigenNachten[$n] = true;
    }
    return [
        'blokkades' => $eigen,
        'airbnb' => $airbnbToekomst,
        'airbnbGelukt' => (bool) ($airbnb['gelukt'] ?? false),
        'airbnbOpgehaald' => ($airbnb['opgehaald'] ?? 0) ? date('d-m-Y \o\m H:i:s', $airbnb['opgehaald']) : null,
        'nachten' => bezette_nachten(),
        'eigenNachten' => array_keys($eigenNachten),
        'regels' => regels(),
        'regelGrenzen' => REGEL_GRENZEN,
        'aanvragen' => array_values(array_reverse(aanvragen())),
        'mollie' => [
            'modus' => mollie_modus(),
            'sleutelEinde' => mollie_sleutel() ? substr(mollie_sleutel(), -4) : null,
        ],
        'boekingen' => website_boekingen(),
        'mailinstellingen' => mailinstellingen(),
        'toeristenbelasting' => toeristenbelasting_overzicht(),
        'prijzen' => prijzen(),
        'prijsGrenzen' => PRIJS_GRENZEN,
        'reservekopie' => (($k = lees_json('reservekopie.json', [])['laatst'] ?? 0) ? date('d-m-Y', $k) : null),
        'reviews' => array_values(array_map(fn($r) => [
            'id' => $r['id'],
            'bron' => $r['bron'],
            'status' => $r['status'],
            'naam' => $r['naam'],
            'sterren' => (int) $r['sterren'],
            'tekst' => $r['tekst'],
            'maand' => $r['maand'],
            'ingediend' => $r['ingediend'] ?? null,
        ], array_reverse(reviews()))),
    ];
}

// Boekingen via de site die Marjolein moet zien: komende betaalde, lopende betalingen en problemen
function website_boekingen(): array
{
    $vandaag = date('Y-m-d');
    $uit = [];
    foreach (boekingen() as $b) {
        $toon = ($b['status'] === 'betaald' && $b['vertrek'] >= $vandaag)
            || ($b['status'] === 'wacht' && ($b['vasthouden_tot'] ?? 0) > time() - 3600);
        if (!$toon) continue;
        $uit[] = [
            'id' => $b['id'],
            'status' => $b['status'],
            'naam' => $b['naam'],
            'email' => $b['email'],
            'telefoon' => $b['telefoon'],
            'aankomst' => $b['aankomst'],
            'vertrek' => $b['vertrek'],
            'personen' => $b['personen'],
            'honden' => $b['honden'],
            'bedrag' => euro((float) $b['bedrag']),
            'bericht' => $b['bericht'],
            'betaaldOp' => $b['betaald_op'] ?? null,
            'test' => ($b['mollie_sleutel_soort'] ?? '') === 'test',
            'conflict' => !empty($b['conflict']),
        ];
    }
    usort($uit, fn($a, $b) => strcmp($a['aankomst'], $b['aankomst']));
    return $uit;
}

// Overzicht voor de toeristenbelasting: betaalde boekingen via de site (geen test, niet geannuleerd),
// per kalenderjaar. Een verblijf over de jaarwisseling wordt per nacht over de jaren verdeeld.
function toeristenbelasting_overzicht(): array
{
    $tarief = tarieven()['toeristenbelasting'] ?? 0;
    $jaren = [];
    foreach (boekingen() as $b) {
        if ($b['status'] !== 'betaald' || ($b['mollie_sleutel_soort'] ?? '') === 'test') continue;
        $alleNachten = nachten($b['aankomst'], $b['vertrek']);
        if (!$alleNachten) continue;
        $personen = (int) $b['personen'];
        $totaal = isset($b['toeristenbelasting']) ? (float) $b['toeristenbelasting'] : round(count($alleNachten) * $personen * $tarief, 2);
        $perNacht = $totaal / count($alleNachten);
        foreach ($alleNachten as $n) {
            $jaar = substr($n, 0, 4);
            $jaren[$jaar] ??= ['jaar' => $jaar, 'boekingen' => [], 'nachten' => 0, 'persoonsnachten' => 0, 'bedrag' => 0.0];
            $jaren[$jaar]['boekingen'][$b['id']] = true;
            $jaren[$jaar]['nachten']++;
            $jaren[$jaar]['persoonsnachten'] += $personen;
            $jaren[$jaar]['bedrag'] += $perNacht;
        }
    }
    krsort($jaren);
    return array_values(array_map(fn($j) => [
        'jaar' => $j['jaar'],
        'boekingen' => count($j['boekingen']),
        'nachten' => $j['nachten'],
        'persoonsnachten' => $j['persoonsnachten'],
        'bedrag' => euro(round($j['bedrag'], 2)),
    ], $jaren));
}

// ---------- Acties ----------

try {
    $invoer = invoer();
    $actie = $invoer['actie'] ?? '';

    switch ($actie) {
        case 'status':
            stuur_json(['opzetNodig' => opzet_nodig(), 'ingelogd' => ingelogd()]);

        case 'opzetten':
            if (!opzet_nodig()) stuur_json(['fout' => 'De beheerpagina is al ingesteld. Log in met je wachtwoord.'], 400);
            controleer_niet_geblokkeerd();
            $code = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', (string) ($invoer['code'] ?? '')));
            $wachtwoord = (string) ($invoer['wachtwoord'] ?? '');
            if (!password_verify($code, instellingen()['opzet_code_hash'])) {
                noteer_poging(false);
                stuur_json(['fout' => 'Die opstartcode klopt niet. Kijk hem nog eens goed na.'], 400);
            }
            controleer_wachtwoord_sterkte($wachtwoord);
            $link = ontsleutel_airbnb($code);
            met_slot(function () use ($wachtwoord, $link) {
                $o = opgeslagen();
                $o['wachtwoord_hash'] = password_hash($wachtwoord, PASSWORD_DEFAULT);
                $o['opzet_id'] = instellingen()['opzet_id'];
                if ($link) $o['airbnb_link'] = $link;
                schrijf_json('instellingen.json', $o);
                schrijf_json('sessies.json', []);
            });
            noteer_poging(true);
            blokkades(); // neemt de bestaande boekingen over
            airbnb_boekingen(true);
            maak_sessie();
            stuur_json(['ok' => true]);

        case 'inloggen':
            if (opzet_nodig()) stuur_json(['fout' => 'De beheerpagina moet eerst worden ingesteld.', 'opzetNodig' => true], 400);
            controleer_niet_geblokkeerd();
            $wachtwoord = (string) ($invoer['wachtwoord'] ?? '');
            if (!password_verify($wachtwoord, opgeslagen()['wachtwoord_hash'])) {
                noteer_poging(false);
                stuur_json(['fout' => 'Dat wachtwoord klopt niet.'], 400);
            }
            noteer_poging(true);
            maak_sessie();
            stuur_json(['ok' => true]);

        case 'uitloggen':
            stop_sessies(false);
            stuur_json(['ok' => true]);

        case 'overzicht':
            eis_ingelogd();
            onderhoud();
            if (!empty($invoer['ververs'])) airbnb_boekingen(true);
            stuur_json(overzicht());

        case 'blokkeer':
            eis_ingelogd();
            $aankomst = $invoer['aankomst'] ?? '';
            $vertrek = $invoer['vertrek'] ?? '';
            $omschrijving = trim(mb_substr((string) ($invoer['omschrijving'] ?? ''), 0, 80));
            $email = trim(mb_substr((string) ($invoer['email'] ?? ''), 0, 150));
            if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) stuur_json(['fout' => 'Dat e-mailadres klopt niet helemaal. Kijk het nog eens na, of laat het leeg.'], 400);
            if (!geldige_datum($aankomst) || !geldige_datum($vertrek)) stuur_json(['fout' => 'Kies een eerste en een laatste dag.'], 400);
            if ($vertrek <= $aankomst) stuur_json(['fout' => 'De vertrekdag moet na de aankomstdag liggen.'], 400);
            if (count(nachten($aankomst, $vertrek)) > 400) stuur_json(['fout' => 'Dat is een erg lange periode. Blokkeer maximaal ruim een jaar tegelijk.'], 400);
            met_slot(function () use ($aankomst, $vertrek, $omschrijving, $email) {
                $lijst = blokkades();
                $nieuw = [
                    'id' => bin2hex(random_bytes(5)),
                    'aankomst' => $aankomst,
                    'vertrek' => $vertrek,
                    'omschrijving' => $omschrijving !== '' ? $omschrijving : 'Geblokkeerd',
                    'aangemaakt' => date('Y-m-d H:i'),
                ];
                if ($email !== '') {
                    // Gast die zelf contact opnam: krijgt de mails voor aankomst en vertrek
                    $nieuw['email'] = $email;
                    $nieuw['gastnaam'] = $omschrijving;
                }
                $lijst[] = $nieuw;
                schrijf_json('blokkades.json', $lijst);
            });
            stuur_json(overzicht());

        case 'verwijder':
            eis_ingelogd();
            $id = (string) ($invoer['id'] ?? '');
            met_slot(function () use ($id) {
                $boekingId = null;
                foreach (blokkades() as $b) if ($b['id'] === $id) $boekingId = $b['boeking'] ?? null;
                $lijst = array_values(array_filter(blokkades(), fn($b) => $b['id'] !== $id));
                schrijf_json('blokkades.json', $lijst);
                if ($boekingId) {
                    // Gekoppelde boeking via de site: geannuleerd, dus ook geen mails meer
                    $boekingen = boekingen();
                    foreach ($boekingen as $i => $x) {
                        if ($x['id'] === $boekingId) $boekingen[$i]['status'] = 'geannuleerd';
                    }
                    bewaar_boekingen($boekingen);
                }
            });
            stuur_json(overzicht());

        case 'mollie_sleutel':
            eis_ingelogd();
            $sleutel = trim((string) ($invoer['sleutel'] ?? ''));
            if (!preg_match('/^(test|live)_[A-Za-z0-9]{20,}$/', $sleutel)) {
                stuur_json(['fout' => 'Dit lijkt geen Mollie-sleutel. Hij begint met test_ of live_ en is lang. Kopieer hem nog eens.'], 400);
            }
            $r = mollie_verzoek('GET', '/methods', null, $sleutel);
            if ($r['code'] !== 200) {
                stuur_json(['fout' => 'Mollie accepteert deze sleutel niet. Kopieer hem nog eens, helemaal.'], 400);
            }
            met_slot(function () use ($sleutel) {
                $o = opgeslagen();
                $o['mollie_sleutel'] = $sleutel;
                schrijf_json('instellingen.json', $o);
            });
            stuur_json(overzicht());

        case 'mollie_verwijder':
            eis_ingelogd();
            met_slot(function () {
                $o = opgeslagen();
                unset($o['mollie_sleutel']);
                schrijf_json('instellingen.json', $o);
            });
            stuur_json(overzicht());

        case 'regels':
            eis_ingelogd();
            $nieuw = [];
            foreach (REGEL_GRENZEN as $sleutel => [$min, $max]) {
                $waarde = $invoer['regels'][$sleutel] ?? null;
                if (!is_numeric($waarde) || (int) $waarde != $waarde || $waarde < $min || $waarde > $max) {
                    stuur_json(['fout' => "Kies bij elke regel een heel getal tussen de aangegeven grenzen."], 400);
                }
                $nieuw[$sleutel] = (int) $waarde;
            }
            if ($nieuw['maxNachten'] < $nieuw['minNachten']) {
                stuur_json(['fout' => 'Het maximale aantal nachten moet minstens zo groot zijn als het minimale.'], 400);
            }
            met_slot(function () use ($nieuw) {
                $o = opgeslagen();
                $o['regels'] = $nieuw;
                schrijf_json('instellingen.json', $o);
            });
            stuur_json(overzicht());

        case 'bevestig':
            eis_ingelogd();
            $id = (string) ($invoer['id'] ?? '');
            $aanvraag = null;
            foreach (aanvragen() as $a) if ($a['id'] === $id) $aanvraag = $a;
            if (!$aanvraag) stuur_json(['fout' => 'Deze aanvraag bestaat niet meer.'], 404);
            if (empty($invoer['toch'])) {
                $bezet = array_flip(bezette_nachten());
                foreach (nachten($aanvraag['aankomst'], $aanvraag['vertrek']) as $n) {
                    if (isset($bezet[$n])) stuur_json(['fout' => 'Let op: in deze periode is inmiddels al iets anders geboekt of geblokkeerd.', 'overlap' => true], 409);
                }
            }
            met_slot(function () use ($aanvraag) {
                $lijst = blokkades();
                $lijst[] = [
                    'id' => bin2hex(random_bytes(5)),
                    'aankomst' => $aanvraag['aankomst'],
                    'vertrek' => $aanvraag['vertrek'],
                    'omschrijving' => $aanvraag['naam'] . ' (via boshuispleuntje.nl)',
                ];
                schrijf_json('blokkades.json', $lijst);
                $rest = array_values(array_filter(aanvragen(), fn($a) => $a['id'] !== $aanvraag['id']));
                schrijf_json('aanvragen.json', $rest);
            });
            stuur_json(overzicht());

        case 'wijsaf':
            eis_ingelogd();
            $id = (string) ($invoer['id'] ?? '');
            met_slot(function () use ($id) {
                $rest = array_values(array_filter(aanvragen(), fn($a) => $a['id'] !== $id));
                schrijf_json('aanvragen.json', $rest);
            });
            stuur_json(overzicht());

        case 'testmail':
            eis_ingelogd();
            $teller = lees_json('testmail-teller.json', ['aantal' => 0, 'sinds' => time()]);
            if (time() - $teller['sinds'] > 3600) $teller = ['aantal' => 0, 'sinds' => time()];
            if ($teller['aantal'] >= 5) stuur_json(['fout' => 'Je hebt net al een paar testmails gestuurd. Probeer het over een uur nog eens.'], 429);
            $teller['aantal']++;
            schrijf_json('testmail-teller.json', $teller);
            $tijd = date('H:i');
            $gelukt = stuur_mail(
                MAIL_MARJOLEIN,
                "Testmail van boshuispleuntje.nl ($tijd)",
                "Hoi Marjolein,\n\nDit is een testmail van boshuispleuntje.nl, verstuurd om $tijd.\n\n"
                . "Staat deze mail in je inbox? Dan komen mails aan gasten straks ook goed aan.\n"
                . "Staat hij in je spam? Laat het Claude weten.\n\n"
                . "Probeer ook even op 'Beantwoorden' te tikken: het antwoord hoort naar " . MAIL_MARJOLEIN . " te gaan.\n\n"
                . "Groetjes,\nboshuispleuntje.nl\n"
            );
            if (!$gelukt) stuur_json(['fout' => 'De server kon de mail niet versturen. Laat het Claude weten.'], 500);
            stuur_json(['ok' => true, 'tijd' => $tijd]);

        case 'mailinstellingen':
            eis_ingelogd();
            $nieuw = $invoer['mails'] ?? null;
            if (!is_array($nieuw)) stuur_json(['fout' => 'Ongeldig verzoek.'], 400);
            $teksten = [];
            foreach (standaard_mailteksten() as $soort => $standaard) {
                $o = trim(mb_substr((string) ($nieuw['teksten'][$soort]['onderwerp'] ?? ''), 0, 150));
                $t = trim(mb_substr((string) ($nieuw['teksten'][$soort]['tekst'] ?? ''), 0, 8000));
                if ($o === '' || $t === '') stuur_json(['fout' => 'Elke mail moet een onderwerp en een tekst hebben.'], 400);
                $teksten[$soort] = ['onderwerp' => $o, 'tekst' => $t];
            }
            met_slot(function () use ($nieuw, $teksten) {
                $o = opgeslagen();
                $o['mails'] = [
                    'sleutelcode' => trim(mb_substr((string) ($nieuw['sleutelcode'] ?? ''), 0, 40)),
                    'uitchecken' => trim(mb_substr((string) ($nieuw['uitchecken'] ?? ''), 0, 4000)),
                    'teksten' => $teksten,
                    'versie' => 2,
                ];
                schrijf_json('instellingen.json', $o);
            });
            stuur_json(overzicht());

        case 'mailstandaard':
            eis_ingelogd();
            $soort = (string) ($invoer['soort'] ?? '');
            $standaard = standaard_mailteksten()[$soort] ?? null;
            if (!$standaard) stuur_json(['fout' => 'Onbekende mail.'], 400);
            stuur_json(['standaard' => $standaard]);

        case 'voorbeeldmail':
            eis_ingelogd();
            $soort = (string) ($invoer['soort'] ?? '');
            if (!isset(standaard_mailteksten()[$soort])) stuur_json(['fout' => 'Onbekende mail.'], 400);
            $teller = lees_json('testmail-teller.json', ['aantal' => 0, 'sinds' => time()]);
            if (time() - $teller['sinds'] > 3600) $teller = ['aantal' => 0, 'sinds' => time()];
            if ($teller['aantal'] >= 15) stuur_json(['fout' => 'Je hebt net al veel voorbeelden gestuurd. Probeer het over een uur nog eens.'], 429);
            $teller['aantal']++;
            schrijf_json('testmail-teller.json', $teller);
            $voorbeeld = [
                'naam' => 'Marjolein (voorbeeld)',
                'email' => MAIL_MARJOLEIN,
                'aankomst' => volgende_dag(date('Y-m-d'), 7),
                'vertrek' => volgende_dag(date('Y-m-d'), 10),
                'personen' => 2,
                'bedrag' => 343.74,
            ];
            if (!verstuur_gastmail($soort, $voorbeeld, false)) stuur_json(['fout' => 'De voorbeeldmail kon niet worden verstuurd.'], 500);
            stuur_json(['ok' => true]);

        case 'review_status':
            eis_ingelogd();
            $id = (string) ($invoer['id'] ?? '');
            $status = (string) ($invoer['status'] ?? '');
            if (!in_array($status, ['geplaatst', 'verborgen', 'verwijderd'], true)) stuur_json(['fout' => 'Ongeldig verzoek.'], 400);
            met_slot(function () use ($id, $status) {
                $lijst = reviews();
                foreach ($lijst as $i => $r) {
                    if ($r['id'] !== $id) continue;
                    if ($status === 'verwijderd') unset($lijst[$i]);
                    else $lijst[$i]['status'] = $status;
                }
                bewaar_reviews($lijst);
            });
            stuur_json(overzicht());

        case 'review_toevoegen':
            eis_ingelogd();
            $naam = trim(mb_substr((string) ($invoer['naam'] ?? ''), 0, 40));
            $tekst = trim(mb_substr(str_replace("\r", '', (string) ($invoer['tekst'] ?? '')), 0, 2000));
            $sterren = (int) ($invoer['sterren'] ?? 0);
            $maand = (string) ($invoer['maand'] ?? '');
            if ($naam === '' || $tekst === '') stuur_json(['fout' => 'Vul een naam en de tekst van de review in.'], 400);
            if ($sterren < 1 || $sterren > 5) stuur_json(['fout' => 'Kies 1 tot 5 sterren.'], 400);
            if (!preg_match('/^\d{4}-\d{2}$/', $maand)) stuur_json(['fout' => 'Kies de maand van het verblijf.'], 400);
            met_slot(function () use ($naam, $tekst, $sterren, $maand) {
                $lijst = reviews();
                $lijst[] = [
                    'id' => 'ab-' . bin2hex(random_bytes(5)),
                    'bron' => 'airbnb',
                    'status' => 'geplaatst',
                    'naam' => $naam,
                    'sterren' => $sterren,
                    'tekst' => $tekst,
                    'maand' => $maand,
                    'ingediend' => date('Y-m-d H:i'),
                ];
                bewaar_reviews($lijst);
            });
            stuur_json(overzicht());

        case 'prijzen':
            eis_ingelogd();
            $nieuw = [];
            foreach (PRIJS_GRENZEN as $k => [$min, $max]) {
                $w = str_replace(',', '.', (string) ($invoer['prijzen'][$k] ?? ''));
                if (!is_numeric($w) || $w < $min || $w > $max) stuur_json(['fout' => 'Controleer de bedragen: één ervan klopt niet.'], 400);
                $nieuw[$k] = round((float) $w, 2);
            }
            met_slot(function () use ($nieuw) {
                $o = opgeslagen();
                $o['prijzen'] = $nieuw;
                schrijf_json('instellingen.json', $o);
            });
            stuur_json(overzicht());

        case 'reservekopie':
            eis_ingelogd();
            if (!stuur_reservekopie()) stuur_json(['fout' => 'De reservekopie kon niet worden verstuurd.'], 500);
            met_slot(function () {
                $stand = lees_json('reservekopie.json', []);
                $stand['laatst'] = time();
                schrijf_json('reservekopie.json', $stand);
            });
            stuur_json(overzicht());

        case 'wachtwoord':
            eis_ingelogd();
            $oud = (string) ($invoer['oud'] ?? '');
            $nieuw = (string) ($invoer['nieuw'] ?? '');
            if (!password_verify($oud, opgeslagen()['wachtwoord_hash'])) stuur_json(['fout' => 'Je huidige wachtwoord klopt niet.'], 400);
            controleer_wachtwoord_sterkte($nieuw);
            met_slot(function () use ($nieuw) {
                $o = opgeslagen();
                $o['wachtwoord_hash'] = password_hash($nieuw, PASSWORD_DEFAULT);
                schrijf_json('instellingen.json', $o);
                schrijf_json('sessies.json', []);
            });
            maak_sessie();
            stuur_json(['ok' => true]);

        default:
            stuur_json(['fout' => 'Onbekende actie.'], 400);
    }
} catch (Throwable $e) {
    stuur_json(['fout' => 'Er ging iets mis op de server. Probeer het zo nog eens.'], 500);
}
