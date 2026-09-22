import type { Metadata } from "next";
import { Inter } from "next/font/google";
import IconDefs from "@/components/IconDefs";
import "./globals.css";

const inter = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const interBody = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pleun – Vakantiehuisje op de Veluwe",
  description:
    "Pleun is een gezellig vakantiehuisje op de Veluwe voor 3 personen, op loopafstand van het bos en om de hoek van de sauna. Boek jouw verblijf vandaag nog.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl"
      className={`${inter.variable} ${interBody.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-forest-900 font-body">
        <IconDefs />
        {children}
      </body>
    </html>
  );
}
