<?php
// Bewaart een boekingsaanvraag van het formulier op boshuispleuntje.nl, zodat Marjolein
// hem op /beheer ziet en met één knop kan bevestigen. (De e-mail gaat daarnaast via Web3Forms.)
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';

const MAX_PER_UUR = 5;
const MAX_OPEN_AANVRAGEN = 200;

function tekst($waarde, int $max): string
{
    $s = trim(is_string($waarde) ? $waarde : (is_numeric($waarde) ? (string) $waarde : ''));
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s) ?? '';
    return mb_substr($s, 0, $max);
}

try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || ($_SERVER['HTTP_X_PLEUNTJE'] ?? '') !== '1') {
        stuur_json(['fout' => 'Ongeldig verzoek.'], 400);
    }
    $in = json_decode(file_get_contents('php://input') ?: '', true);
    if (!is_array($in)) stuur_json(['fout' => 'Ongeldig verzoek.'], 400);

    $aanvraag = [
        'id' => bin2hex(random_bytes(6)),
        'ontvangen' => date('Y-m-d H:i'),
        'naam' => tekst($in['naam'] ?? '', 100),
        'email' => tekst($in['email'] ?? '', 150),
        'telefoon' => tekst($in['telefoon'] ?? '', 40),
        'aankomst' => tekst($in['aankomst'] ?? '', 10),
        'vertrek' => tekst($in['vertrek'] ?? '', 10),
        'personen' => (int) ($in['personen'] ?? 0),
        'honden' => (int) ($in['honden'] ?? 0),
        'totaal' => tekst($in['totaal'] ?? '', 200),
        'bericht' => tekst($in['bericht'] ?? '', 2000),
    ];

    if ($aanvraag['naam'] === '' || !filter_var($aanvraag['email'], FILTER_VALIDATE_EMAIL)) {
        stuur_json(['fout' => 'Vul je naam en een geldig e-mailadres in.'], 400);
    }
    if (!geldige_datum($aanvraag['aankomst']) || !geldige_datum($aanvraag['vertrek']) || $aanvraag['vertrek'] <= $aanvraag['aankomst']) {
        stuur_json(['fout' => 'Kies een geldige aankomst- en vertrekdag.'], 400);
    }
    if ($aanvraag['personen'] < 1 || $aanvraag['personen'] > 3 || $aanvraag['honden'] < 0 || $aanvraag['honden'] > 3) {
        stuur_json(['fout' => 'Maximaal 3 personen en 3 honden.'], 400);
    }
    $regelFout = controleer_regels($aanvraag['aankomst'], $aanvraag['vertrek']);
    if ($regelFout) stuur_json(['fout' => $regelFout], 400);
    $bezet = array_flip(bezette_nachten());
    foreach (nachten($aanvraag['aankomst'], $aanvraag['vertrek']) as $n) {
        if (isset($bezet[$n])) stuur_json(['fout' => 'In die periode is Pleuntje al bezet.'], 409);
    }

    met_slot(function () use ($aanvraag) {
        // Niet te veel aanvragen achter elkaar vanaf hetzelfde adres (tegen spam)
        $teller = lees_json('aanvraag-teller.json', []);
        $sleutel = substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '?') . '|aanvraag'), 0, 16);
        $teller = array_filter($teller, fn($t) => time() - $t['sinds'] < 3600);
        $t = $teller[$sleutel] ?? ['aantal' => 0, 'sinds' => time()];
        if ($t['aantal'] >= MAX_PER_UUR) stuur_json(['fout' => 'Te veel aanvragen achter elkaar. Probeer het later nog eens.'], 429);
        $t['aantal']++;
        $teller[$sleutel] = $t;
        schrijf_json('aanvraag-teller.json', $teller);

        $lijst = aanvragen();
        if (count($lijst) >= MAX_OPEN_AANVRAGEN) stuur_json(['fout' => 'Er kan op dit moment geen aanvraag worden opgeslagen.'], 503);
        $lijst[] = $aanvraag;
        schrijf_json('aanvragen.json', $lijst);
    });

    stuur_json(['ok' => true]);
} catch (Throwable $e) {
    stuur_json(['fout' => 'Er ging iets mis op de server.'], 500);
}
