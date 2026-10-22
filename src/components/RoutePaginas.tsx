import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { pad, type Taal } from "@/i18n/talen";

// Plattegronden voor gasten (link in de aankomstmail): de route naar Pleuntje en
// de pagina met afval en uitgang. In alle vier de talen; niet in menu, sitemap of Google.

function Kop({ taal }: { taal: Taal }) {
  return (
    <header className="px-4 pt-4">
      <div className="mx-auto flex max-w-4xl items-center justify-between rounded-3xl border border-forest-700/60 bg-forest-600/95 px-5 py-4 text-cream shadow-sm shadow-forest-900/20">
        <Link href={pad(taal)} className="flex items-center gap-3">
          <Image src="/photos/logo.png" alt="Pleuntje" width={44} height={44} className="h-11 w-11 rounded-full" />
          <span className="font-bold">Pleuntje</span>
        </Link>
      </div>
    </header>
  );
}

export const ROUTE_TEKST = {
  nl: {
    titel: "Route naar Pleuntje",
    omschrijving: "Zo vind je Pleuntje (nummer 125) op Recreatiepark De Eyckenhoff.",
    kop: "Welkom! Zo vind je Pleuntje",
    adres: "Recreatiepark De Eyckenhoff, Poolseweg 27 in Putten. Pleuntje is nummer 125.",
    uitvergrootAlt: "Uitvergrote route van de ingang van het park naar nummer 125",
    uitvergroot: "Uitvergroot: van de ingang naar nummer 125.",
    voet: "Te voet (oranje schoentjes)",
    voetStappen: [
      "Bij de ingang meteen linksaf, langs nummer 132.",
      "Het tweede straatje rechts, de Berkenlaan.",
      "Pleuntje (125) ligt aan je linkerhand.",
    ],
    auto: "Met de auto (blauwe lijn)",
    autoStappen: [
      "Vanaf de ingang rechtdoor de Eikenlaan op.",
      "Linksaf bij nummer 92.",
      "Linksaf de Soerenseweg op, dan rechtsaf de Kastanjeweg.",
      "Linksaf de Berkenlaan in, tot nummer 125.",
    ],
    parkAlt: "Plattegrond van het hele park met de looproute en de autoroute naar nummer 125",
    park: "Het hele park. Tik op de kaart om hem groot te openen. Kaart: © 2025 EMK cartografie.",
  },
  de: {
    titel: "Weg zu Pleuntje",
    omschrijving: "So findest du Pleuntje (Nummer 125) im Ferienpark De Eyckenhoff.",
    kop: "Willkommen! So findest du Pleuntje",
    adres: "Ferienpark De Eyckenhoff, Poolseweg 27 in Putten. Pleuntje ist Nummer 125.",
    uitvergrootAlt: "Vergrößerter Weg vom Eingang des Parks zu Nummer 125",
    uitvergroot: "Vergrößert: vom Eingang zu Nummer 125.",
    voet: "Zu Fuß (orange Schuhe)",
    voetStappen: [
      "Am Eingang gleich links abbiegen, an Nummer 132 vorbei.",
      "Die zweite Straße rechts, die Berkenlaan.",
      "Pleuntje (125) liegt auf der linken Seite.",
    ],
    auto: "Mit dem Auto (blaue Linie)",
    autoStappen: [
      "Vom Eingang geradeaus auf die Eikenlaan.",
      "Bei Nummer 92 links abbiegen.",
      "Links auf den Soerenseweg, dann rechts auf den Kastanjeweg.",
      "Links in die Berkenlaan, bis Nummer 125.",
    ],
    parkAlt: "Plan des ganzen Parks mit dem Fußweg und der Autoroute zu Nummer 125",
    park: "Der ganze Park. Tippe auf die Karte, um sie groß zu öffnen. Karte: © 2025 EMK cartografie.",
  },
  en: {
    titel: "Directions to Pleuntje",
    omschrijving: "How to find Pleuntje (number 125) at De Eyckenhoff holiday park.",
    kop: "Welcome! How to find Pleuntje",
    adres: "De Eyckenhoff holiday park, Poolseweg 27 in Putten. Pleuntje is number 125.",
    uitvergrootAlt: "Enlarged route from the park entrance to number 125",
    uitvergroot: "Enlarged: from the entrance to number 125.",
    voet: "On foot (orange footprints)",
    voetStappen: [
      "At the entrance turn left straight away, past number 132.",
      "Take the second lane on the right, the Berkenlaan.",
      "Pleuntje (125) is on your left.",
    ],
    auto: "By car (blue line)",
    autoStappen: [
      "From the entrance drive straight on along the Eikenlaan.",
      "Turn left at number 92.",
      "Turn left onto the Soerenseweg, then right onto the Kastanjeweg.",
      "Turn left into the Berkenlaan, up to number 125.",
    ],
    parkAlt: "Map of the whole park with the walking route and the driving route to number 125",
    park: "The whole park. Tap the map to open it full size. Map: © 2025 EMK cartografie.",
  },
  fr: {
    titel: "Itinéraire vers Pleuntje",
    omschrijving: "Comment trouver Pleuntje (numéro 125) au parc de vacances De Eyckenhoff.",
    kop: "Bienvenue ! Comment trouver Pleuntje",
    adres: "Parc de vacances De Eyckenhoff, Poolseweg 27 à Putten. Pleuntje est le numéro 125.",
    uitvergrootAlt: "Itinéraire agrandi de l'entrée du parc jusqu'au numéro 125",
    uitvergroot: "Agrandi : de l'entrée jusqu'au numéro 125.",
    voet: "À pied (empreintes orange)",
    voetStappen: [
      "À l'entrée, tournez tout de suite à gauche, en passant devant le numéro 132.",
      "Prenez la deuxième allée à droite, la Berkenlaan.",
      "Pleuntje (125) se trouve sur votre gauche.",
    ],
    auto: "En voiture (ligne bleue)",
    autoStappen: [
      "Depuis l'entrée, continuez tout droit sur l'Eikenlaan.",
      "Tournez à gauche au numéro 92.",
      "Tournez à gauche sur le Soerenseweg, puis à droite sur le Kastanjeweg.",
      "Tournez à gauche dans la Berkenlaan, jusqu'au numéro 125.",
    ],
    parkAlt: "Plan de tout le parc avec l'itinéraire à pied et en voiture jusqu'au numéro 125",
    park: "Tout le parc. Touchez la carte pour l'ouvrir en grand. Carte : © 2025 EMK cartografie.",
  },
} satisfies Record<Taal, unknown>;

