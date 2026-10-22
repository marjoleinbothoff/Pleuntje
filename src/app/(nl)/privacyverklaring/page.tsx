import JuridischePagina, { juridischeMetadata } from "@/components/JuridischePagina";

export const metadata = juridischeMetadata("privacy", "nl");

export default function PrivacyverklaringPage() {
  return <JuridischePagina soort="privacy" taal="nl" />;
}
