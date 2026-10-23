import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/data/contact";
import { OG_LOCALE, taalAlternatieven, pad, type Taal } from "@/i18n/talen";

export const siteUrl = "https://boshuispleuntje.nl";

export const SITE_TEKST: Record<
  Taal,
  { titel: string; omschrijving: string; trefwoorden: string[] }
> = {
  nl: {
    titel: "Pleuntje – Vakantiehuisje met omheinde hondentuin op de Veluwe",
    omschrijving:
      "Knus chalet voor 3 personen op de Veluwe, bij Putten en Voorthuizen. Omheinde tuin voor je hond, bos op loopafstand en sauna om de hoek. Bekijk de beschikbaarheid.",
    trefwoorden: [
      "vakantiehuisje Veluwe",
      "vakantiehuis met hond",
      "hondvriendelijk vakantiehuisje",
      "chalet Veluwe",
      "boshuisje",
      "vakantiehuis Putten",
      "vakantiehuis Voorthuizen",
      "omheinde tuin hond",
    ],
  },
  de: {
    titel: "Pleuntje – Ferienhaus mit eingezäuntem Hundegarten in der Veluwe",
    omschrijving:
      "Gemütliches Chalet für 3 Personen in der Veluwe (Niederlande), bei Putten und Voorthuizen. Eingezäunter Garten für deinen Hund, Wald zu Fuß erreichbar und Sauna gleich um die Ecke. Verfügbarkeit prüfen.",
    trefwoorden: [
      "Ferienhaus Veluwe",
      "Ferienhaus mit Hund Holland",
      "Ferienhaus Hund eingezäunt Niederlande",
      "Chalet Veluwe",
      "Ferienhaus Putten",
      "Ferienhaus Voorthuizen",
      "hundefreundliches Ferienhaus Niederlande",
    ],
  },
  en: {
    titel: "Pleuntje – Holiday cottage with a fenced dog garden on the Veluwe",
    omschrijving:
      "Cosy chalet for 3 people on the Veluwe in the Netherlands, near Putten and Voorthuizen. Fenced garden for your dog, woods within walking distance and a sauna just around the corner. Check availability.",
    trefwoorden: [
      "holiday cottage Veluwe",
      "dog friendly holiday home Netherlands",
      "chalet Veluwe",
      "holiday home Putten",
      "holiday home Voorthuizen",
      "fenced garden dog",
    ],
  },
  fr: {
    titel: "Pleuntje – Chalet de vacances avec jardin clôturé pour chiens en Veluwe",
    omschrijving:
      "Chalet douillet pour 3 personnes en Veluwe (Pays-Bas), près de Putten et Voorthuizen. Jardin clôturé pour votre chien, forêt à deux pas et sauna juste à côté. Voir les disponibilités.",
    trefwoorden: [
      "location vacances Veluwe",
      "gîte avec chien Pays-Bas",
      "chalet Veluwe",
      "location Putten",
      "location Voorthuizen",
      "jardin clôturé chien",
    ],
  },
};

// Icoontjes met een eigen naam (20 okt 2026): Safari hield het oude icoon
// vast zolang de bestandsnaam hetzelfde bleef.
export const ICONEN: Metadata["icons"] = {
  icon: [
    { url: "/favicon.ico", sizes: "48x48" },
    { url: "/icoon-pleuntje-stempel-192.png", type: "image/png", sizes: "192x192" },
    { url: "/icoon-pleuntje-stempel.png", type: "image/png", sizes: "512x512" },
  ],
  apple: [{ url: "/apple-touch-icon-pleuntje-stempel.png", sizes: "180x180" }],
};

// Algemene gegevens (titel, omschrijving, Google, delen) van de site in een taal
export function siteMetadata(taal: Taal): Metadata {
  const t = SITE_TEKST[taal];
  return {
    metadataBase: new URL(siteUrl),
    title: t.titel,
    description: t.omschrijving,
    keywords: t.trefwoorden,
    alternates: {
      canonical: pad(taal),
      languages: taalAlternatieven(),
    },
    icons: ICONEN,
    // Korte naam onder het icoontje op het beginscherm van een iPhone/iPad
    appleWebApp: { title: "Pleuntje" },
    openGraph: {
      title: t.titel,
      description: t.omschrijving,
      url: siteUrl + pad(taal),
      siteName: "Pleuntje",
      locale: OG_LOCALE[taal],
      type: "website",
      images: ["/photos/exterieur.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: t.titel,
      description: t.omschrijving,
      images: ["/photos/exterieur.jpg"],
    },
  };
}

// Gegevens voor een losse pagina (privacy, voorwaarden): eigen titel en de andere talen
export function paginaMetadata(taal: Taal, pagina: string, titel: string, omschrijving: string): Metadata {
  return {
    title: titel,
    description: omschrijving,
    alternates: {
      canonical: pad(taal, pagina),
      languages: taalAlternatieven(pagina),
    },
  };
}

// Extra informatie voor Google (onzichtbaar op de site), zodat Google begrijpt
// dat dit een vakantiewoning is en hem beter kan tonen bij vakantie-zoekopdrachten.
export function structuredData(taal: Taal) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Pleuntje",
    alternateName: "Boshuis Pleuntje",
    description: SITE_TEKST[taal].omschrijving,
    url: siteUrl + pad(taal),
    image: [
      `${siteUrl}/photos/exterieur.jpg`,
      `${siteUrl}/photos/woonkamer.jpg`,
      `${siteUrl}/photos/tuin.jpg`,
      `${siteUrl}/photos/terras.jpg`,
    ],
    logo: `${siteUrl}/photos/logo-stempel.png`,
    email: CONTACT_EMAIL,
    priceRange: "€105 - €115 per nacht",
    currenciesAccepted: "EUR",
    petsAllowed: true,
    numberOfRooms: 2,
    checkinTime: "15:00",
    checkoutTime: "11:00",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Gelderland",
      addressCountry: "NL",
    },
    areaServed: ["Veluwe", "Putten", "Voorthuizen", "Barneveld", "Garderen"],
    amenityFeature: [
      "Omheinde tuin voor honden",
      "Eigen tuin en terras",
      "Gratis wifi",
      "Gratis parkeren",
      "Volledig ingerichte keuken",
      "Boxspringbedden",
      "Beddengoed en handdoeken aanwezig",
      "Bos op loopafstand",
      "Sauna in de buurt",
    ].map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
  };
}
