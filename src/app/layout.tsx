import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Jost } from "next/font/google";
import IconDefs from "@/components/IconDefs";
import { CONTACT_EMAIL, CONTACT_PHONE_HREF } from "@/data/contact";
import "./globals.css";

const inter = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const jostBody = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-wordmark",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["italic", "normal"],
});

const siteUrl = "https://boshuispleuntje.nl";
const siteTitle =
  "Pleuntje – Vakantiehuisje met omheinde hondentuin op de Veluwe";
const siteDescription =
  "Knus chalet voor 3 volwassenen op de Veluwe, bij Putten en Voorthuizen. Omheinde tuin voor je hond, bos op loopafstand en sauna om de hoek. Bekijk de beschikbaarheid.";

// Extra informatie voor Google (onzichtbaar op de site), zodat Google begrijpt
// dat dit een vakantiewoning is en hem beter kan tonen bij vakantie-zoekopdrachten.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Pleuntje",
  alternateName: "Boshuis Pleuntje",
  description: siteDescription,
  url: siteUrl,
  image: [
    `${siteUrl}/photos/exterieur.jpg`,
    `${siteUrl}/photos/woonkamer.jpg`,
    `${siteUrl}/photos/tuin.jpg`,
    `${siteUrl}/photos/terras.jpg`,
  ],
  logo: `${siteUrl}/photos/logo.png`,
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE_HREF,
  priceRange: "€105 - €115 per nacht",
  currenciesAccepted: "EUR",
  petsAllowed: true,
  numberOfRooms: 2,
  checkinTime: "15:00",
  checkoutTime: "11:00",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Gelderland",
    addressCountry: "NL",
  },
  areaServed: ["Veluwe", "Putten", "Voorthuizen", "Barneveld", "Garderen"],
  amenityFeature: [
    "Omheinde tuin voor honden",
    "Eigen tuin en terras",
    "Gratis wifi",
    "Gratis parkeren",
    "Volledig ingerichte keuken",
    "Beddengoed en handdoeken aanwezig",
    "Bos op loopafstand",
    "Sauna in de buurt",
  ].map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    "vakantiehuisje Veluwe",
    "vakantiehuis met hond",
    "hondvriendelijk vakantiehuisje",
    "chalet Veluwe",
    "boshuisje",
    "vakantiehuis Putten",
    "vakantiehuis Voorthuizen",
    "omheinde tuin hond",
  ],
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
      className={`${inter.variable} ${jostBody.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-forest-900 font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <IconDefs />
        {children}
      </body>
    </html>
  );
}