export function RoutePagina({ taal }: { taal: Taal }) {
  const t = ROUTE_TEKST[taal];
  return (
    <>
      <Kop taal={taal} />
      <main className="flex-1 px-4 py-10">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-forest-900 sm:text-4xl">{t.kop}</h1>
            <p className="mt-2 text-forest-700">{t.adres}</p>
          </div>

          <figure className="rounded-2xl border border-forest-200 bg-white p-2">
            <Image
              src="/photos/plattegrond-route.jpg"
              alt={t.uitvergrootAlt}
              width={1150}
              height={850}
              className="h-auto w-full rounded-xl"
              priority
            />
            <figcaption className="px-2 pt-2 text-sm text-forest-700">{t.uitvergroot}</figcaption>
          </figure>

          <div className="grid gap-6 sm:grid-cols-2">
            <section className="border-t-4 border-[#e24814] pt-3">
              <h2 className="text-lg font-bold text-[#c23d10]">{t.voet}</h2>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-forest-900">
                {t.voetStappen.map((stap) => (
                  <li key={stap}>{stap}</li>
                ))}
              </ol>
            </section>
            <section className="border-t-4 border-[#1464eb] pt-3">
              <h2 className="text-lg font-bold text-[#1456c4]">{t.auto}</h2>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-forest-900">
                {t.autoStappen.map((stap) => (
                  <li key={stap}>{stap}</li>
                ))}
              </ol>
            </section>
          </div>

          <figure className="rounded-2xl border border-forest-200 bg-white p-2">
            <a href="/photos/plattegrond-park.jpg" target="_blank" rel="noopener">
              <Image
                src="/photos/plattegrond-park.jpg"
                alt={t.parkAlt}
                width={2000}
                height={1414}
                className="h-auto w-full rounded-xl"
              />
            </a>
            <figcaption className="px-2 pt-2 text-sm text-forest-700">{t.park}</figcaption>
          </figure>
        </div>
      </main>
      <Footer taal={taal} pagina="route-naar-pleuntje/" toonTaal={false} />
    </>
  );
}

