<?php
// Achterkant van boshuispleuntje.nl/beheer: inloggen en blokkades beheren.
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';

const COOKIE_NAAM = 'pleuntje_beheer';
const INLOG_DAGEN = 90;

// ---------- Hulpjes ----------

function invoer(): array
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') stuur_json(['fout' => 'Ongeldig verzoek.'], 405);
    // Alleen verzoeken vanaf de eigen beheerpagina (andere sites kunnen deze kop niet meesturen).
    if (($_SERVER['HTTP_X_PLEUNTJE'] ?? '') !== '1') stuur_json(['fout' => 'Ongeldig verzoek.'], 403);
    $data = json_decode(file_get_contents('php://input') ?: '', true);
    return is_array($data) ? $data : [];
}

function opgeslagen(): array
{
    return lees_json('instellingen.json', []);
}

function opzet_nodig(): bool
{
    $o = opgeslagen();
    return empty($o['wachtwoord_hash']) || ($o['opzet_id'] ?? '') !== instellingen()['opzet_id'];
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

function ingelogd(): bool
{
    $token = $_COOKIE[COOKIE_NAAM] ?? '';
    if (!is_string($token) || strlen($token) !== 64 || opzet_nodig()) return false;
    $sessies = lees_json('sessies.json', []);
    $verloopt = $sessies[hash('sha256', $token)] ?? 0;
    return $verloopt > time();
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
        'airbnbOpgehaald' => ($airbnb['opgehaald'] ?? 0) ? date('d-m-Y H:i', $airbnb['opgehaald']) : null,
        'nachten' => bezette_nachten(),
        'eigenNachten' => array_keys($eigenNachten),
    ];
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
            if (!empty($invoer['ververs'])) airbnb_boekingen(true);
            stuur_json(overzicht());

        case 'blokkeer':
            eis_ingelogd();
            $aankomst = $invoer['aankomst'] ?? '';
            $vertrek = $invoer['vertrek'] ?? '';
            $omschrijving = trim(mb_substr((string) ($invoer['omschrijving'] ?? ''), 0, 80));
            if (!geldige_datum($aankomst) || !geldige_datum($vertrek)) stuur_json(['fout' => 'Kies een eerste en een laatste dag.'], 400);
            if ($vertrek <= $aankomst) stuur_json(['fout' => 'De vertrekdag moet na de aankomstdag liggen.'], 400);
            if (count(nachten($aankomst, $vertrek)) > 400) stuur_json(['fout' => 'Dat is een erg lange periode. Blokkeer maximaal ruim een jaar tegelijk.'], 400);
            met_slot(function () use ($aankomst, $vertrek, $omschrijving) {
                $lijst = blokkades();
                $lijst[] = [
                    'id' => bin2hex(random_bytes(5)),
                    'aankomst' => $aankomst,
                    'vertrek' => $vertrek,
                    'omschrijving' => $omschrijving !== '' ? $omschrijving : 'Geblokkeerd',
                ];
                schrijf_json('blokkades.json', $lijst);
            });
            stuur_json(overzicht());

        case 'verwijder':
            eis_ingelogd();
            $id = (string) ($invoer['id'] ?? '');
            met_slot(function () use ($id) {
                $lijst = array_values(array_filter(blokkades(), fn($b) => $b['id'] !== $id));
                schrijf_json('blokkades.json', $lijst);
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
