<?php
// Openbaar: welke nachten Pleuntje bezet is (zonder namen of andere details).
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';

try {
    stuur_json(['nachten' => bezette_nachten(), 'regels' => regels(), 'vandaag' => date('Y-m-d')]);
} catch (Throwable $e) {
    stuur_json(['fout' => 'Beschikbaarheid kon niet worden geladen.'], 500);
}
