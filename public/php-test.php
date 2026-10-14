<?php
// Tijdelijk testbestand: kijkt of de server bij Vimexx kan wat de beheerpagina nodig heeft.
// Wordt na de test weer verwijderd.
header('Content-Type: text/html; charset=utf-8');

$ok = '✅';
$nee = '❌';

// 1. Kan de server een bestandje opslaan en weer teruglezen?
$testbestand = __DIR__ . '/.php-test-' . bin2hex(random_bytes(4));
$opslaan = @file_put_contents($testbestand, 'test') === 4 && @file_get_contents($testbestand) === 'test';
@unlink($testbestand);

// 2. Kan de server de Airbnb-agenda ophalen?
$ophalen = false;
if (function_exists('curl_init')) {
    $ch = curl_init('https://www.airbnb.nl/robots.txt');
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10, CURLOPT_FOLLOWLOCATION => true]);
    $antwoord = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $ophalen = $antwoord !== false && $code >= 200 && $code < 400;
}
?>
<!doctype html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Test</title></head>
<body style="font-family: system-ui, sans-serif; font-size: 22px; line-height: 1.8; padding: 24px;">
<p><?= $ok ?> PHP werkt (versie <?= htmlspecialchars(PHP_VERSION) ?>)</p>
<p><?= $opslaan ? $ok : $nee ?> Opslaan van gegevens</p>
<p><?= $ophalen ? $ok : $nee ?> Ophalen van de Airbnb-agenda</p>
</body>
</html>
