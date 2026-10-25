<?php
// Ontvangt een seintje van elke pagina (en bij het openen van het boekingsvenster) om bezoekers te tellen.
// Bewaart geen IP-adres en zet geen cookie; zie lib/teller.php.
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';

header('Cache-Control: no-store');
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(204);
    exit;
}
$invoer = json_decode((string)file_get_contents('php://input', false, null, 0, 2000), true);
if (is_array($invoer)) {
    $soort = in_array($invoer['s'] ?? '', ['pagina', 'boekvenster'], true) ? $invoer['s'] : 'pagina';
    tel_bezoek($soort, (string)($invoer['p'] ?? '/'), (string)($invoer['r'] ?? ''), (string)($invoer['t'] ?? 'nl'));
}
http_response_code(204);
