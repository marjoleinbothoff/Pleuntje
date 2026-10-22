<?php
// Gastmails in het Duits, Engels en Frans (22 okt 2026, op verzoek van Marjolein).
// Een gast die via de Duitse, Engelse of Franse website boekt, krijgt de mails in die taal.
// Dit zijn de standaardvertalingen van de Nederlandse standaardteksten; Marjolein kan ze
// aanpassen op /beheer (knopje met de taal boven "De mails").
defined('PLEUNTJE') or exit;

const VERTAALDE_TALEN = ['de', 'en', 'fr'];
const TAALNAAM_NL = ['nl' => 'Nederlands', 'de' => 'Duits', 'en' => 'Engels', 'fr' => 'Frans'];

// Links naar de routepagina's in de taal van de gast
function routelink(string $taal): string
{
    return $taal === 'nl' ? ROUTELINK : 'https://boshuispleuntje.nl/' . $taal . '/route-naar-pleuntje/';
}

function parklink(string $taal): string
{
    return $taal === 'nl' ? PARKLINK : 'https://boshuispleuntje.nl/' . $taal . '/afval-en-uitgang/';
}

// Kleine vaste zinnetjes die de server zelf in de mail zet
function mail_zinnetjes(string $taal): array
{
    $z = [
        'nl' => [
            'bijlage' => '(Deze plattegrond zit ook als bijlage onderaan deze mail.)',
            'geen_code' => '(de code krijg je nog van ons)',
            'gast' => 'gast',
            'review_vangnet' => 'Wil je een review voor ons achterlaten? Dat kan hier:',
        ],
        'de' => [
            'bijlage' => '(Diesen Plan findest du auch als Anhang unten in dieser E-Mail.)',
            'geen_code' => '(den Code bekommst du noch von uns)',
            'gast' => 'Gast',
            'review_vangnet' => 'Möchtest du eine Bewertung für uns hinterlassen? Das geht hier:',
        ],
        'en' => [
            'bijlage' => '(This map is also attached at the bottom of this email.)',
            'geen_code' => '(we will send you the code separately)',
            'gast' => 'guest',
            'review_vangnet' => 'Would you like to leave us a review? You can do so here:',
        ],
        'fr' => [
            'bijlage' => '(Ce plan est également joint en bas de cet e-mail.)',
            'geen_code' => '(nous vous enverrons le code séparément)',
            'gast' => 'cher hôte',
            'review_vangnet' => 'Voulez-vous nous laisser un avis ? C\'est possible ici :',
        ],
    ];
    return $z[$taal] ?? $z['nl'];
}

function standaard_uitchecken_vertaald(): array
{
    return [
        'de' => "Bevor du abreist:\n"
            . "- Benutzte Handtücher einsammeln, die Bettwäsche abziehen und neben das Bett legen.\n"
            . "- Müll entsorgen: Den Müll kannst du auf dem Park entsorgen. Die Container stehen schräg gegenüber dem kleinen Spielplatz, auf der rechten Seite, wenn du den Park verlässt.\n"
            . "- Die Heizung auf 15 stellen.\n"
            . "- Die Türen abschließen.\n"
            . "- Bitte den Schlüssel mit dem Chip wieder in den Schlüsselkasten legen.\n"
            . "- Das Haus besenrein und frei von Hundehaaren hinterlassen.",
        'en' => "Before you leave:\n"
            . "- Gather the used towels, strip the beds and leave the bed linen next to the bed.\n"
            . "- Take out the rubbish: you can leave it on the park. The bins are diagonally opposite the little playground, on your right as you drive out of the park.\n"
            . "- Set the heating to 15.\n"
            . "- Lock the doors.\n"
            . "- Please put the key with the tag back in the key box.\n"
            . "- Leave the cottage swept clean and free of dog hair.",
        'fr' => "Avant votre départ :\n"
            . "- Rassemblez les serviettes utilisées, retirez le linge de lit et posez-le à côté du lit.\n"
            . "- Jetez vos déchets : vous pouvez les déposer dans le parc. Les conteneurs se trouvent en diagonale en face de la petite aire de jeux, sur votre droite lorsque vous quittez le parc.\n"
            . "- Réglez le chauffage sur 15.\n"
            . "- Fermez les portes à clé.\n"
            . "- Merci de remettre la clé avec le badge dans la boîte à clés.\n"
            . "- Laissez le chalet balayé et sans poils de chien.",
    ];
}

