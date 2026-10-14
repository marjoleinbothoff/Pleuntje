import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/data/contact";

export const metadata: Metadata = {
  title: "Algemene voorwaarden – Pleuntje",
  description: "De voorwaarden voor het boeken van een verblijf bij Pleuntje.",
};

export default function AlgemeneVoorwaardenPage() {
  return (
    <LegalPage title="Algemene voorwaarden" updated="14 oktober 2026">
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
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> of{" "}
        {CONTACT_PHONE_DISPLAY}.
      </p>

      <h2>10. Toepasselijk recht</h2>
      <p>Op deze voorwaarden is Nederlands recht van toepassing.</p>
    </LegalPage>
  );
}
