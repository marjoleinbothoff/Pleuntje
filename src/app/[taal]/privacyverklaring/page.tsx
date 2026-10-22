import JuridischePagina, { juridischeMetadata } from "@/components/JuridischePagina";
import type { VertaaldeTaal } from "@/i18n/talen";

type Props = { params: Promise<{ taal: string }> };

export async function generateMetadata({ params }: Props) {
  const { taal } = await params;
  return juridischeMetadata("privacy", taal as VertaaldeTaal);
}

export default async function Pagina({ params }: Props) {
  const { taal } = await params;
  return <JuridischePagina soort="privacy" taal={taal as VertaaldeTaal} />;
}
