<?php
// "Een vraag?" op boshuispleuntje.nl: een gast stelt zonder te boeken een vraag.
// De vraag gaat als mail naar info@boshuispleuntje.nl; 'Beantwoorden' gaat naar de gast.
// Er wordt niets bewaard (privacy).
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';

const MAX_VRAGEN_PER_UUR = 5;

function schoon($waarde, int $max): string
{
    $s = trim(is_string($waarde) ? $waarde : '');
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s) ?? '';
    return mb_substr($s, 0, $max);
}

try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || ($_SERVER['HTTP_X_PLEUNTJE'] ?? '') !== '1') {
        stuur_json(['fout' => 'Ongeldig verzoek.'], 400);
    }
    $in = json_decode(file_get_contents('php://input') ?: '', true);
    if (!is_array($in)) stuur_json(['fout' => 'Ongeldig verzoek.'], 400);

    // Verborgen vakje: alleen spamrobots vullen dat in. Doe alsof het gelukt is.
    if (!empty($in['botcheck'])) stuur_json(['ok' => true]);

    $naam = schoon($in['naam'] ?? '', 100);
    $email = schoon($in['email'] ?? '', 150);
    $vraag = schoon($in['vraag'] ?? '', 3000);
    // Geen regeleinden in naam/e-mail (die komen in het onderwerp en de kopregels)
    $naam = str_replace(["\r", "\n"], ' ', $naam);
    if ($naam === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $vraag === '') {
        stuur_json(['fout' => 'Vul je naam, een geldig e-mailadres en je vraag in.'], 400);
    }

    met_slot(function () {
        $teller = lees_json('vraag-teller.json', []);
        $sleutel = substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '?') . '|vraag'), 0, 16);
        $teller = array_filter($teller, fn($t) => time() - $t['sinds'] < 3600);
        $t = $teller[$sleutel] ?? ['aantal' => 0, 'sinds' => time()];
        if ($t['aantal'] >= MAX_VRAGEN_PER_UUR) stuur_json(['fout' => 'Te veel berichten achter elkaar. Probeer het later nog eens.'], 429);
        $t['aantal']++;
        $teller[$sleutel] = $t;
        schrijf_json('vraag-teller.json', $teller);
    });

    $tekst = "Nieuwe vraag via boshuispleuntje.nl\n\n"
        . "Naam: $naam\n"
        . "E-mail: $email\n"
        . taal_regel(gast_taal($in['taal'] ?? '')) . "\n"
        . "Vraag:\n$vraag\n\n"
        . "Klik op 'Beantwoorden' om direct te antwoorden.";
    $gelukt = stuur_mail(MAIL_MARJOLEIN, 'Vraag over Pleuntje van ' . $naam, $tekst, $email);
    if (!$gelukt) stuur_json(['fout' => 'Het versturen lukte niet.'], 502);
    tel_gebeurtenis('vraag');

    stuur_json(['ok' => true]);
} catch (Throwable $e) {
    stuur_json(['fout' => 'Er ging iets mis op de server.'], 500);
}