export const AFVAL_TEKST = {
  nl: {
    titel: "Afval en uitgang – Pleuntje",
    omschrijving: "Waar je je afval kwijt kunt en waar de uitgang van Recreatiepark De Eyckenhoff is.",
    kop: "Afval en uitgang",
    tekst:
      "Je verlaat het park met de auto via de uitgang aan het eind van de Eikenlaan. Je afval kun je kwijt in de containers vlak voor de uitgang: ze staan schuin tegenover het speeltuintje, aan je rechterhand als je het park afrijdt.",
    alt: "Plattegrond van het hele park met de route van Pleuntje naar de uitgang en de afvalcontainers",
    onder:
      "Roze lijn: van Pleuntje (125) naar de uitgang, langs de afvalcontainers. Tik op de kaart om hem groot te openen. Kaart: © 2025 EMK cartografie.",
  },
  de: {
    titel: "Müll und Ausfahrt – Pleuntje",
    omschrijving: "Wo du deinen Müll entsorgen kannst und wo die Ausfahrt des Ferienparks De Eyckenhoff ist.",
    kop: "Müll und Ausfahrt",
    tekst:
      "Mit dem Auto verlässt du den Park über die Ausfahrt am Ende der Eikenlaan. Deinen Müll kannst du in den Containern kurz vor der Ausfahrt entsorgen: Sie stehen schräg gegenüber dem kleinen Spielplatz, auf der rechten Seite, wenn du den Park verlässt.",
    alt: "Plan des ganzen Parks mit dem Weg von Pleuntje zur Ausfahrt und den Müllcontainern",
    onder:
      "Rosa Linie: von Pleuntje (125) zur Ausfahrt, an den Müllcontainern vorbei. Tippe auf die Karte, um sie groß zu öffnen. Karte: © 2025 EMK cartografie.",
  },
  en: {
    titel: "Rubbish and exit – Pleuntje",
    omschrijving: "Where to leave your rubbish and where the exit of De Eyckenhoff holiday park is.",
    kop: "Rubbish and exit",
    tekst:
      "By car you leave the park through the exit at the end of the Eikenlaan. You can leave your rubbish in the containers just before the exit: they are diagonally opposite the little playground, on your right as you drive out of the park.",
    alt: "Map of the whole park with the route from Pleuntje to the exit and the rubbish containers",
    onder:
      "Pink line: from Pleuntje (125) to the exit, past the rubbish containers. Tap the map to open it full size. Map: © 2025 EMK cartografie.",
  },
  fr: {
    titel: "Déchets et sortie – Pleuntje",
    omschrijving: "Où déposer vos déchets et où se trouve la sortie du parc de vacances De Eyckenhoff.",
    kop: "Déchets et sortie",
    tekst:
      "En voiture, vous quittez le parc par la sortie au bout de l'Eikenlaan. Vous pouvez déposer vos déchets dans les conteneurs juste avant la sortie : ils se trouvent en diagonale en face de la petite aire de jeux, sur votre droite lorsque vous quittez le parc.",
    alt: "Plan de tout le parc avec le chemin de Pleuntje jusqu'à la sortie et les conteneurs à déchets",
    onder:
      "Ligne rose : de Pleuntje (125) jusqu'à la sortie, en passant par les conteneurs à déchets. Touchez la carte pour l'ouvrir en grand. Carte : © 2025 EMK cartografie.",
  },
} satisfies Record<Taal, unknown>;

export function AfvalPagina({ taal }: { taal: Taal }) {
  const t = AFVAL_TEKST[taal];
  return (
    <>
      <Kop taal={taal} />
      <main className="flex-1 px-4 py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-forest-900 sm:text-4xl">{t.kop}</h1>
            <p className="mt-3 text-forest-900">{t.tekst}</p>
          </div>

          <figure className="rounded-2xl border border-forest-200 bg-white p-2">
            <a href="/photos/plattegrond-uitgang-afval.jpg" target="_blank" rel="noopener">
              <Image
                src="/photos/plattegrond-uitgang-afval.jpg"
                alt={t.alt}
                width={2000}
                height={1414}
                className="h-auto w-full rounded-xl"
                priority
              />
            </a>
            <figcaption className="px-2 pt-2 text-sm text-forest-700">{t.onder}</figcaption>
          </figure>
        </div>
      </main>
      <Footer taal={taal} pagina="afval-en-uitgang/" toonTaal={false} />
    </>
  );
}
