import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

// Plattegrond van het hele park: route van Pleuntje (125) naar de uitgang en waar het afval heen moet.
// Alleen voor gasten via de link in de aankomstmail: niet in het menu, de sitemap of Google.
export const metadata: Metadata = {
  title: "Afval en uitgang – Pleuntje",
  description: "Waar je je afval kwijt kunt en waar de uitgang van Recreatiepark De Eyckenhoff is.",
  robots: { index: false, follow: false },
};

export default function AfvalEnUitgangPage() {
  return (
    <>
      <header className="px-4 pt-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between rounded-3xl border border-forest-700/60 bg-forest-600/95 px-5 py-4 text-cream shadow-sm shadow-forest-900/20">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/photos/logo.png"
              alt="Pleuntje"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full"
            />
            <span className="font-bold">Pleuntje</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-forest-900 sm:text-4xl">
              Afval en uitgang
            </h1>
            <p className="mt-3 text-forest-900">
              Je verlaat het park met de auto via de uitgang aan het eind van de
              Eikenlaan. Je afval kun je kwijt in de containers vlak voor de
              uitgang: ze staan schuin tegenover het speeltuintje, aan je
              rechterhand als je het park afrijdt.
            </p>
          </div>

          <figure className="rounded-2xl border border-forest-200 bg-white p-2">
            <a href="/photos/plattegrond-uitgang-afval.jpg" target="_blank" rel="noopener">
              <Image
                src="/photos/plattegrond-uitgang-afval.jpg"
                alt="Plattegrond van het hele park met de route van Pleuntje naar de uitgang en de afvalcontainers"
                width={2000}
                height={1414}
                className="h-auto w-full rounded-xl"
                priority
              />
            </a>
            <figcaption className="px-2 pt-2 text-sm text-forest-700">
              Roze lijn: van Pleuntje (125) naar de uitgang, langs de
              afvalcontainers. Tik op de kaart om hem groot te openen. Kaart:
              © 2025 EMK cartografie.
            </figcaption>
          </figure>
        </div>
      </main>

      <Footer taal="nl" pagina="afval-en-uitgang/" toonTaal={false} />
    </>
  );
}
