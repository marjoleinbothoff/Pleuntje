import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

// Plattegrond met de route van de ingang van het park naar Pleuntje (nummer 125).
// Alleen voor gasten via de link in de aankomstmail en Airbnb: niet in het menu,
// niet in de sitemap en niet in Google.
export const metadata: Metadata = {
  title: "Route naar Pleuntje",
  description: "Zo vind je Pleuntje (nummer 125) op Recreatiepark De Eyckenhoff.",
  robots: { index: false, follow: false },
};

export default function RouteNaarPleuntjePage() {
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
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-forest-900 sm:text-4xl">
              Welkom! Zo vind je Pleuntje
            </h1>
            <p className="mt-2 text-forest-700">
              Recreatiepark De Eyckenhoff, Poolseweg 27 in Putten. Pleuntje is
              nummer 125.
            </p>
          </div>

          <figure className="rounded-2xl border border-forest-200 bg-white p-2">
            <Image
              src="/photos/plattegrond-route.jpg"
              alt="Uitvergrote route van de ingang van het park naar nummer 125"
              width={1150}
              height={850}
              className="h-auto w-full rounded-xl"
              priority
            />
            <figcaption className="px-2 pt-2 text-sm text-forest-700">
              Uitvergroot: van de ingang naar nummer 125.
            </figcaption>
          </figure>

          <div className="grid gap-6 sm:grid-cols-2">
            <section className="border-t-4 border-[#e24814] pt-3">
              <h2 className="text-lg font-bold text-[#c23d10]">
                Te voet (oranje schoentjes)
              </h2>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-forest-900">
                <li>Bij de ingang meteen linksaf, langs nummer 132.</li>
                <li>Het tweede straatje rechts, de Berkenlaan.</li>
                <li>Pleuntje (125) ligt aan je linkerhand.</li>
              </ol>
            </section>
            <section className="border-t-4 border-[#1464eb] pt-3">
              <h2 className="text-lg font-bold text-[#1456c4]">
                Met de auto (blauwe lijn)
              </h2>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-forest-900">
                <li>Vanaf de ingang rechtdoor de Eikenlaan op.</li>
                <li>Linksaf bij nummer 92.</li>
                <li>Linksaf de Soerenseweg op, dan rechtsaf de Kastanjeweg.</li>
                <li>Linksaf de Berkenlaan in, tot nummer 125.</li>
              </ol>
            </section>
          </div>

          <figure className="rounded-2xl border border-forest-200 bg-white p-2">
            <a href="/photos/plattegrond-park.jpg" target="_blank" rel="noopener">
              <Image
                src="/photos/plattegrond-park.jpg"
                alt="Plattegrond van het hele park met de looproute en de autoroute naar nummer 125"
                width={2000}
                height={1414}
                className="h-auto w-full rounded-xl"
              />
            </a>
            <figcaption className="px-2 pt-2 text-sm text-forest-700">
              Het hele park. Tik op de kaart om hem groot te openen. Kaart: © 2025
              EMK cartografie.
            </figcaption>
          </figure>
        </div>
      </main>

      <Footer taal="nl" pagina="route-naar-pleuntje/" toonTaal={false} />
    </>
  );
}
