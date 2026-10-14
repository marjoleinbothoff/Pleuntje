<?php
// Agendalink voor Airbnb: de datums die Marjolein op boshuispleuntje.nl/beheer blokkeert.
// Airbnb-boekingen zelf staan hier bewust niet in, anders gaan ze heen en weer.
// Er staan geen namen in, alleen "Bezet".
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';
require __DIR__ . '/lib/boeken.php';

onderhoud();

function ical_tekst(string $s): string
{
    return addcslashes($s, ",;\\");
}

try {
    $regels = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//boshuispleuntje.nl//Agenda//NL',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:' . ical_tekst('Pleuntje (boshuispleuntje.nl)'),
    ];
    $stempel = gmdate('Ymd\THis\Z');
    $vandaag = date('Y-m-d');
    foreach (blokkades() as $b) {
        if ($b['vertrek'] < $vandaag) continue;
        $regels[] = 'BEGIN:VEVENT';
        $regels[] = 'UID:' . $b['id'] . '@boshuispleuntje.nl';
        $regels[] = 'DTSTAMP:' . $stempel;
        $regels[] = 'DTSTART;VALUE=DATE:' . str_replace('-', '', $b['aankomst']);
        $regels[] = 'DTEND;VALUE=DATE:' . str_replace('-', '', $b['vertrek']);
        $regels[] = 'SUMMARY:Bezet';
        $regels[] = 'TRANSP:OPAQUE';
        $regels[] = 'END:VEVENT';
    }
    $regels[] = 'END:VCALENDAR';

    header('Content-Type: text/calendar; charset=utf-8');
    header('Content-Disposition: inline; filename="pleuntje.ics"');
    header('Cache-Control: no-store');
    echo implode("\r\n", $regels) . "\r\n";
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Agenda tijdelijk niet beschikbaar.';
}
