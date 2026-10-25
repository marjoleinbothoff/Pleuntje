<?php
// Direct boeken op boshuispleuntje.nl: houdt de datums even vast en stuurt de gast naar Mollie.
//   GET  ?modus=1  → kan er online geboekt worden? ('live', 'test' alleen voor Marjolein, of 'uit')
//   POST           → maakt de boeking en de betaling aan, geeft de Mollie-betaallink terug
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';
require __DIR__ . '/lib/boeken.php';

const MAX_PER_UUR = 8;

function tekst($waarde, int $max): string
{
    $s = trim(is_string($waarde) ? $waarde : (is_numeric($waarde) ? (string) $waarde : ''));
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s) ?? '';
    return mb_substr($s, 0, $max);
}

// Testbetalingen zijn alleen voor Marjolein (ingelogd op /beheer); gewone bezoekers zien dan
// nog het oude aanvraagformulier, zodat niemand per ongeluk een nep-betaling doet.
function modus_voor_bezoeker(): string
{
    $m = mollie_modus();
    if ($m === 'test' && !ingelogd()) return 'uit';
    return tarieven() ? $m : 'uit';
}

try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
        stuur_json(['modus' => modus_voor_bezoeker()]);
    }
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || ($_SERVER['HTTP_X_PLEUNTJE'] ?? '') !== '1') {
        stuur_json(['fout' => 'Ongeldig verzoek.'], 400);
    }
    $modus = modus_voor_bezoeker();
    if ($modus === 'uit') stuur_json(['fout' => 'Online boeken is op dit moment niet mogelijk. Neem contact met ons op.'], 503);

    $in = json_decode(file_get_contents('php://input') ?: '', true);
    if (!is_array($in)) stuur_json(['fout' => 'Ongeldig verzoek.'], 400);

    $b = [
        'id' => bin2hex(random_bytes(8)),
        'sleutel' => bin2hex(random_bytes(12)), // geheim deel van de terugkeerlink
        'aangemaakt' => date('Y-m-d H:i'),
        'status' => 'wacht',
        'vasthouden_tot' => time() + VASTHOUDEN_MINUTEN * 60,
        'naam' => tekst($in['naam'] ?? '', 100),
        'email' => tekst($in['email'] ?? '', 150),
        'telefoon' => tekst($in['telefoon'] ?? '', 40),
        'aankomst' => tekst($in['aankomst'] ?? '', 10),
        'vertrek' => tekst($in['vertrek'] ?? '', 10),
        'personen' => (int) ($in['personen'] ?? 0),
        'honden' => (int) ($in['honden'] ?? 0),
        'bericht' => tekst($in['bericht'] ?? '', 2000),
        'akkoord_voorwaarden' => !empty($in['akkoord']) ? date('Y-m-d H:i') : null,
        'mollie_sleutel_soort' => $modus,
        'taal' => gast_taal($in['taal'] ?? ''),
    ];

    if ($b['naam'] === '' || !filter_var($b['email'], FILTER_VALIDATE_EMAIL)) stuur_json(['fout' => 'Vul je naam en een geldig e-mailadres in.'], 400);
    if (!$b['akkoord_voorwaarden']) stuur_json(['fout' => 'Ga eerst akkoord met de algemene voorwaarden.'], 400);
    if (!geldige_datum($b['aankomst']) || !geldige_datum($b['vertrek']) || $b['vertrek'] <= $b['aankomst']) stuur_json(['fout' => 'Kies een geldige aankomst- en vertrekdag.'], 400);
    if ($b['personen'] < 1 || $b['personen'] > 3 || $b['honden'] < 0 || $b['honden'] > 3) stuur_json(['fout' => 'Maximaal 3 personen en 3 honden.'], 400);
    $regelFout = controleer_regels($b['aankomst'], $b['vertrek']);
    if ($regelFout) stuur_json(['fout' => $regelFout], 400);

    $prijs = bereken_prijs($b['aankomst'], $b['vertrek'], $b['personen'], $b['honden']);
    if (!$prijs) stuur_json(['fout' => 'Voor deze datums kan de prijs nog niet worden berekend. Neem contact met ons op.'], 400);
    $b['bedrag'] = $prijs['totaal'];
    $b['toeristenbelasting'] = $prijs['belasting'];

    // Eerst de nieuwste Airbnb-agenda ophalen, zodat we niet boeken wat net via Airbnb weg is
    airbnb_boekingen(true);

    // Datums vastzetten (in één keer controleren en opslaan, zodat twee mensen niet tegelijk kunnen boeken)
    $fout = met_slot(function () use ($b) {
        $teller = array_filter(lees_json('boek-teller.json', []), fn($t) => time() - $t['sinds'] < 3600);
        $sleutel = substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '?') . '|boek'), 0, 16);
        $t = $teller[$sleutel] ?? ['aantal' => 0, 'sinds' => time()];
        if ($t['aantal'] >= MAX_PER_UUR) return ['Te veel pogingen achter elkaar. Probeer het later nog eens.', 429];
        $t['aantal']++;
        $teller[$sleutel] = $t;
        schrijf_json('boek-teller.json', $teller);

        $bezet = array_flip(bezette_nachten());
        foreach (nachten($b['aankomst'], $b['vertrek']) as $n) {
            if (isset($bezet[$n])) return ['Helaas, deze datums zijn net bezet geraakt. Kies een andere periode.', 409];
        }
        $lijst = boekingen();
        $lijst[] = $b;
        bewaar_boekingen($lijst);
        return null;
    });
    if ($fout) stuur_json(['fout' => $fout[0]], $fout[1]);

    // Betaling aanmaken bij Mollie (betaalpagina en terugkeerpagina in de taal van de gast)
    $taalPad = $b['taal'] === 'nl' ? '' : '/' . $b['taal'];
    $mollieTaal = ['nl' => 'nl_NL', 'de' => 'de_DE', 'en' => 'en_GB', 'fr' => 'fr_FR'][$b['taal']];
    $r = mollie_verzoek('POST', '/payments', [
        'amount' => ['currency' => 'EUR', 'value' => number_format($b['bedrag'], 2, '.', '')],
        'description' => 'Pleuntje ' . date('j-n-Y', strtotime($b['aankomst'])) . ' t/m ' . date('j-n-Y', strtotime($b['vertrek'])),
        'redirectUrl' => SITE_URL . $taalPad . '/boeking/?id=' . $b['id'] . '&k=' . $b['sleutel'],
        'webhookUrl' => SITE_URL . '/api/mollie-webhook.php',
        'locale' => $mollieTaal,
        'metadata' => ['boeking' => $b['id']],
    ]);
    $betaallink = $r['data']['_links']['checkout']['href'] ?? null;
    $mollieId = $r['data']['id'] ?? null;
    if ($r['code'] !== 201 || !$betaallink || !$mollieId) {
        werk_boeking_bij($b['id'], function ($x) {
            $x['status'] = 'mislukt';
            $x['mollie_status'] = 'aanmaken mislukt';
            return $x;
        });
        stuur_json(['fout' => 'Het betalen kon niet worden gestart. Probeer het zo nog eens, of neem contact met ons op.'], 502);
    }
    werk_boeking_bij($b['id'], function ($x) use ($mollieId) {
        $x['mollie_id'] = $mollieId;
        return $x;
    });
    if (($b['mollie_sleutel_soort'] ?? '') !== 'test') tel_gebeurtenis('betaling_gestart');

    stuur_json(['betaallink' => $betaallink]);
} catch (Throwable $e) {
    stuur_json(['fout' => 'Er ging iets mis op de server. Probeer het zo nog eens.'], 500);
}