function standaard_mailteksten_vertaald(): array
{
    $groet = [
        'de' => "Liebe Grüße von Marjolein\n\nBoshuis Pleuntje\nboshuispleuntje.nl",
        'en' => "Warm regards,\nMarjolein\n\nBoshuis Pleuntje\nboshuispleuntje.nl",
        'fr' => "Bien cordialement,\nMarjolein\n\nBoshuis Pleuntje\nboshuispleuntje.nl",
    ];
    return [
        'de' => [
            'bevestiging' => [
                'onderwerp' => 'Deine Buchung bei Pleuntje ist bestätigt',
                'tekst' => "Hallo {voornaam},\n\n"
                    . "schön, dass du dich für Pleuntje entschieden hast! Deine Zahlung ist eingegangen und deine Buchung ist verbindlich.\n\n"
                    . "Anreise: {aankomst}, Check-in ab 15:00 Uhr\n"
                    . "Abreise: {vertrek}, Check-out um 11:00 Uhr\n"
                    . "Anzahl Nächte: {nachten}\n"
                    . "Personen: {personen}\n"
                    . "Bezahlt: {bedrag}\n\n"
                    . "Mit deiner Buchung hast du unsere Hausregeln und Bedingungen akzeptiert. Hier kannst du sie noch einmal nachlesen: https://boshuispleuntje.nl/de/algemene-voorwaarden/\n\n"
                    . "Einen Tag vor der Anreise bekommst du alle praktischen Infos zum Einchecken. "
                    . "Wenn du in der Zwischenzeit Fragen hast, sag mir gern Bescheid: Antworte einfach auf diese E-Mail.\n\n"
                    . $groet['de'],
            ],
            'aankomst' => [
                'onderwerp' => 'Morgen geht es los zu Pleuntje!',
                'tekst' => "Hallo {voornaam},\n\n"
                    . "nur noch einmal schlafen, dann bist du zu Gast bei Pleuntje! In dieser Nachricht findest du alle Informationen, die du für einen schönen Aufenthalt brauchst.\n\n"
                    . "Du hast vom {aankomst} bis {vertrek} gebucht und kannst ab 15:00 Uhr einchecken. Der Check-out ist um 11:00 Uhr.\n\n"
                    . "Wegbeschreibung zu Pleuntje:\n"
                    . "Auf diesem Plan siehst du den Weg zu Pleuntje, zu Fuß und mit dem Auto:\n" . routelink('de') . "\n\n"
                    . "Navigiere zur Poolseweg 27 in Putten. Parke dein Auto auf dem Parkplatz oder am Straßenrand und geh zu Fuß zu Pleun.\n\n"
                    . "Zu Fuß:\n"
                    . "Vom Parkplatz / der Schranke biegst du links ab und nimmst dann den zweiten Weg rechts, \"De Berkenlaan\". "
                    . "Pleuntje ist dann das dritte Chalet auf der linken Seite, Nummer 125.\n\n"
                    . "An der Seite des Schuppens findest du den Schlüsselkasten, öffne ihn mit dem Code {sleutelcode}. "
                    . "Im Schlüsselkasten findest du den Schlüssel und den Chip, mit dem du die Schranke öffnen kannst. "
                    . "Nimm beides mit und öffne die Schranke mit dem Chip.\n\n"
                    . "Mit dem Auto auf dem Park zu Pleuntje:\n"
                    . "Du fährst unter der Schranke hindurch auf den Park und geradeaus, bis du links einen kleinen Spielplatz siehst. "
                    . "Dort fährst du vorbei und biegst nach dem Chalet an der Ecke links ab. "
                    . "Dann wieder links und danach rechts, dann den zweiten Weg links, und Pleun ist auf der rechten Seite, Nummer 125.\n\n"
                    . "Parkplan (Müll und Ausfahrt):\n"
                    . "Auf diesem Plan siehst du, wo du deinen Müll entsorgen kannst und wo die Ausfahrt ist:\n" . parklink('de') . "\n\n"
                    . "Klappt bei der Ankunft etwas nicht? Ruf mich gern an oder schreib mir per WhatsApp: +31 6 42 90 28 07.\n\n"
                    . "Der Urlaub kann beginnen!\n\n"
                    . $groet['de'],
            ],
            'avond_voor_vertrek' => [
                'onderwerp' => 'Morgen reist du von Pleuntje ab',
                'tekst' => "Hallo {voornaam},\n\n"
                    . "danke, dass du bei uns zu Gast warst, ich wünsche euch eine gute Heimreise. "
                    . "Die Abreise ist morgen um 11:00 Uhr.\n\n"
                    . "{uitchecken}\n\n"
                    . $groet['de'],
            ],
            'vertrekdag' => [
                'onderwerp' => 'Danke für deinen Aufenthalt bei Pleuntje',
                'tekst' => "Hallo {voornaam},\n\n"
                    . "ich hoffe, ihr habt euren Aufenthalt genossen, und vielleicht bis zum nächsten Mal!\n\n"
                    . "Wir würden gern hören, wie es dir gefallen hat! Möchtest du eine Bewertung für uns hinterlassen? Das geht hier:\n{reviewlink}\n\n"
                    . "Gute Heimreise!\n\n"
                    . $groet['de'],
            ],
        ],
        'en' => [
            'bevestiging' => [
                'onderwerp' => 'Your booking at Pleuntje is confirmed',
                'tekst' => "Dear {voornaam},\n\n"
                    . "Thank you for choosing Pleuntje! We have received your payment and your booking is confirmed.\n\n"
                    . "Arrival: {aankomst}, check-in from 3 pm\n"
                    . "Departure: {vertrek}, check-out at 11 am\n"
                    . "Number of nights: {nachten}\n"
                    . "Guests: {personen}\n"
                    . "Paid: {bedrag}\n\n"
                    . "When booking, you agreed to our house rules and terms and conditions. You can read them again here: https://boshuispleuntje.nl/en/algemene-voorwaarden/\n\n"
                    . "The day before your arrival you will receive all the practical information about checking in. "
                    . "If you have any questions in the meantime, just let me know: simply reply to this email.\n\n"
                    . $groet['en'],
            ],
            'aankomst' => [
                'onderwerp' => 'Tomorrow you are off to Pleuntje!',
                'tekst' => "Dear {voornaam},\n\n"
                    . "Just one more sleep and you will be staying at Pleuntje! In this message you will find all the information you need for a lovely stay.\n\n"
                    . "You have booked from {aankomst} to {vertrek}. Check-in is from 3 pm and check-out is at 11 am.\n\n"
                    . "Directions to Pleuntje:\n"
                    . "On this map you can see the route to Pleuntje, on foot and by car:\n" . routelink('en') . "\n\n"
                    . "Navigate to Poolseweg 27 in Putten. Park your car in the car park or on the verge and walk to Pleun.\n\n"
                    . "Route on foot:\n"
                    . "From the car park / barrier, turn left and then take the second path on the right, \"De Berkenlaan\". "
                    . "Pleuntje is then the third chalet on your left, number 125.\n\n"
                    . "On the side of the shed you will find the key box; open it with the code {sleutelcode}. "
                    . "Inside the key box you will find the key and the tag that opens the barrier. "
                    . "Take them with you and open the barrier with the tag.\n\n"
                    . "Route by car on the park:\n"
                    . "Drive onto the park under the barrier and carry straight on until you see a small playground on your left. "
                    . "Drive past it and turn left after the chalet on the corner. "
                    . "Then turn left again and then right, then take the second path on the left, and Pleun is on your right, number 125.\n\n"
                    . "Park map (rubbish and exit):\n"
                    . "On this map you can see where to leave your rubbish and where the exit is:\n" . parklink('en') . "\n\n"
                    . "If anything goes wrong when you arrive, feel free to call or WhatsApp me on +31 6 42 90 28 07.\n\n"
                    . "Let the holiday begin!\n\n"
                    . $groet['en'],
            ],
            'avond_voor_vertrek' => [
                'onderwerp' => 'Tomorrow you will be leaving Pleuntje',
                'tekst' => "Dear {voornaam},\n\n"
                    . "Thank you for staying with us, and I wish you a safe journey home. "
                    . "Check-out is tomorrow morning at 11 am.\n\n"
                    . "{uitchecken}\n\n"
                    . $groet['en'],
            ],
            'vertrekdag' => [
                'onderwerp' => 'Thank you for staying at Pleuntje',
                'tekst' => "Hi {voornaam},\n\n"
                    . "I hope you enjoyed your stay, and who knows, see you next time!\n\n"
                    . "We would love to hear what you thought! Would you like to leave us a review? You can do so here:\n{reviewlink}\n\n"
                    . "Have a safe trip home!\n\n"
                    . $groet['en'],
            ],
        ],
        'fr' => [
            'bevestiging' => [
                'onderwerp' => 'Votre réservation chez Pleuntje est confirmée',
                'tekst' => "Bonjour {voornaam},\n\n"
                    . "Merci d'avoir choisi Pleuntje ! Nous avons bien reçu votre paiement et votre réservation est confirmée.\n\n"
                    . "Arrivée : {aankomst}, à partir de 15 h\n"
                    . "Départ : {vertrek}, avant 11 h\n"
                    . "Nombre de nuits : {nachten}\n"
                    . "Personnes : {personen}\n"
                    . "Montant payé : {bedrag}\n\n"
                    . "En réservant, vous avez accepté notre règlement intérieur et nos conditions. Vous pouvez les relire ici : https://boshuispleuntje.nl/fr/algemene-voorwaarden/\n\n"
                    . "La veille de votre arrivée, vous recevrez toutes les informations pratiques pour votre arrivée. "
                    . "Si vous avez des questions d'ici là, n'hésitez pas : répondez simplement à cet e-mail.\n\n"
                    . $groet['fr'],
            ],
            'aankomst' => [
                'onderwerp' => 'Demain, direction Pleuntje !',
                'tekst' => "Bonjour {voornaam},\n\n"
                    . "Plus qu'une nuit et vous voilà chez Pleuntje ! Vous trouverez dans ce message toutes les informations utiles pour un agréable séjour.\n\n"
                    . "Vous avez réservé du {aankomst} au {vertrek}. Vous pouvez arriver à partir de 15 h ; le départ est à 11 h.\n\n"
                    . "Itinéraire jusqu'à Pleuntje :\n"
                    . "Sur ce plan, vous voyez le chemin jusqu'à Pleuntje, à pied et en voiture :\n" . routelink('fr') . "\n\n"
                    . "Indiquez Poolseweg 27 à Putten dans votre GPS. Garez votre voiture sur le parking ou sur le bas-côté et rejoignez Pleun à pied.\n\n"
                    . "À pied :\n"
                    . "Depuis le parking / la barrière, tournez à gauche puis prenez le deuxième chemin à droite, « De Berkenlaan ». "
                    . "Pleuntje est alors le troisième chalet sur votre gauche, numéro 125.\n\n"
                    . "Sur le côté de la remise se trouve la boîte à clés ; ouvrez-la avec le code {sleutelcode}. "
                    . "Dans la boîte à clés se trouvent la clé et le badge qui ouvre la barrière. "
                    . "Prenez-les avec vous et ouvrez la barrière avec le badge.\n\n"
                    . "En voiture dans le parc :\n"
                    . "Entrez dans le parc en passant sous la barrière et continuez tout droit jusqu'à voir une petite aire de jeux sur votre gauche. "
                    . "Dépassez-la et tournez à gauche après le chalet du coin. "
                    . "Tournez ensuite encore à gauche puis à droite, prenez le deuxième chemin à gauche : Pleun se trouve sur votre droite, numéro 125.\n\n"
                    . "Plan du parc (déchets et sortie) :\n"
                    . "Sur ce plan, vous voyez où déposer vos déchets et où se trouve la sortie :\n" . parklink('fr') . "\n\n"
                    . "Un souci à votre arrivée ? N'hésitez pas à m'appeler ou à m'écrire sur WhatsApp au +31 6 42 90 28 07.\n\n"
                    . "Bonnes vacances !\n\n"
                    . $groet['fr'],
            ],
            'avond_voor_vertrek' => [
                'onderwerp' => 'Demain, vous quittez Pleuntje',
                'tekst' => "Bonjour {voornaam},\n\n"
                    . "Merci d'avoir séjourné chez nous, je vous souhaite un bon retour. "
                    . "Le départ est demain matin à 11 h.\n\n"
                    . "{uitchecken}\n\n"
                    . $groet['fr'],
            ],
            'vertrekdag' => [
                'onderwerp' => 'Merci pour votre séjour chez Pleuntje',
                'tekst' => "Bonjour {voornaam},\n\n"
                    . "J'espère que vous avez apprécié votre séjour, et qui sait, à une prochaine fois !\n\n"
                    . "Nous aimerions beaucoup savoir ce que vous en avez pensé ! Voulez-vous nous laisser un avis ? C'est possible ici :\n{reviewlink}\n\n"
                    . "Bon retour !\n\n"
                    . $groet['fr'],
            ],
        ],
    ];
}

// Datum in de taal van de gast, bijv. "Freitag, 30. Oktober 2026"
function datum_taal(string $iso, string $taal): string
{
    if (!in_array($taal, VERTAALDE_TALEN, true)) return datum_nl($iso);
    $namen = [
        'de' => [
            ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
            ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        ],
        'en' => [
            ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        ],
        'fr' => [
            ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
            ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
        ],
    ];
    $d = new DateTimeImmutable($iso);
    $dag = $namen[$taal][0][(int) $d->format('w')];
    $maand = $namen[$taal][1][(int) $d->format('n') - 1];
    $j = (int) $d->format('j');
    $jaar = $d->format('Y');
    if ($taal === 'de') return "$dag, $j. $maand $jaar";
    if ($taal === 'fr') return "$dag " . ($j === 1 ? '1er' : $j) . " $maand $jaar";
    return "$dag $j $maand $jaar";
}

function euro_taal(float $bedrag, string $taal): string
{
    return $taal === 'en' ? '€' . number_format($bedrag, 2, '.', ',') : euro($bedrag);
}
