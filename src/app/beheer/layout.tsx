import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beheer – Pleuntje",
  description: "Beheerpagina voor de agenda van Pleuntje.",
  robots: { index: false, follow: false },
};

export default function BeheerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
