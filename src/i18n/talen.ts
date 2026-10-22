// Talen van de site (22 okt 2026, op verzoek van Marjolein).
// Nederlands staat op de gewone adressen (/, /privacyverklaring/ …),
// de vertalingen op /de/, /en/ en /fr/ met dezelfde paginanamen erachter.
// Teksten staan per onderdeel in het onderdeel zelf (of in src/i18n/), steeds in alle vier de talen.

export type Taal = "nl" | "de" | "en" | "fr";

export const TALEN: Taal[] = ["nl", "de", "en", "fr"];
export const VERTAALDE_TALEN = ["de", "en", "fr"] as const;
export type VertaaldeTaal = (typeof VERTAALDE_TALEN)[number];

export function isVertaaldeTaal(t: string): t is VertaaldeTaal {
  return (VERTAALDE_TALEN as readonly string[]).includes(t);
}

// Korte namen voor de taalknopjes, en de volledige naam (voor schermlezers)
export const TAAL_KORT: Record<Taal, string> = { nl: "NL", de: "DE", en: "EN", fr: "FR" };
export const TAAL_NAAM: Record<Taal, string> = {
  nl: "Nederlands",
  de: "Deutsch",
  en: "English",
  fr: "Français",
};

// Code voor <html lang> en datums
export const HTML_LANG: Record<Taal, string> = { nl: "nl", de: "de", en: "en", fr: "fr" };
export const LOCALE: Record<Taal, string> = { nl: "nl-NL", de: "de-DE", en: "en-GB", fr: "fr-FR" };
export const OG_LOCALE: Record<Taal, string> = { nl: "nl_NL", de: "de_DE", en: "en_GB", fr: "fr_FR" };

// Adres van een pagina in een taal. pagina = "" (voorkant) of bijv. "privacyverklaring/"
export function pad(taal: Taal, pagina = "") {
  return taal === "nl" ? `/${pagina}` : `/${taal}/${pagina}`;
}

// Dezelfde pagina in alle talen (voor Google: hreflang)
export function taalAlternatieven(pagina = "") {
  return {
    nl: pad("nl", pagina),
    de: pad("de", pagina),
    en: pad("en", pagina),
    fr: pad("fr", pagina),
    "x-default": pad("nl", pagina),
  };
}

// Onthoudt de taal die een bezoeker zelf koos, zodat de site niet opnieuw automatisch wisselt
export const TAAL_OPSLAG = "pleuntje-taal";
