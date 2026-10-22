import Voorkant from "@/components/Voorkant";
import type { VertaaldeTaal } from "@/i18n/talen";

export default async function TaalHome({ params }: { params: Promise<{ taal: string }> }) {
  const { taal } = await params;
  return <Voorkant taal={taal as VertaaldeTaal} />;
}
