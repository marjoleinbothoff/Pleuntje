@AGENTS.md

# Werkafspraken met Marjolein (eigenaar van Pleuntje)

- Marjolein is geen programmeur. Leg dingen uit in gewone, eenvoudige taal (Nederlands), zonder technische termen.
- **Kan iets simpeler of met minder handelingen? Zeg dat dan altijd meteen uit jezelf**, ook als ze er niet om vraagt. Liever één keer iets instellen dan steeds handmatig herhalen.
- Laat haar zo min mogelijk zelf doen in systemen die ze niet kent (GitHub, hosting). Als het toch moet: kleine stappen, één tegelijk, en zeg vooraf dat er niets kapot kan gaan.

# Hoe de site online komt

- De site draait op boshuispleuntje.nl bij Vimexx (DirectAdmin, server web0175.zxcs.nl).
- **Publiceren gaat automatisch**: elke push naar de branch `claude/pleun-vacation-rental-site-69bw2g` bouwt de site via GitHub Actions (`.github/workflows/build.yml`) en zet hem via FTP op Vimexx (map `/domains/boshuispleuntje.nl/public_html/`, FTP-account `github@boshuispleuntje.nl`). De gegevens staan als GitHub-secrets FTP_SERVER, FTP_USERNAME, FTP_PASSWORD en FTP_MAP.
- Marjolein hoeft dus **geen zip-bestanden meer te uploaden**. Na een wijziging: committen, pushen, controleren dat de Actions-run (inclusief de stap "Upload naar Vimexx") geslaagd is, en haar vragen even te kijken.
- Mislukt de stap "Upload naar Vimexx" een keer? Probeer eerst opnieuw (`gh run rerun <id> --failed`); de FTP-verbinding hapert soms even.
- Een reservekopie van elke build staat als zip op de branch `website-zip`.

# Agenda en beschikbaarheid (sinds 14 okt 2026)

- Marjolein beheert de agenda **zelf** op boshuispleuntje.nl/beheer (wachtwoord). Datums staan NIET meer in de code; pas dus geen lijstjes in de code aan voor boekingen.
- Server-deel in `public/api/` (PHP 8.3 bij Vimexx): `beschikbaarheid.php` (openbaar, alleen bezette nachten), `agenda.php` (iCal-link die Airbnb inleest: alleen haar eigen blokkades, zonder namen), `beheer.php` (inloggen en blokkades). Gedeelde code in `public/api/lib/` (afgeschermd met .htaccess).
- Gegevens staan op de server in `/domains/boshuispleuntje.nl/pleuntje-gegevens/` (buiten public_html), met een dagelijkse reservekopie van de blokkades.
- De Airbnb-agenda wordt elk kwartier opgehaald. De Airbnb-link staat versleuteld in `public/api/lib/instellingen.php` en wordt bij het opzetten met de opstartcode ontsleuteld. Zet de Airbnb-link nooit leesbaar in de code: de repository is openbaar.
- **Wachtwoord vergeten?** Maak een nieuwe opstartcode: nieuw `opzet_id`, nieuwe `opzet_code_hash` en de Airbnb-link opnieuw versleuteld (AES-256-GCM, sleutel = sha256("pleuntje-opzet-v1|" + code zonder streepjes), opgeslagen als base64(iv12 + tag16 + data)). Publiceer, en geef haar de code in het gesprek. Blokkades blijven bewaard.
- **Airbnb-koppeling is klaar (14 okt 2026)**: in Airbnb staat bij Instellingen → Beschikbaarheid → Kalenders koppelen de kalender "Boshuispleuntje. nl" met de link https://boshuispleuntje.nl/api/agenda.php. Airbnb accepteerde de .php-link; verander die link dus niet, anders moet hij in Airbnb opnieuw worden ingevuld. Airbnb haalt hem zelf om de paar uur op; met "Vernieuwen" in Airbnb gaat het direct.
- Marjolein heeft boshuispleuntje.nl/beheer op het beginscherm van haar iPhone staan.
- Andere takken dan de live-tak worden door `.github/workflows/controle.yml` gebouwd en gecontroleerd zonder te publiceren: handig om eerst te testen.

# Nog te doen (op verzoek van Marjolein, later)


- **Google Bedrijfsprofiel: NIET doen.** Google staat geen Bedrijfsprofiel toe voor losse vakantiewoningen ("Rental or for-sale properties such as vacation homes" zijn ineligible, support.google.com/business/answer/13763036). Zichtbaarheid in Google loopt via de site zelf (titel, omschrijving, schema.org LodgingBusiness in `src/app/layout.tsx`, sitemap, Search Console) en via vermeldingen op verhuurplatforms die naar de site linken.
- Schoolvakanties staan t/m schooljaar 2028-2029 in `src/data/highSeason.ts`. Rond juni 2027 schooljaar 2029-2030 toevoegen (Marjolein heeft een herinnering op 1 juni 2027).
