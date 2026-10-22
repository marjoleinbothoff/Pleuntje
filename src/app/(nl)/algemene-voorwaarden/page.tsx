import JuridischePagina, { juridischeMetadata } from "@/components/JuridischePagina";

export const metadata = juridischeMetadata("voorwaarden", "nl");

export default function AlgemeneVoorwaardenPage() {
  return <JuridischePagina soort="voorwaarden" taal="nl" />;
}
