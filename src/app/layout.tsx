import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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

const playfair = Playfair_Display({
  variable: "--font-wordmark",
  subsets: ["latin"],
  weight: ["700", "800"],
  style: ["italic", "normal"],
});

const siteUrl = "https://boshuispleuntje.nl";
const siteTitle = "Pleuntje – Vakantiehuisje op de Veluwe";
const siteDescription =
  "Pleuntje is een gezellig vakantiehuisje op de Veluwe voor 3 personen, op loopafstand van het bos en om de hoek van de sauna. Boek jouw verblijf vandaag nog.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Pleuntje",
    locale: "nl_NL",
    type: "website",
    images: ["/photos/exterieur.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/photos/exterieur.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl"
      className={`${inter.variable} ${interBody.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-forest-800 font-body">
        <IconDefs />
        {children}
      </body>
    </html>
  );
}
