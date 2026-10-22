import type { Metadata } from "next";
import ReviewFormulier from "@/components/ReviewFormulier";
import type { VertaaldeTaal } from "@/i18n/talen";

// Review schrijven via de persoonlijke link in de (vertaalde) vertrekmail
export const metadata: Metadata = {
  title: "Pleuntje",
  robots: { index: false, follow: false },
};

export default async function ReviewPage({ params }: { params: Promise<{ taal: string }> }) {
  const { taal } = await params;
  return <ReviewFormulier taal={taal as VertaaldeTaal} />;
}
