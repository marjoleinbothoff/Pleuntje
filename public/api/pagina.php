<?php
// Zoekmachines en andere computers die een pagina opvragen komen via .htaccess hier langs,
// zodat ze in het ochtendoverzicht staan (zij draaien meestal geen JavaScript en worden anders niet gezien).
// Daarna krijgen ze gewoon de normale pagina, precies zoals iedereen.
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';

$basis = realpath(dirname(__DIR__));
$pad = rawurldecode((string)parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH));
if (str_ends_with($pad, '/')) $pad .= 'index.html';
$bestand = realpath($basis . '/' . ltrim($pad, '/'));
// Alleen echte .html-bestanden binnen de site
if (!$bestand || !str_starts_with($bestand, $basis . DIRECTORY_SEPARATOR) || !str_ends_with($bestand, '.html') || !is_file($bestand)) {
    tel_computer();
    http_response_code(404);
    $nietGevonden = $basis . '/404.html';
    if (is_file($nietGevonden)) {
        header('Content-Type: text/html; charset=UTF-8');
        readfile($nietGevonden);
    }
    exit;
}
tel_computer();
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-cache, must-revalidate');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($bestand)) . ' GMT');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'HEAD') exit;
readfile($bestand);
