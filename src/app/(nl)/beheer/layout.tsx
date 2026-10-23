import type { Metadata } from "next";
import { ICONEN } from "@/i18n/site";

export const metadata: Metadata = {
  title: "Beheer – Pleuntje",
  description: "Beheerpagina voor de agenda van Pleuntje.",
  robots: { index: false, follow: false },
  // Korte naam onder het icoon op het beginscherm van de iPhone
  appleWebApp: { title: "Beheer" },
  // Eigen beginschermicoon: het stempel in crème met "BEHEER" (23 okt 2026, keuze Marjolein)
  icons: { ...ICONEN, apple: [{ url: "/apple-touch-icon-beheer.png", sizes: "180x180" }] },
};

export default function BeheerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
