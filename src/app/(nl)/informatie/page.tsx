import type { Metadata } from "next";
import { INFO_TEKST, InformatiePagina } from "@/components/RoutePaginas";

// Informatie voor gasten: huisregels, check-out lijst, afval en uitgang.
// Alleen via een link: niet in het menu, de sitemap of Google.
export const metadata: Metadata = {
  title: INFO_TEKST.nl.titel,
  description: INFO_TEKST.nl.omschrijving,
  robots: { index: false, follow: false },
  alternates: {},
};

export default function InformatiePage() {
  return <InformatiePagina taal="nl" />;
}
