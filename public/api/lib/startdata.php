<?php
// De boekingen die al op boshuispleuntje.nl stonden voordat de beheerpagina er was.
// Wordt één keer overgenomen; daarna beheert Marjolein alles op boshuispleuntje.nl/beheer.
defined('PLEUNTJE') or exit;

$lijst = [
    ['2026-09-17', '2026-09-21', 'Nicola'],
    ['2026-10-09', '2026-10-11', 'Gasten'],
    ['2026-10-16', '2026-10-18', 'Gasten'],
    ['2026-10-20', '2026-10-22', 'Maarten'],
    ['2026-10-30', '2026-11-01', 'Gasten'],
    ['2026-11-13', '2026-11-15', 'Gasten'],
    ['2026-11-26', '2026-11-30', 'Nicole, privé'],
    ['2026-12-24', '2027-01-03', 'Marjolein en Ed zelf'],
];

return array_map(fn($b) => [
    'id' => substr(md5($b[0] . $b[1]), 0, 10),
    'aankomst' => $b[0],
    'vertrek' => $b[1],
    'omschrijving' => $b[2],
], $lijst);
