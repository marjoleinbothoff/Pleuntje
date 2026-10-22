import { Inter, Cormorant_Garamond, Jost } from "next/font/google";

// Lettertypes voor alle talen (gedeeld door de Nederlandse en de vertaalde versie)
export const inter = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const jostBody = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const cormorant = Cormorant_Garamond({
  variable: "--font-wordmark",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["italic", "normal"],
});

export const fontKlassen = `${inter.variable} ${jostBody.variable} ${cormorant.variable}`;
