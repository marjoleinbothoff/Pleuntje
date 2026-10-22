import type { Metadata } from "next";
import BoekingStatus from "@/components/BoekingStatus";
import type { VertaaldeTaal } from "@/i18n/talen";

// Hier komt een buitenlandse gast terug na het betalen (Mollie stuurt naar /de/boeking/ enz.)
export const metadata: Metadata = {
  title: "Pleuntje",
  robots: { index: false, follow: false },
};

export default async function BoekingPage({ params }: { params: Promise<{ taal: string }> }) {
  const { taal } = await params;
  return <BoekingStatus taal={taal as VertaaldeTaal} />;
}
