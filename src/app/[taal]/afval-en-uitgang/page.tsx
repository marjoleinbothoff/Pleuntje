import type { Metadata } from "next";
import { AFVAL_TEKST, AfvalPagina } from "@/components/RoutePaginas";
import type { VertaaldeTaal } from "@/i18n/talen";

type Props = { params: Promise<{ taal: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = AFVAL_TEKST[(await params).taal as VertaaldeTaal];
  return {
    title: t.titel,
    description: t.omschrijving,
    robots: { index: false, follow: false },
    alternates: {},
  };
}

export default async function Pagina({ params }: Props) {
  const { taal } = await params;
  return <AfvalPagina taal={taal as VertaaldeTaal} />;
}
