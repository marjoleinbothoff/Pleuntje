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
- Denk bij nieuwe functies zelf mee over regels en randgevallen en benoem ze vooraf; Marjolein wil niet alles zelf hoeven bedenken.
- Marjolein heeft boshuispleuntje.nl/beheer op het beginscherm van haar iPhone staan.
- Andere takken dan de live-tak worden door `.github/workflows/controle.yml` gebouwd en gecontroleerd zonder te publiceren: handig om eerst te testen.

# Nog te doen (op verzoek van Marjolein, later)

- **Reviews op de site bouwen** (Marjolein vroeg expliciet om haar eraan te herinneren): gasten via boshuispleuntje.nl kunnen geen Airbnb-review geven en een Google-bedrijfsprofiel mag niet. Plek op de site maken waar gasten een beoordeling achterlaten; daarna de vertrekmail daarnaar laten verwijzen (tot die tijd: 'beantwoord deze mail').



- **Google Bedrijfsprofiel: NIET doen.** Google staat geen Bedrijfsprofiel toe voor losse vakantiewoningen ("Rental or for-sale properties such as vacation homes" zijn ineligible, support.google.com/business/answer/13763036). Zichtbaarheid in Google loopt via de site zelf (titel, omschrijving, schema.org LodgingBusiness in `src/app/layout.tsx`, sitemap, Search Console) en via vermeldingen op verhuurplatforms die naar de site linken.
- Schoolvakanties staan t/m schooljaar 2028-2029 in `src/data/highSeason.ts`. Rond juni 2027 schooljaar 2029-2030 toevoegen (Marjolein heeft een herinnering op 1 juni 2027).
