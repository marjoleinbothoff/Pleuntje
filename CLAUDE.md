@AGENTS.md

# Werkafspraken met Marjolein (eigenaar van Pleuntje)

- Marjolein is geen programmeur. Leg dingen uit in gewone, eenvoudige taal (Nederlands), zonder technische termen.
- **Kan iets simpeler of met minder handelingen? Zeg dat dan altijd meteen uit jezelf**, ook als ze er niet om vraagt. Liever één keer iets instellen dan steeds handmatig herhalen.
- Laat haar zo min mogelijk zelf doen in systemen die ze niet kent (GitHub, hosting). Als het toch moet: kleine stappen, één tegelijk, en zeg vooraf dat er niets kapot kan gaan.

# Hoe de site online komt

- De site draait op boshuispleuntje.nl bij Vimexx (DirectAdmin, server web0175.zxcs.nl).
- **Publiceren gaat automatisch**: elke push naar de branch `claude/pleun-vacation-rental-site-69bw2g` bouwt de site via GitHub Actions (`.github/workflows/build.yml`) en zet hem via FTP op Vimexx (map `/domains/boshuispleuntje.nl/public_html/`, FTP-account `github@boshuispleuntje.nl`). De gegevens staan als GitHub-secrets FTP_SERVER, FTP_USERNAME, FTP_PASSWORD en FTP_MAP.
- Marjolein hoeft dus **geen zip-bestanden meer te uploaden**. Na een wijziging: committen, pushen, controleren dat de Actions-run (inclusief de stap "Upload naar Vimexx") geslaagd is, en haar vragen even te kijken.
- Mislukt de stap "Run npm run build" op de live-tak terwijl dezelfde versie bij de controle wél lukte? Dat is een hapering (bijv. bij het ophalen van lettertypes): draai de mislukte job opnieuw (`gh api -X POST repos/marjoleinbothoff/Pleuntje/actions/runs/<id>/rerun-failed-jobs`).
- Mislukt de stap "Upload naar Vimexx" een keer? Probeer eerst opnieuw (`gh run rerun <id> --failed`); de FTP-verbinding hapert soms even.
- Een reservekopie van elke build staat als zip op de branch `website-zip`.

# Agenda en beschikbaarheid (sinds 14 okt 2026)

