<?php
// Voor de pagina waar de gast na het betalen terugkomt: is de boeking gelukt?
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';
require __DIR__ . '/lib/boeken.php';

try {
    $id = (string) ($_GET['id'] ?? '');
    $sleutel = (string) ($_GET['k'] ?? '');
    $b = preg_match('/^[a-f0-9]{16}$/', $id) ? zoek_boeking($id) : null;
    if (!$b || !hash_equals($b['sleutel'], $sleutel)) stuur_json(['status' => 'onbekend'], 404);

    // Voor het geval Mollie's eigen melding nog niet binnen is
    $b = verwerk_betaling($id) ?? $b;

    stuur_json([
        'status' => in_array($b['status'], ['betaald', 'mislukt', 'verlopen', 'geannuleerd'], true) ? $b['status'] : 'wacht',
        'aankomst' => $b['aankomst'],
        'vertrek' => $b['vertrek'],
        'email' => $b['email'],
        'test' => ($b['mollie_sleutel_soort'] ?? '') === 'test',
    ]);
} catch (Throwable $e) {
    stuur_json(['status' => 'wacht'], 200);
}
