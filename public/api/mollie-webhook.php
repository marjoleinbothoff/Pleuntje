<?php
// Mollie meldt hier dat er iets met een betaling is gebeurd. We vragen de echte status
// zelf op bij Mollie (een melding hier kan dus niets vervalsen).
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';
require __DIR__ . '/lib/boeken.php';
tel_computer();

try {
    $mollieId = (string) ($_POST['id'] ?? '');
    if (preg_match('/^tr_[A-Za-z0-9]+$/', $mollieId)) {
        foreach (boekingen() as $b) {
            if (($b['mollie_id'] ?? '') === $mollieId) {
                verwerk_betaling($b['id']);
                break;
            }
        }
    }
} catch (Throwable $e) {
    // Mollie probeert het later vanzelf opnieuw als we geen 200 teruggeven
    http_response_code(500);
    exit;
}
http_response_code(200);
echo 'ok';