- Marjolein beheert de agenda **zelf** op boshuispleuntje.nl/beheer (wachtwoord). Datums staan NIET meer in de code; pas dus geen lijstjes in de code aan voor boekingen.
- Server-deel in `public/api/` (PHP 8.3 bij Vimexx): `beschikbaarheid.php` (openbaar, alleen bezette nachten), `agenda.php` (iCal-link die Airbnb inleest: alleen haar eigen blokkades, zonder namen), `beheer.php` (inloggen en blokkades). Gedeelde code in `public/api/lib/` (afgeschermd met .htaccess).
- Gegevens staan op de server in `/domains/boshuispleuntje.nl/pleuntje-gegevens/` (buiten public_html), met een dagelijkse reservekopie van de blokkades.
- De Airbnb-agenda wordt elk kwartier opgehaald. De Airbnb-link staat versleuteld in `public/api/lib/instellingen.php` en wordt bij het opzetten met de opstartcode ontsleuteld. Zet de Airbnb-link nooit leesbaar in de code: de repository is openbaar.
- **Wachtwoord vergeten?** Maak een nieuwe opstartcode: nieuw `opzet_id`, nieuwe `opzet_code_hash` en de Airbnb-link opnieuw versleuteld (AES-256-GCM, sleutel = sha256("pleuntje-opzet-v1|" + code zonder streepjes), opgeslagen als base64(iv12 + tag16 + data)). Publiceer, en geef haar de code in het gesprek. Blokkades blijven bewaard.
- **Airbnb-koppeling is klaar (14 okt 2026)**: in Airbnb staat bij Instellingen → Beschikbaarheid → Kalenders koppelen de kalender "Boshuispleuntje. nl" met de link https://boshuispleuntje.nl/api/agenda.php. Airbnb accepteerde de .php-link; verander die link dus niet, anders moet hij in Airbnb opnieuw worden ingevuld. Airbnb haalt hem zelf om de paar uur op; met "Vernieuwen" in Airbnb gaat het direct.
- **Boekingsregels** (min/max nachten, dagen vooraf, maanden vooruit) stelt Marjolein zelf in op /beheer; standaard 2 / 21 / 2 / 12, gelijk aan Airbnb. Kalender, formulier en server (`controleer_regels` in kern.php) dwingen ze af. Regels gaan niet via de iCal-koppeling: Airbnb heeft zijn eigen regels.
- **Aanvragen**: het formulier stuurt de e-mail via Web3Forms én slaat de aanvraag op via `public/api/aanvraag.php`. Op /beheer staat elke aanvraag met **Bevestigen** (blokkeert de datums, ook voor Airbnb) en **Afwijzen**. De gast krijgt geen automatisch bericht. Open aanvragen worden 30 dagen na de vertrekdatum opgeruimd (privacy).
- **Direct boeken en betalen (Mollie)**: `public/api/boek.php` houdt de datums 20 min vast, rekent de prijs op de server uit (`/api-data/tarieven.json`, bij elke build gemaakt uit `src/lib/pricing.ts` en `src/data/highSeason.ts`: pas tarieven dus alleen daar aan), ververst eerst Airbnb en maakt een Mollie-betaling. `mollie-webhook.php` en `boeking-status.php` ronden af: blokkade aanmaken (met veld `boeking`), bevestiging aan gast, melding aan Marjolein. Logica in `public/api/lib/boeken.php`. Marjolein besloot: meteen betalen, geen goedkeuring vooraf (risico's met haar doorgenomen).
- **Live sinds 14 okt 2026**: testboeking geslaagd (betaling, terugkeerpagina, mails), daarna live-sleutel ingevuld. Gasten boeken en betalen nu direct.
- De Mollie-sleutel vult Marjolein in op /beheer (staat alleen op de server). Met een `test_`-sleutel ziet alleen zij (ingelogd) "Boeken en betalen"; bezoekers krijgen dan nog het aanvraagformulier. Zonder sleutel: aanvraagformulier.
- `onderhoud()` (open betalingen nalopen, opruimen) draait mee met bezoeken, met Airbnb's ophalen van agenda.php, en elk uur via `.github/workflows/onderhoud.yml`. Geplande mails horen hier straks ook in.
- **Gastmails** (`public/api/lib/gastmails.php`): bevestiging direct na betalen; dag voor aankomst 9:00 (route, sleutelkluisje); avond voor vertrek 18:00 (uitcheck-lijst); vertrekdag 9:00 (bedankt, 'beantwoord deze mail'). Geen halverwege-mail (Marjolein wil dat niet). Teksten = haar eigen Airbnb-berichten; ze past ze aan op /beheer. Code sleutelkluisje staat alleen op de server (nooit in de code). Mails gaan naar boekingen via de site (geen testboekingen) en naar handmatige blokkades met e-mailadres; Marjolein krijgt steeds een kopie. Versturen via `onderhoud()`: eerst vastleggen, dan versturen (nooit dubbel); >12 uur te laat wordt overgeslagen, behalve last-minute aankomstmail.
- Gastmails v2 (14 okt 2026): aankomstmail bevat 'Bel of app me gerust op 06 42 90 28 07', bevestiging bevat link naar /algemene-voorwaarden/. Eerder opgeslagen teksten zijn eenmalig bijgewerkt (`mails.versie` = 2); daarna niet meer automatisch. Wifi staat in het boek in het huisje, hoeft niet in de mail.
- **Toeristenbelasting**: /beheer toont per jaar (nachten per jaar verdeeld) wat via de site is ontvangen; `toeristenbelasting` wordt per boeking opgeslagen in boek.php. Alleen betaalde, niet-test boekingen via de site. Marjolein draagt zelf af aan gemeente Putten.
- **Annuleren door gast** gaat handmatig: terugbetalen in Mollie, datums vrijgeven op /beheer (geplande mails stoppen dan), gast zelf mailen.
- **Prijzen** stelt Marjolein zelf in op /beheer (`instellingen.json` → `prijzen`). `prijzen()` in boeken.php: haar prijzen, anders de standaard uit `src/lib/pricing.ts` (via tarieven.json). De site haalt ze op via beschikbaarheid.php; Mollie-bedrag rekent de server met dezelfde prijzen. Welke dagen hoogseizoen zijn blijft in de code (`src/data/highSeason.ts`). `priceRange` in layout.tsx (voor Google) is vast: bij grote prijswijziging even bijwerken.
- **Reservekopie**: `onderhoud()` mailt elke week een JSON-reservekopie naar Marjolein (blokkades, boekingen, aanvragen, reviews, instellingen zonder wachtwoord/sleutels/sleutelcode). Op /beheer: 'Stuur nu een reservekopie'. Terugzetten bestaat nog niet als knop: bij nood de JSON-bestanden opnieuw op de server zetten (bijv. eenmalige beheer-actie bouwen).
- **Privacycontrole**: de uurlijkse GitHub-taak controleert dat gegevensbestanden en beheer.php (zonder inloggen) niet op te vragen zijn; faalt dan → GitHub mailt de eigenaar. De server controleert dit ook dagelijks zelf en mailt Marjolein bij een lek. De taak zet zichzelf elk uur 'aan' (tegen het uitschakelen na 60 dagen).
- **Reviews** (`public/api/lib/reviews.php`, sinds 14 okt 2026): vertrekmail bevat `{reviewlink}`, een persoonlijke link (HMAC met geheim in instellingen.json) naar /review; één review per verblijf, tot 90 dagen na vertrek, met toestemming. Nieuwe reviews wachten op Marjoleins goedkeuring op /beheer (Plaatsen / Niet plaatsen / Verwijderen). Op de homepage staat 'Wat gasten zeggen' (verborgen zolang er geen geplaatste reviews zijn). Airbnb-reviews: Marjolein stuurt schermafbeeldingen, Claude zet ze in `public/api/lib/reviews-start.php` (vaste id per review, worden één keer overgenomen); zij kan ook zelf toevoegen op /beheer. 1-5 sterren toegestaan (bewuste keuze).
- Denk bij nieuwe functies zelf mee over regels en randgevallen en benoem ze vooraf; Marjolein wil niet alles zelf hoeven bedenken.
- Marjolein heeft boshuispleuntje.nl/beheer op het beginscherm van haar iPhone staan.
- Andere takken dan de live-tak worden door `.github/workflows/controle.yml` gebouwd en gecontroleerd zonder te publiceren: handig om eerst te testen.

# Nog te doen (op verzoek van Marjolein, later)

- **Nieuwe uitstraling (bezig, 14 okt 2026)**: proef op tak `claude/groen` (NIET live). Uitgangspunt is de live site, met: overal donkergroen in plaats van oranje, grote foto bovenaan met dun menu (Hero/Header), tegeltjes met icoontjes vervangen door regels met lijntjes (Highlights). Marjolein wil groen maar met een warme toon. Ze kreeg 3 kleurvoorbeelden: 1 bosgroen, 2 mosgroen (olijf), 3 bosgroen + honing/goudbruine accenten (kleurwaarden in scratchpad varianten.py; nu staat 1 in globals.css). Wacht op haar keuze, daarna op `claude/groen` vastleggen, controleren en pas live zetten als zij akkoord is. Een uitgebreider herontwerp staat op `claude/agenda-beheer`; dat vond ze lastig te beoordelen (ze wil de site als één geheel zien, en hele pagina's naast elkaar vergelijken, niet in losse stukjes).
  - Volgende keer ook bespreken (haar vraag 14 okt 22:40): grotere foto's bij het binnenkijkje (woonkamer, badkamer enz.), zoals in het herontwerp op `claude/agenda-beheer` (grote fotogrid op zandkleur, met labels). Laat dat zien als voorbeeld binnen de gekozen kleur, als hele pagina, en spar erover met haar.




- **Google Bedrijfsprofiel: NIET doen.** Google staat geen Bedrijfsprofiel toe voor losse vakantiewoningen ("Rental or for-sale properties such as vacation homes" zijn ineligible, support.google.com/business/answer/13763036). Zichtbaarheid in Google loopt via de site zelf (titel, omschrijving, schema.org LodgingBusiness in `src/app/layout.tsx`, sitemap, Search Console) en via vermeldingen op verhuurplatforms die naar de site linken.
- Schoolvakanties staan t/m schooljaar 2028-2029 in `src/data/highSeason.ts`. Rond juni 2027 schooljaar 2029-2030 toevoegen (Marjolein heeft een herinnering op 1 juni 2027).
