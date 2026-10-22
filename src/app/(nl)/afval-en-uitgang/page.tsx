import type { Metadata } from "next";
import { AFVAL_TEKST, AfvalPagina } from "@/components/RoutePaginas";

// Plattegrond van het hele park: route van Pleuntje (125) naar de uitgang en waar het afval heen moet.
// Alleen voor gasten via de link in de aankomstmail: niet in het menu, de sitemap of Google.
export const metadata: Metadata = {
  title: AFVAL_TEKST.nl.titel,
  description: AFVAL_TEKST.nl.omschrijving,
  robots: { index: false, follow: false },
  alternates: {},
};

export default function AfvalEnUitgangPage() {
  return <AfvalPagina taal="nl" />;
}
