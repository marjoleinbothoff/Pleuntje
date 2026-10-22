import { CONTACT_EMAIL } from "@/data/contact";
import type { Taal } from "@/i18n/talen";

// Privacyverklaring en algemene voorwaarden in alle vier de talen.
// De Nederlandse tekst is leidend (dat staat ook boven de vertalingen).
// Pas je iets aan in de Nederlandse tekst, pas het dan ook aan in de vertalingen.

type Juridisch = { titel: string; omschrijving: string; bijgewerkt: string; Inhoud: () => React.ReactNode };

function PrivacyNL() {
  return (
    <>
      <p>
        Dit is de privacyverklaring van Pleuntje, een vakantiehuisje op de
        Veluwe. Hierin lees je welke persoonsgegevens we verzamelen als je
        een verblijf bij ons boekt of contact met ons opneemt, waarom we dat
        doen en wat jouw rechten zijn.
      </p>

      <h2>Wie zijn wij</h2>
      <p>
        Pleuntje wordt verhuurd door Marjolein (en Ed). Heb je vragen over
        deze privacyverklaring of over je gegevens? Neem dan contact met ons
        op via{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>Welke gegevens verzamelen we</h2>
      <p>Als je het boekingsformulier op onze website invult, verzamelen we:</p>
      <ul>
        <li>Je naam</li>
        <li>Je e-mailadres en/of telefoonnummer</li>
        <li>Gewenste aankomst- en vertrekdatum</li>
        <li>Aantal personen en eventueel aantal honden</li>
        <li>Eventuele opmerkingen die je zelf invult</li>
      </ul>
      <p>
        Stuur je ons een e-mail of bel je ons, dan verwerken we de gegevens
        die je ons op die manier geeft.
      </p>

      <h2>Waarom we deze gegevens gebruiken</h2>
      <p>We gebruiken je gegevens uitsluitend om:</p>
      <ul>
        <li>Je boekingsaanvraag te verwerken en met je af te stemmen</li>
        <li>Contact met je op te nemen over je verblijf</li>
        <li>
          Te voldoen aan onze wettelijke verplichtingen, zoals het afdragen
          van toeristenbelasting
        </li>
      </ul>
      <p>We gebruiken je gegevens niet voor marketing en verkopen ze niet door aan derden.</p>

      <h2>Hoe lang we gegevens bewaren</h2>
      <p>
        We bewaren je gegevens niet langer dan nodig is om je boeking af te
        handelen, tenzij we wettelijk verplicht zijn gegevens (zoals
        boekingsgegevens voor de belastingdienst) langer te bewaren.
      </p>

      <h2>Delen met derden</h2>
      <p>
        Betaal je bij het boeken online, dan verloopt de betaling via onze
        betaalpartner{" "}
        <a href="https://www.mollie.com/nl" target="_blank" rel="noopener noreferrer">
          Mollie
        </a>
        . Mollie ontvangt daarvoor het bedrag en de gegevens die nodig zijn
        voor de betaling. Je boekingsgegevens worden bewaard op de server van
        onze website (bij onze Nederlandse hostingpartij), zodat we je boeking
        kunnen afhandelen en je de berichten over je verblijf kunnen sturen.
        Een boeking die niet doorgaat (bijvoorbeeld omdat het betalen is
        afgebroken) wordt na een week verwijderd.
      </p>
      <p>
        Stuur je in plaats daarvan een boekingsaanvraag, dan wordt je
        aanvraag opgeslagen op de server van onze website (bij onze
        Nederlandse hostingpartij) en per e-mail naar ons gestuurd, zodat wij
        hem kunnen bekijken en bevestigen. Een aanvraag die niet doorgaat
        halen we weg; openstaande aanvragen worden uiterlijk 30 dagen na de
        gewenste vertrekdatum automatisch verwijderd. We delen je gegevens
        verder niet met andere partijen, behalve als we daartoe wettelijk
        verplicht zijn.
      </p>
      <p>
        Stel je ons een vraag via het formulier &quot;Een vraag?&quot;, dan gaan je
        naam, e-mailadres en vraag via de server van onze website als e-mail
        naar ons. We gebruiken ze alleen om je vraag te beantwoorden en slaan
        ze verder nergens op.
      </p>

      <h2>Reviews</h2>
      <p>
        Na je verblijf kun je via een persoonlijke link een review schrijven.
        Daarvoor bewaren we je sterren, je tekst en de naam die je zelf kiest.
        Je review komt alleen op onze website als je daar toestemming voor
        geeft en wij hem hebben bekeken. Wil je dat we je review weghalen? Laat
        het ons weten, dan doen we dat.
      </p>

      <h2>Cookies</h2>
      <p>
        Onze website gebruikt geen tracking- of advertentiecookies. De
        lettertypes op de website worden door onze eigen server geleverd,
        niet via een externe dienst die cookies plaatst. Kies je een taal,
        dan onthoudt je browser die keuze (alleen op je eigen apparaat).
      </p>

      <h2>Jouw rechten</h2>
      <p>Je hebt het recht om:</p>
      <ul>
        <li>Te weten welke gegevens we van je hebben</li>
        <li>Deze gegevens in te zien, te laten corrigeren of te laten verwijderen</li>
        <li>Bezwaar te maken tegen het gebruik van je gegevens</li>
      </ul>
      <p>
        Wil je hier gebruik van maken? Stuur dan een e-mail naar{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Kom je er
        met ons niet uit, dan kun je een klacht indienen bij de{" "}
        <a
          href="https://autoriteitpersoonsgegevens.nl/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Autoriteit Persoonsgegevens
        </a>
        .
      </p>

      <h2>Beveiliging</h2>
      <p>
        We gaan zorgvuldig met je gegevens om en nemen passende maatregelen
        om misbruik, verlies of onbevoegde toegang te voorkomen.
      </p>
    </>
  );
}

function PrivacyDE() {
  return (
    <>
      <p>
        Dies ist die Datenschutzerklärung von Pleuntje, einem Ferienhaus in
        der Veluwe (Niederlande). Hier erfährst du, welche personenbezogenen
        Daten wir erheben, wenn du einen Aufenthalt bei uns buchst oder Kontakt
        mit uns aufnimmst, warum wir das tun und welche Rechte du hast.
      </p>

      <h2>Wer wir sind</h2>
      <p>
        Pleuntje wird von Marjolein (und Ed) vermietet. Hast du Fragen zu
        dieser Datenschutzerklärung oder zu deinen Daten? Dann schreib uns an{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>Welche Daten wir erheben</h2>
      <p>Wenn du das Buchungsformular auf unserer Website ausfüllst, erheben wir:</p>
      <ul>
        <li>Deinen Namen</li>
        <li>Deine E-Mail-Adresse und/oder Telefonnummer</li>
        <li>Gewünschtes Anreise- und Abreisedatum</li>
        <li>Anzahl der Personen und gegebenenfalls der Hunde</li>
        <li>Anmerkungen, die du selbst eingibst</li>
      </ul>
      <p>
        Schickst du uns eine E-Mail oder rufst du uns an, dann verarbeiten wir
        die Daten, die du uns auf diesem Weg mitteilst.
      </p>

      <h2>Wofür wir diese Daten verwenden</h2>
      <p>Wir verwenden deine Daten ausschließlich, um:</p>
      <ul>
        <li>Deine Buchung bzw. Buchungsanfrage zu bearbeiten und mit dir abzustimmen</li>
        <li>Mit dir über deinen Aufenthalt in Kontakt zu treten</li>
        <li>
          Unseren gesetzlichen Pflichten nachzukommen, zum Beispiel der
          Abführung der Kurtaxe (Touristensteuer)
        </li>
      </ul>
      <p>Wir verwenden deine Daten nicht für Werbung und verkaufen sie nicht an Dritte.</p>

      <h2>Wie lange wir Daten speichern</h2>
      <p>
        Wir speichern deine Daten nicht länger als nötig, um deine Buchung
        abzuwickeln, es sei denn, wir sind gesetzlich verpflichtet, Daten (zum
        Beispiel Buchungsdaten für das Finanzamt) länger aufzubewahren.
      </p>

      <h2>Weitergabe an Dritte</h2>
      <p>
        Bezahlst du beim Buchen online, dann läuft die Zahlung über unseren
        Zahlungsdienstleister{" "}
        <a href="https://www.mollie.com/de" target="_blank" rel="noopener noreferrer">
          Mollie
        </a>
        . Mollie erhält dafür den Betrag und die Daten, die für die Zahlung
        nötig sind. Deine Buchungsdaten werden auf dem Server unserer Website
        (bei unserem niederländischen Hosting-Anbieter) gespeichert, damit wir
        deine Buchung abwickeln und dir die Nachrichten zu deinem Aufenthalt
        schicken können. Eine Buchung, die nicht zustande kommt (zum Beispiel
        weil die Zahlung abgebrochen wurde), wird nach einer Woche gelöscht.
      </p>
      <p>
        Schickst du stattdessen eine Buchungsanfrage, dann wird deine Anfrage
        auf dem Server unserer Website (bei unserem niederländischen
        Hosting-Anbieter) gespeichert und uns per E-Mail zugeschickt, damit wir
        sie prüfen und bestätigen können. Anfragen, die nicht zustande kommen,
        löschen wir; offene Anfragen werden spätestens 30 Tage nach dem
        gewünschten Abreisedatum automatisch gelöscht. Darüber hinaus geben wir
        deine Daten nicht an andere weiter, es sei denn, wir sind gesetzlich
        dazu verpflichtet.
      </p>
      <p>
        Stellst du uns eine Frage über das Formular &bdquo;Eine Frage?&ldquo;,
        dann werden dein Name, deine E-Mail-Adresse und deine Frage über den
        Server unserer Website per E-Mail an uns geschickt. Wir verwenden sie
        nur, um deine Frage zu beantworten, und speichern sie nirgendwo sonst.
      </p>

      <h2>Bewertungen</h2>
      <p>
        Nach deinem Aufenthalt kannst du über einen persönlichen Link eine
        Bewertung schreiben. Dafür speichern wir deine Sterne, deinen Text und
        den Namen, den du selbst wählst. Deine Bewertung erscheint nur dann auf
        unserer Website, wenn du zustimmst und wir sie geprüft haben. Möchtest
        du, dass wir deine Bewertung entfernen? Gib uns Bescheid, dann tun wir
        das.
      </p>

      <h2>Cookies</h2>
      <p>
        Unsere Website verwendet keine Tracking- oder Werbe-Cookies. Die
        Schriftarten auf der Website werden von unserem eigenen Server
        geliefert, nicht über einen externen Dienst, der Cookies setzt. Wählst
        du eine Sprache, merkt sich dein Browser diese Wahl (nur auf deinem
        eigenen Gerät).
      </p>

      <h2>Deine Rechte</h2>
      <p>Du hast das Recht:</p>
      <ul>
        <li>Zu erfahren, welche Daten wir über dich gespeichert haben</li>
        <li>Diese Daten einzusehen, berichtigen oder löschen zu lassen</li>
        <li>Der Verwendung deiner Daten zu widersprechen</li>
      </ul>
      <p>
        Möchtest du davon Gebrauch machen? Dann schick eine E-Mail an{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Kommen wir
        nicht zu einer Lösung, kannst du eine Beschwerde bei der
        niederländischen Datenschutzbehörde{" "}
        <a
          href="https://autoriteitpersoonsgegevens.nl/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Autoriteit Persoonsgegevens
        </a>{" "}
        einreichen.
      </p>

      <h2>Sicherheit</h2>
      <p>
        Wir gehen sorgfältig mit deinen Daten um und treffen angemessene
        Maßnahmen, um Missbrauch, Verlust oder unbefugten Zugriff zu
        verhindern.
      </p>
    </>
  );
}

function PrivacyEN() {
  return (
    <>
      <p>
        This is the privacy statement of Pleuntje, a holiday cottage on the
        Veluwe in the Netherlands. It explains which personal data we collect
        when you book a stay with us or get in touch with us, why we do so and
        what your rights are.
      </p>

      <h2>Who we are</h2>
      <p>
        Pleuntje is rented out by Marjolein (and Ed). Do you have questions
        about this privacy statement or about your data? Please contact us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>What data we collect</h2>
      <p>When you fill in the booking form on our website, we collect:</p>
      <ul>
        <li>Your name</li>
        <li>Your email address and/or phone number</li>
        <li>Your preferred arrival and departure dates</li>
        <li>The number of guests and, if applicable, the number of dogs</li>
        <li>Any comments you add yourself</li>
      </ul>
      <p>
        If you send us an email or call us, we process the information you
        give us that way.
      </p>

      <h2>Why we use this data</h2>
      <p>We only use your data to:</p>
      <ul>
        <li>Process your booking or booking request and arrange it with you</li>
        <li>Contact you about your stay</li>
        <li>
          Meet our legal obligations, such as paying the local tourist tax
        </li>
      </ul>
      <p>We do not use your data for marketing and we do not sell it to third parties.</p>

      <h2>How long we keep data</h2>
      <p>
        We keep your data no longer than necessary to handle your booking,
        unless we are legally required to keep data (such as booking details
        for the tax authorities) for longer.
      </p>

      <h2>Sharing with third parties</h2>
      <p>
        If you pay online when booking, the payment is handled by our payment
        provider{" "}
        <a href="https://www.mollie.com/en" target="_blank" rel="noopener noreferrer">
          Mollie
        </a>
        . Mollie receives the amount and the details needed for the payment.
        Your booking details are stored on our website&apos;s server (with our
        Dutch hosting provider), so that we can handle your booking and send
        you the messages about your stay. A booking that does not go ahead
        (for example because the payment was cancelled) is deleted after one
        week.
      </p>
      <p>
        If you send a booking request instead, your request is stored on our
        website&apos;s server (with our Dutch hosting provider) and emailed to
        us, so that we can review and confirm it. Requests that do not go
        ahead are removed; open requests are deleted automatically no later
        than 30 days after the requested departure date. We do not share your
        data with any other parties, unless we are legally required to do so.
      </p>
      <p>
        If you ask us a question using the &quot;Any questions?&quot; form,
        your name, email address and question are sent to us by email via our
        website&apos;s server. We only use them to answer your question and do
        not store them anywhere else.
      </p>

      <h2>Reviews</h2>
      <p>
        After your stay you can write a review via a personal link. For this
        we store your stars, your text and the name you choose. Your review is
        only published on our website if you give permission and we have
        checked it. Would you like us to remove your review? Let us know and
        we will.
      </p>

      <h2>Cookies</h2>
      <p>
        Our website does not use tracking or advertising cookies. The fonts on
        the website are served by our own server, not by an external service
        that places cookies. If you choose a language, your browser remembers
        that choice (only on your own device).
      </p>

      <h2>Your rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Know what data we hold about you</li>
        <li>View this data and have it corrected or deleted</li>
        <li>Object to the use of your data</li>
      </ul>
      <p>
        Would you like to exercise these rights? Send an email to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. If we cannot
        resolve the matter together, you can file a complaint with the Dutch
        Data Protection Authority, the{" "}
        <a
          href="https://autoriteitpersoonsgegevens.nl/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Autoriteit Persoonsgegevens
        </a>
        .
      </p>

      <h2>Security</h2>
      <p>
        We handle your data with care and take appropriate measures to prevent
        misuse, loss or unauthorised access.
      </p>
    </>
  );
}

function PrivacyFR() {
  return (
    <>
      <p>
        Ceci est la déclaration de confidentialité de Pleuntje, un chalet de
        vacances en Veluwe (Pays-Bas). Vous y découvrirez quelles données
        personnelles nous collectons lorsque vous réservez un séjour chez nous
        ou que vous nous contactez, pourquoi nous le faisons et quels sont vos
        droits.
      </p>

      <h2>Qui sommes-nous</h2>
      <p>
        Pleuntje est loué par Marjolein (et Ed). Vous avez des questions sur
        cette déclaration de confidentialité ou sur vos données ? Contactez-nous
        à l&apos;adresse{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>Quelles données nous collectons</h2>
      <p>Lorsque vous remplissez le formulaire de réservation sur notre site, nous collectons :</p>
      <ul>
        <li>Votre nom</li>
        <li>Votre adresse e-mail et/ou votre numéro de téléphone</li>
        <li>Vos dates d&apos;arrivée et de départ souhaitées</li>
        <li>Le nombre de personnes et, le cas échéant, le nombre de chiens</li>
        <li>Les remarques éventuelles que vous ajoutez vous-même</li>
      </ul>
      <p>
        Si vous nous envoyez un e-mail ou nous appelez, nous traitons les
        informations que vous nous communiquez de cette manière.
      </p>

      <h2>Pourquoi nous utilisons ces données</h2>
      <p>Nous utilisons vos données uniquement pour :</p>
      <ul>
        <li>Traiter votre réservation ou demande de réservation et l&apos;organiser avec vous</li>
        <li>Vous contacter au sujet de votre séjour</li>
        <li>
          Respecter nos obligations légales, comme le versement de la taxe de
          séjour
        </li>
      </ul>
      <p>Nous n&apos;utilisons pas vos données à des fins de marketing et ne les vendons pas à des tiers.</p>

      <h2>Durée de conservation</h2>
      <p>
        Nous ne conservons pas vos données plus longtemps que nécessaire pour
        traiter votre réservation, sauf si la loi nous oblige à conserver
        certaines données (comme les données de réservation pour
        l&apos;administration fiscale) plus longtemps.
      </p>

      <h2>Partage avec des tiers</h2>
      <p>
        Si vous payez en ligne lors de la réservation, le paiement est traité
        par notre prestataire de paiement{" "}
        <a href="https://www.mollie.com/fr" target="_blank" rel="noopener noreferrer">
          Mollie
        </a>
        . Mollie reçoit pour cela le montant et les données nécessaires au
        paiement. Vos données de réservation sont conservées sur le serveur de
        notre site (chez notre hébergeur néerlandais), afin que nous puissions
        traiter votre réservation et vous envoyer les messages concernant
        votre séjour. Une réservation qui n&apos;aboutit pas (par exemple parce
        que le paiement a été interrompu) est supprimée au bout d&apos;une
        semaine.
      </p>
      <p>
        Si vous envoyez plutôt une demande de réservation, votre demande est
        conservée sur le serveur de notre site (chez notre hébergeur
        néerlandais) et nous est envoyée par e-mail, afin que nous puissions
        l&apos;examiner et la confirmer. Les demandes qui n&apos;aboutissent pas
        sont supprimées ; les demandes en attente sont automatiquement
        supprimées au plus tard 30 jours après la date de départ souhaitée.
        Nous ne partageons pas vos données avec d&apos;autres parties, sauf si
        la loi nous y oblige.
      </p>
      <p>
        Si vous nous posez une question via le formulaire « Une question ? »,
        votre nom, votre adresse e-mail et votre question nous sont envoyés par
        e-mail via le serveur de notre site. Nous les utilisons uniquement pour
        répondre à votre question et ne les conservons nulle part ailleurs.
      </p>

      <h2>Avis</h2>
      <p>
        Après votre séjour, vous pouvez rédiger un avis via un lien personnel.
        Pour cela, nous conservons vos étoiles, votre texte et le nom que vous
        choisissez. Votre avis n&apos;est publié sur notre site que si vous y
        consentez et après que nous l&apos;avons lu. Vous souhaitez que nous
        retirions votre avis ? Dites-le-nous et nous le ferons.
      </p>

      <h2>Cookies</h2>
      <p>
        Notre site n&apos;utilise pas de cookies de suivi ni de publicité. Les
        polices du site sont fournies par notre propre serveur, et non par un
        service externe qui dépose des cookies. Si vous choisissez une langue,
        votre navigateur mémorise ce choix (uniquement sur votre propre
        appareil).
      </p>

      <h2>Vos droits</h2>
      <p>Vous avez le droit de :</p>
      <ul>
        <li>Savoir quelles données nous détenons à votre sujet</li>
        <li>Consulter ces données, les faire rectifier ou supprimer</li>
        <li>Vous opposer à l&apos;utilisation de vos données</li>
      </ul>
      <p>
        Vous souhaitez exercer ces droits ? Envoyez un e-mail à{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Si nous ne
        parvenons pas à trouver une solution ensemble, vous pouvez déposer une
        plainte auprès de l&apos;autorité néerlandaise de protection des
        données, l&apos;<a
          href="https://autoriteitpersoonsgegevens.nl/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Autoriteit Persoonsgegevens
        </a>
        .
      </p>

      <h2>Sécurité</h2>
      <p>
        Nous traitons vos données avec soin et prenons les mesures appropriées
        pour éviter tout abus, perte ou accès non autorisé.
      </p>
    </>
  );
}

function VoorwaardenNL() {
  return (
    <>
      <p>
        Deze voorwaarden gelden voor iedereen die een verblijf boekt bij
        Pleuntje, een vakantiehuisje op de Veluwe, verhuurd door Marjolein
        (en Ed).
      </p>

      <h2>1. De boeking</h2>
      <p>
        Je boekt via onze website of door rechtstreeks contact met ons op te
        nemen. Boek je via de website, dan ga je bij het boeken akkoord met
        deze voorwaarden en betaal je direct online. Je boeking is definitief
        zodra je betaling is gelukt; je ontvangt dan een bevestiging per
        e-mail. Pleuntje is geschikt voor maximaal 3 personen. De actuele
        tarieven, de minimale en maximale verblijfsduur en hoe ver vooruit je
        kunt boeken, vind je op onze website bij &ldquo;Boeken&rdquo;.
      </p>

      <h2>2. Betaling</h2>
      <p>
        Bij het boeken via de website betaal je direct het volledige
        totaalbedrag via onze betaalpartner Mollie (bijvoorbeeld met iDEAL of
        creditcard). Lukt de betaling niet, dan is er niet geboekt. Boek je
        rechtstreeks bij ons, dan ontvang je een betaalverzoek; je boeking is
        dan definitief zodra de betaling is ontvangen.
      </p>

      <h2>3. Annuleren</h2>
      <p>
        Wil je je boeking annuleren? Neem dan zo snel mogelijk contact met
        ons op. Tot 4 weken voor de dag van aankomst kun je gratis
        annuleren en krijg je het volledige bedrag terug. Annuleer je
        later dan 4 weken voor aankomst, dan vindt er geen terugbetaling
        plaats. Omdat het gaat om een verblijf op vaste datums, geldt er geen
        wettelijke bedenktijd van 14 dagen; wel geldt deze
        annuleringsregeling.
      </p>

      <h2>4. Aankomst en vertrek</h2>
      <p>
        Je kunt op de dag van aankomst inchecken tussen 15:00 uur en 20:00
        uur. Op de dag van vertrek vragen we je om voor 11:00 uur uit te
        checken, zodat het huisje op tijd klaargemaakt kan worden voor de
        volgende gasten.
      </p>

      <h2>5. Huisdieren</h2>
      <p>
        Honden zijn van harte welkom bij Pleuntje, tot een maximum van drie
        honden per verblijf. Hiervoor geldt een eenmalige vergoeding, zoals
        vermeld bij de tarieven op onze website.
      </p>

      <h2>6. Gebruik van het huisje</h2>
      <p>
        We vragen je om netjes en met respect voor het huisje, de
        inventaris en de omgeving om te gaan. Eventuele schade die tijdens je
        verblijf ontstaat, verwachten we dat je bij ons meldt. Kosten voor
        schade door onzorgvuldig gebruik kunnen bij je in rekening worden
        gebracht.
      </p>
      <p>
        Pleuntje is uitsluitend bedoeld voor recreatief verblijf. Feesten,
        evenementen en verblijf voor woon- of werkdoeleinden zijn niet
        toegestaan, en er mogen niet meer personen verblijven dan bij de
        boeking opgegeven (maximaal 3). Pleuntje is ook niet bedoeld als
        overnachtingsplek voor wie in de omgeving werkt, bijvoorbeeld tijdens
        een klus, project of detachering. Blijkt dit toch het geval, dan dien
        je direct te vertrekken, zonder terugbetaling.
      </p>
      <p>
        Pleuntje ligt in een rustige, bosrijke omgeving en we willen graag
        goede buren zijn. Daarom vragen we je: geen luide muziek buiten, houd
        het rustig tussen 22:00 en 8:00 (nachtrust), en respecteer de
        zondagsrust.
      </p>

      <h2>7. Aansprakelijkheid</h2>
      <p>
        Verblijf bij Pleuntje is voor eigen risico. Wij zijn niet
        aansprakelijk voor diefstal, verlies, ongevallen of schade, van welke
        aard dan ook, tijdens je verblijf, tenzij dit het gevolg is van
        grove nalatigheid van onze kant.
      </p>

      <h2>8. Overmacht</h2>
      <p>
        Kunnen wij door overmacht (zoals brand, extreme weersomstandigheden
        of andere onvoorziene omstandigheden) het huisje niet beschikbaar
        stellen? Dan nemen we zo snel mogelijk contact met je op om samen
        naar een passende oplossing te zoeken.
      </p>

      <h2>9. Klachten</h2>
      <p>
        Heb je tijdens je verblijf een klacht? Laat het ons dan zo snel
        mogelijk weten, zodat we er samen iets aan kunnen doen. Je kunt ons
        bereiken via{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>10. Toepasselijk recht</h2>
      <p>Op deze voorwaarden is Nederlands recht van toepassing.</p>
    </>
  );
}

function VoorwaardenDE() {
  return (
    <>
      <p>
        Diese Bedingungen gelten für alle, die einen Aufenthalt bei Pleuntje
        buchen, einem Ferienhaus in der Veluwe (Niederlande), vermietet von
        Marjolein (und Ed).
      </p>

      <h2>1. Die Buchung</h2>
      <p>
        Du buchst über unsere Website oder indem du direkt Kontakt mit uns
        aufnimmst. Buchst du über die Website, dann akzeptierst du beim Buchen
        diese Bedingungen und bezahlst direkt online. Deine Buchung ist
        verbindlich, sobald deine Zahlung erfolgreich war; du erhältst dann eine
        Bestätigung per E-Mail. Pleuntje ist für höchstens 3 Personen geeignet.
        Die aktuellen Preise, die minimale und maximale Aufenthaltsdauer und
        wie weit im Voraus du buchen kannst, findest du auf unserer Website
        unter &bdquo;Buchen&ldquo;.
      </p>

      <h2>2. Zahlung</h2>
      <p>
        Bei einer Buchung über die Website bezahlst du sofort den vollständigen
        Gesamtbetrag über unseren Zahlungsdienstleister Mollie (zum Beispiel
        per Kreditkarte). Klappt die Zahlung nicht, ist keine Buchung
        zustande gekommen. Buchst du direkt bei uns, dann erhältst du eine
        Zahlungsaufforderung; deine Buchung ist dann verbindlich, sobald die
        Zahlung eingegangen ist.
      </p>

      <h2>3. Stornierung</h2>
      <p>
        Möchtest du deine Buchung stornieren? Dann melde dich so schnell wie
        möglich bei uns. Bis 4 Wochen vor dem Anreisetag kannst du kostenlos
        stornieren und erhältst den vollen Betrag zurück. Stornierst du später
        als 4 Wochen vor der Anreise, erfolgt keine Rückerstattung. Da es sich
        um einen Aufenthalt zu festen Terminen handelt, gilt kein gesetzliches
        Widerrufsrecht von 14 Tagen; es gilt jedoch diese
        Stornierungsregelung.
      </p>

      <h2>4. Anreise und Abreise</h2>
      <p>
        Am Anreisetag kannst du zwischen 15:00 und 20:00 Uhr einchecken. Am
        Abreisetag bitten wir dich, vor 11:00 Uhr auszuchecken, damit das Haus
        rechtzeitig für die nächsten Gäste vorbereitet werden kann.
      </p>

      <h2>5. Haustiere</h2>
      <p>
        Hunde sind bei Pleuntje herzlich willkommen, bis zu höchstens drei
        Hunde pro Aufenthalt. Dafür gilt eine einmalige Gebühr, wie bei den
        Preisen auf unserer Website angegeben.
      </p>

      <h2>6. Nutzung des Hauses</h2>
      <p>
        Wir bitten dich, ordentlich und respektvoll mit dem Haus, der
        Einrichtung und der Umgebung umzugehen. Schäden, die während deines
        Aufenthalts entstehen, meldest du uns bitte. Kosten für Schäden durch
        unsachgemäße Nutzung können dir in Rechnung gestellt werden.
      </p>
      <p>
        Pleuntje ist ausschließlich für Erholungsaufenthalte bestimmt. Feiern,
        Veranstaltungen und Aufenthalte zu Wohn- oder Arbeitszwecken sind
        nicht erlaubt, und es dürfen nicht mehr Personen übernachten als bei
        der Buchung angegeben (höchstens 3). Pleuntje ist auch nicht als
        Unterkunft für Personen gedacht, die in der Umgebung arbeiten, zum
        Beispiel während eines Auftrags, Projekts oder einer Entsendung.
        Stellt sich heraus, dass dies doch der Fall ist, musst du sofort
        abreisen, ohne Rückerstattung.
      </p>
      <p>
        Pleuntje liegt in einer ruhigen, waldreichen Umgebung, und wir möchten
        gute Nachbarn sein. Deshalb bitten wir dich: keine laute Musik
        draußen, Ruhe zwischen 22:00 und 8:00 Uhr (Nachtruhe) und Rücksicht
        auf die Sonntagsruhe.
      </p>

      <h2>7. Haftung</h2>
      <p>
        Der Aufenthalt bei Pleuntje erfolgt auf eigene Gefahr. Wir haften
        nicht für Diebstahl, Verlust, Unfälle oder Schäden jeglicher Art
        während deines Aufenthalts, es sei denn, diese sind die Folge grober
        Fahrlässigkeit unsererseits.
      </p>

      <h2>8. Höhere Gewalt</h2>
      <p>
        Können wir das Haus aufgrund höherer Gewalt (zum Beispiel Brand,
        extreme Wetterverhältnisse oder andere unvorhergesehene Umstände)
        nicht zur Verfügung stellen? Dann melden wir uns so schnell wie möglich
        bei dir, um gemeinsam eine passende Lösung zu finden.
      </p>

      <h2>9. Beschwerden</h2>
      <p>
        Hast du während deines Aufenthalts eine Beschwerde? Dann sag uns bitte
        so schnell wie möglich Bescheid, damit wir gemeinsam etwas dagegen tun
        können. Du erreichst uns unter{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>10. Anwendbares Recht</h2>
      <p>Für diese Bedingungen gilt niederländisches Recht.</p>
    </>
  );
}

function VoorwaardenEN() {
  return (
    <>
      <p>
        These terms apply to everyone who books a stay at Pleuntje, a holiday
        cottage on the Veluwe in the Netherlands, rented out by Marjolein (and
        Ed).
      </p>

      <h2>1. The booking</h2>
      <p>
        You book via our website or by contacting us directly. If you book via
        the website, you accept these terms when booking and pay online
        straight away. Your booking is confirmed as soon as your payment has
        gone through; you will then receive a confirmation by email. Pleuntje
        is suitable for a maximum of 3 people. The current rates, the minimum
        and maximum length of stay and how far ahead you can book can be found
        on our website under &ldquo;Book&rdquo;.
      </p>

      <h2>2. Payment</h2>
      <p>
        When booking via the website, you pay the full total amount straight
        away through our payment provider Mollie (for example by credit card).
        If the payment fails, no booking has been made. If you book directly
        with us, you will receive a payment request; your booking is then
        confirmed as soon as the payment has been received.
      </p>

      <h2>3. Cancellation</h2>
      <p>
        Would you like to cancel your booking? Please contact us as soon as
        possible. Up to 4 weeks before your arrival date you can cancel free of
        charge and receive a full refund. If you cancel less than 4 weeks
        before arrival, no refund will be given. Because this is a stay on
        fixed dates, there is no statutory 14-day cooling-off period; this
        cancellation policy applies instead.
      </p>

      <h2>4. Arrival and departure</h2>
      <p>
        On the day of arrival you can check in between 3 pm and 8 pm. On the
        day of departure we ask you to check out before 11 am, so that the
        cottage can be prepared in time for the next guests.
      </p>

      <h2>5. Pets</h2>
      <p>
        Dogs are very welcome at Pleuntje, up to a maximum of three dogs per
        stay. A one-off fee applies, as stated with the rates on our website.
      </p>

      <h2>6. Use of the cottage</h2>
      <p>
        We ask you to treat the cottage, its contents and the surroundings with
        care and respect. Please report any damage that occurs during your
        stay. Costs of damage caused by careless use may be charged to you.
      </p>
      <p>
        Pleuntje is intended exclusively for holiday stays. Parties, events and
        stays for residential or work purposes are not permitted, and no more
        people may stay than stated when booking (maximum 3). Pleuntje is also
        not intended as accommodation for people working in the area, for
        example during a job, project or secondment. If this turns out to be
        the case, you must leave immediately, without a refund.
      </p>
      <p>
        Pleuntje is located in a quiet, wooded area and we like to be good
        neighbours. That is why we ask you: no loud music outside, keep things
        quiet between 10 pm and 8 am, and respect the Sunday rest.
      </p>

      <h2>7. Liability</h2>
      <p>
        Staying at Pleuntje is at your own risk. We are not liable for theft,
        loss, accidents or damage of any kind during your stay, unless this is
        the result of gross negligence on our part.
      </p>

      <h2>8. Force majeure</h2>
      <p>
        If, due to force majeure (such as fire, extreme weather or other
        unforeseen circumstances), we are unable to make the cottage
        available, we will contact you as soon as possible to find a suitable
        solution together.
      </p>

      <h2>9. Complaints</h2>
      <p>
        Do you have a complaint during your stay? Please let us know as soon as
        possible, so that we can do something about it together. You can reach
        us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>10. Applicable law</h2>
      <p>These terms are governed by Dutch law.</p>
    </>
  );
}

function VoorwaardenFR() {
  return (
    <>
      <p>
        Ces conditions s&apos;appliquent à toute personne qui réserve un séjour
        chez Pleuntje, un chalet de vacances en Veluwe (Pays-Bas), loué par
        Marjolein (et Ed).
      </p>

      <h2>1. La réservation</h2>
      <p>
        Vous réservez via notre site ou en nous contactant directement. Si vous
        réservez via le site, vous acceptez ces conditions lors de la
        réservation et vous payez directement en ligne. Votre réservation est
        définitive dès que votre paiement a abouti ; vous recevez alors une
        confirmation par e-mail. Pleuntje peut accueillir 3 personnes au
        maximum. Les tarifs en vigueur, la durée de séjour minimale et
        maximale et le délai de réservation à l&apos;avance figurent sur notre
        site, rubrique « Réserver ».
      </p>

      <h2>2. Paiement</h2>
      <p>
        Lors d&apos;une réservation via le site, vous payez immédiatement la
        totalité du montant via notre prestataire de paiement Mollie (par
        exemple par carte bancaire). Si le paiement échoue, aucune réservation
        n&apos;est effectuée. Si vous réservez directement auprès de nous, vous
        recevez une demande de paiement ; votre réservation est alors
        définitive dès réception du paiement.
      </p>

      <h2>3. Annulation</h2>
      <p>
        Vous souhaitez annuler votre réservation ? Contactez-nous le plus tôt
        possible. Jusqu&apos;à 4 semaines avant la date d&apos;arrivée,
        l&apos;annulation est gratuite et le montant total vous est remboursé.
        Si vous annulez moins de 4 semaines avant l&apos;arrivée, aucun
        remboursement n&apos;est effectué. S&apos;agissant d&apos;un séjour à
        dates fixes, le délai légal de rétractation de 14 jours ne
        s&apos;applique pas ; ces conditions d&apos;annulation s&apos;appliquent
        en revanche.
      </p>

      <h2>4. Arrivée et départ</h2>
      <p>
        Le jour de votre arrivée, vous pouvez vous installer entre 15 h et
        20 h. Le jour du départ, nous vous demandons de libérer le chalet avant
        11 h, afin qu&apos;il puisse être préparé à temps pour les hôtes
        suivants.
      </p>

      <h2>5. Animaux</h2>
      <p>
        Les chiens sont les bienvenus chez Pleuntje, dans la limite de trois
        chiens par séjour. Un supplément unique s&apos;applique, comme indiqué
        dans les tarifs sur notre site.
      </p>

      <h2>6. Utilisation du chalet</h2>
      <p>
        Nous vous demandons de prendre soin du chalet, de son équipement et de
        l&apos;environnement. Merci de nous signaler tout dommage survenu
        pendant votre séjour. Les frais liés à des dommages dus à une
        utilisation négligente peuvent vous être facturés.
      </p>
      <p>
        Pleuntje est destiné exclusivement aux séjours de loisirs. Les fêtes,
        les événements et les séjours à des fins d&apos;habitation ou de travail
        ne sont pas autorisés, et le nombre de personnes ne peut pas dépasser
        celui indiqué lors de la réservation (3 au maximum). Pleuntje
        n&apos;est pas non plus destiné à loger des personnes travaillant dans
        la région, par exemple pendant une mission, un chantier ou un
        détachement. Si tel est néanmoins le cas, vous devrez quitter les lieux
        immédiatement, sans remboursement.
      </p>
      <p>
        Pleuntje se trouve dans un environnement calme et boisé, et nous tenons
        à être de bons voisins. C&apos;est pourquoi nous vous demandons : pas
        de musique forte à l&apos;extérieur, du calme entre 22 h et 8 h, et le
        respect du repos dominical.
      </p>

      <h2>7. Responsabilité</h2>
      <p>
        Le séjour chez Pleuntje se fait à vos propres risques. Nous ne sommes
        pas responsables des vols, pertes, accidents ou dommages de quelque
        nature que ce soit pendant votre séjour, sauf en cas de négligence
        grave de notre part.
      </p>

      <h2>8. Force majeure</h2>
      <p>
        Si, en cas de force majeure (incendie, conditions météorologiques
        extrêmes ou autres circonstances imprévues), nous ne pouvons pas mettre
        le chalet à disposition, nous vous contacterons au plus vite pour
        trouver ensemble une solution adaptée.
      </p>

      <h2>9. Réclamations</h2>
      <p>
        Vous avez une réclamation pendant votre séjour ? Faites-le-nous savoir
        le plus tôt possible, afin que nous puissions y remédier ensemble.
        Vous pouvez nous joindre à{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>10. Droit applicable</h2>
      <p>Ces conditions sont régies par le droit néerlandais.</p>
    </>
  );
}

export const PRIVACY: Record<Taal, Juridisch> = {
  nl: {
    titel: "Privacyverklaring",
    omschrijving: "Lees hoe Pleuntje omgaat met jouw persoonsgegevens.",
    bijgewerkt: "22 oktober 2026",
    Inhoud: PrivacyNL,
  },
  de: {
    titel: "Datenschutzerklärung",
    omschrijving: "So geht Pleuntje mit deinen personenbezogenen Daten um.",
    bijgewerkt: "22. Oktober 2026",
    Inhoud: PrivacyDE,
  },
  en: {
    titel: "Privacy statement",
    omschrijving: "How Pleuntje handles your personal data.",
    bijgewerkt: "22 October 2026",
    Inhoud: PrivacyEN,
  },
  fr: {
    titel: "Déclaration de confidentialité",
    omschrijving: "Comment Pleuntje traite vos données personnelles.",
    bijgewerkt: "22 octobre 2026",
    Inhoud: PrivacyFR,
  },
};

export const VOORWAARDEN: Record<Taal, Juridisch> = {
  nl: {
    titel: "Algemene voorwaarden",
    omschrijving: "De voorwaarden voor het boeken van een verblijf bij Pleuntje.",
    bijgewerkt: "14 oktober 2026",
    Inhoud: VoorwaardenNL,
  },
  de: {
    titel: "Allgemeine Geschäftsbedingungen",
    omschrijving: "Die Bedingungen für die Buchung eines Aufenthalts bei Pleuntje.",
    bijgewerkt: "22. Oktober 2026",
    Inhoud: VoorwaardenDE,
  },
  en: {
    titel: "Terms and conditions",
    omschrijving: "The terms for booking a stay at Pleuntje.",
    bijgewerkt: "22 October 2026",
    Inhoud: VoorwaardenEN,
  },
  fr: {
    titel: "Conditions générales",
    omschrijving: "Les conditions de réservation d'un séjour chez Pleuntje.",
    bijgewerkt: "22 octobre 2026",
    Inhoud: VoorwaardenFR,
  },
};
