import type { Metadata } from "next";
import { ROUTE_TEKST, RoutePagina } from "@/components/RoutePaginas";

// Plattegrond met de route van de ingang van het park naar Pleuntje (nummer 125).
// Alleen voor gasten via de link in de aankomstmail en Airbnb: niet in het menu,
// niet in de sitemap en niet in Google. Vertalingen op /de/, /en/ en /fr/route-naar-pleuntje/.
export const metadata: Metadata = {
  title: ROUTE_TEKST.nl.titel,
  description: ROUTE_TEKST.nl.omschrijving,
  robots: { index: false, follow: false },
  alternates: { canonical: null, languages: null },
};

export default function RouteNaarPleuntjePage() {
  return <RoutePagina taal="nl" />;
}
