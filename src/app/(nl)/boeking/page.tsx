import type { Metadata } from "next";
import BoekingStatus from "@/components/BoekingStatus";

export const metadata: Metadata = {
  title: "Je boeking – Pleuntje",
  robots: { index: false, follow: false },
};

export default function BoekingPage() {
  return <BoekingStatus taal="nl" />;
}
