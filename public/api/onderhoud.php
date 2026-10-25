<?php
// Wordt elk uur aangeroepen (via GitHub) en loopt ook mee met gewone bezoeken.
// Doet alleen wat er op dat moment nodig is; vaker aanroepen kan geen kwaad.
define('PLEUNTJE', true);
require __DIR__ . '/lib/kern.php';
require __DIR__ . '/lib/boeken.php';
tel_computer();

onderhoud();
airbnb_boekingen();
stuur_json(['ok' => true, 'gegevens' => privacy_controle(false)['map']]);
