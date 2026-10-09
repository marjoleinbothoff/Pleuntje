import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/data/contact";

export const metadata: Metadata = {
  title: "Privacyverklaring – Pleuntje",
  description: "Lees hoe Pleuntje omgaat met jouw persoonsgegevens.",
};

export default function PrivacyverklaringPage() {
  return (
    <LegalPage title="Privacyverklaring" updated="9 oktober 2026">
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
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> of{" "}
        {CONTACT_PHONE_DISPLAY}.
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
        Het boekingsformulier op onze website wordt verstuurd via{" "}
        <a
          href="https://web3forms.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Web3Forms
        </a>
        , een externe partij die de formuliergegevens veilig naar ons
        e-mailadres doorstuurt. We delen je gegevens verder niet met andere
        partijen, behalve als we daartoe wettelijk verplicht zijn.
      </p>

      <h2>Cookies</h2>
      <p>
        Onze website gebruikt geen tracking- of advertentiecookies. De
        lettertypes op de website worden door onze eigen server geleverd,
        niet via een externe dienst die cookies plaatst.
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
    </LegalPage>
  );
}
