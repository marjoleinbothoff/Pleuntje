<?php
// Persoonlijke reviewpagina voor gasten (link uit de vertrekmail).
//   GET  ?b=…&t=…  → mag deze gast een review schrijven?
//   POST           → review insturen (komt eerst bij Marjolein ter goedkeuring)
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';
require __DIR__ . '/lib/boeken.php';
require_once __DIR__ . '/lib/reviews.php';

try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
        $u = review_uitnodiging((string) ($_GET['b'] ?? ''), (string) ($_GET['t'] ?? ''));
        if (isset($u['fout'])) stuur_json(['geldig' => false, 'fout' => $u['fout'], 'alGedaan' => !empty($u['alGedaan'])]);
        $voornaam = trim(explode(' ', trim($u['gast']['naam']))[0] ?? '');
        stuur_json(['geldig' => true, 'voornaam' => $voornaam, 'aankomst' => $u['blokkade']['aankomst'], 'vertrek' => $u['blokkade']['vertrek']]);
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || ($_SERVER['HTTP_X_PLEUNTJE'] ?? '') !== '1') {
        stuur_json(['fout' => 'Ongeldig verzoek.'], 400);
    }
    $in = json_decode(file_get_contents('php://input') ?: '', true);
    if (!is_array($in)) stuur_json(['fout' => 'Ongeldig verzoek.'], 400);

    $u = review_uitnodiging((string) ($in['b'] ?? ''), (string) ($in['t'] ?? ''));
    if (isset($u['fout'])) stuur_json(['fout' => $u['fout']], 400);

    $sterren = (int) ($in['sterren'] ?? 0);
    $naam = trim(mb_substr(preg_replace('/\s+/u', ' ', (string) ($in['naam'] ?? '')) ?? '', 0, 40));
    $tekst = trim(mb_substr(str_replace("\r", '', (string) ($in['tekst'] ?? '')), 0, 2000));
    if ($sterren < 1 || $sterren > 5) stuur_json(['fout' => 'Kies 1 tot 5 sterren.'], 400);
    if ($naam === '') stuur_json(['fout' => 'Vul de naam in die bij je review komt te staan.'], 400);
    if (mb_strlen($tekst) < 10) stuur_json(['fout' => 'Schrijf een paar woorden over je verblijf.'], 400);
    if (empty($in['toestemming'])) stuur_json(['fout' => 'Geef toestemming om je review op de site te plaatsen.'], 400);

    $review = [
        'id' => bin2hex(random_bytes(6)),
        'bron' => 'site',
        'status' => 'wacht',
        'blokkade' => $u['blokkade']['id'],
        'naam' => $naam,
        'sterren' => $sterren,
        'tekst' => $tekst,
        'maand' => substr($u['blokkade']['aankomst'], 0, 7),
        'ingediend' => date('Y-m-d H:i'),
        'toestemming' => date('Y-m-d H:i'),
    ];
    $dubbel = met_slot(function () use ($review) {
        $lijst = reviews();
        foreach ($lijst as $r) if (($r['blokkade'] ?? '') === $review['blokkade']) return true;
        $lijst[] = $review;
        bewaar_reviews($lijst);
        return false;
    });
    if ($dubbel) stuur_json(['fout' => 'Je hebt al een review geschreven. Dank je wel!'], 409);

    stuur_mail(
        MAIL_MARJOLEIN,
        "Nieuwe review van $naam (" . str_repeat('★', $sterren) . ')',
        "Er is een nieuwe review binnengekomen via boshuispleuntje.nl:\n\n"
        . str_repeat('★', $sterren) . str_repeat('☆', 5 - $sterren) . "\n$naam\n\n$tekst\n\n"
        . "De review staat nog niet online. Kijk op boshuispleuntje.nl/beheer om hem te plaatsen.\n"
    );
    stuur_json(['ok' => true]);
} catch (Throwable $e) {
    stuur_json(['fout' => 'Er ging iets mis. Probeer het zo nog eens.'], 500);
}
