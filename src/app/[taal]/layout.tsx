import type { Metadata } from "next";
import HtmlRoot from "@/components/HtmlRoot";
import { siteMetadata } from "@/i18n/site";
import { VERTAALDE_TALEN, type VertaaldeTaal } from "@/i18n/talen";

// Vertaalde versies van de site: /de/, /en/ en /fr/
export const dynamicParams = false;

export function generateStaticParams() {
  return VERTAALDE_TALEN.map((taal) => ({ taal }));
}

export async function generateMetadata({ params }: { params: Promise<{ taal: string }> }): Promise<Metadata> {
  const { taal } = await params;
  return siteMetadata(taal as VertaaldeTaal);
}

export default async function TaalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ taal: string }>;
}) {
  const { taal } = await params;
  return <HtmlRoot taal={taal as VertaaldeTaal}>{children}</HtmlRoot>;
}
