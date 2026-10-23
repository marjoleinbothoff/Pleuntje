import type { Metadata } from "next";
import { INFO_TEKST, InformatiePagina } from "@/components/RoutePaginas";
import type { VertaaldeTaal } from "@/i18n/talen";

type Props = { params: Promise<{ taal: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = INFO_TEKST[(await params).taal as VertaaldeTaal];
  return {
    title: t.titel,
    description: t.omschrijving,
    robots: { index: false, follow: false },
    alternates: {},
  };
}

export default async function Pagina({ params }: Props) {
  const { taal } = await params;
  return <InformatiePagina taal={taal as VertaaldeTaal} />;
}
