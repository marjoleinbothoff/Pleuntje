<?php
// Openbaar: welke nachten Pleuntje bezet is (zonder namen of andere details).
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';
require __DIR__ . '/lib/boeken.php';

onderhoud();

try {
    stuur_json(['nachten' => bezette_nachten(), 'regels' => regels(), 'prijzen' => prijzen(), 'vandaag' => date('Y-m-d')]);
} catch (Throwable $e) {
    stuur_json(['fout' => 'Beschikbaarheid kon niet worden geladen.'], 500);
}
