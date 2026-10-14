<?php
// Openbaar: de geplaatste reviews voor op boshuispleuntje.nl
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';
require __DIR__ . '/lib/boeken.php';
require_once __DIR__ . '/lib/reviews.php';

try {
    $lijst = openbare_reviews();
    $gemiddeld = $lijst ? round(array_sum(array_column($lijst, 'sterren')) / count($lijst), 1) : null;
    stuur_json(['reviews' => $lijst, 'gemiddeld' => $gemiddeld, 'aantal' => count($lijst)]);
} catch (Throwable $e) {
    stuur_json(['reviews' => [], 'gemiddeld' => null, 'aantal' => 0]);
}
