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
    titel: "Vertrekken – Pleuntje",
    omschrijving: "Wat je doet voor vertrek, waar je je afval kwijt kunt en waar de uitgang van Recreatiepark De Eyckenhoff is.",
    lijstKop: "Check-out lijst",
    lijstIntro: "Voor je vertrek vragen we je of je het volgende wilt doen.",
    lijst: [
      ["Vloer", "Pleuntje bezemschoon achter te laten. In de grote slaapkamer hangt een bezem, links om de hoek naast de deur, een stofzuiger vind je in de smalle kast links naast het raam."],
      ["Keuken", "al het keukengerei schoon en droog op te bergen in de kasten."],
      ["Bedden", "de bedden af te halen en het beddengoed op de grond te leggen, bij voorkeur alles op één plek."],
      ["Badkamer", "natte handdoeken op de verwarming in de badkamer te hangen. Als ze droog zijn, kunnen ze bij het beddengoed op de grond worden gelegd."],
      ["Overig", "de sleutel en de tag van de slagboom weer in het sleutelkluisje aan de schuur te doen."],
      ["Afval", "afval weg te gooien in de afvalcontainers voor restafval, glas en papier. Deze containers staan aan de rechterkant van de weg naar de uitgang, ter hoogte van de gastank."],
    ] as [string, string][],
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
    lijstKop: "Check-out-Liste",
    lijstIntro: "Vor deiner Abreise bitten wir dich, Folgendes zu erledigen.",
    lijst: [
      ["Boden", "Pleuntje besenrein zu hinterlassen. Im großen Schlafzimmer hängt ein Besen, links um die Ecke neben der Tür; einen Staubsauger findest du im schmalen Schrank links neben dem Fenster."],
      ["Küche", "das ganze Küchengeschirr sauber und trocken in die Schränke zu räumen."],
      ["Betten", "die Betten abzuziehen und die Bettwäsche auf den Boden zu legen, am liebsten alles an einer Stelle."],
      ["Badezimmer", "nasse Handtücher auf die Heizung im Badezimmer zu hängen. Wenn sie trocken sind, können sie zur Bettwäsche auf den Boden gelegt werden."],
      ["Sonstiges", "den Schlüssel und den Chip für die Schranke wieder in den Schlüsseltresor am Schuppen zu legen."],
      ["Müll", "den Müll in die Container für Restmüll, Glas und Papier zu werfen. Die Container stehen auf der rechten Seite des Weges zur Ausfahrt, auf Höhe des Gastanks."],
    ] as [string, string][],
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
    lijstKop: "Check-out list",
    lijstIntro: "Before you leave, we kindly ask you to do the following.",
    lijst: [
      ["Floor", "leave Pleuntje swept clean. There is a broom in the large bedroom, to the left around the corner next to the door; you will find a vacuum cleaner in the narrow cupboard to the left of the window."],
      ["Kitchen", "put all kitchenware away in the cupboards, clean and dry."],
      ["Beds", "strip the beds and leave the bedding on the floor, preferably all in one place."],
      ["Bathroom", "hang wet towels on the radiator in the bathroom. Once they are dry, they can go on the floor with the bedding."],
      ["Other", "put the key and the tag for the barrier back in the key safe on the shed."],
      ["Rubbish", "throw your rubbish in the containers for general waste, glass and paper. These containers are on the right-hand side of the road to the exit, next to the gas tank."],
    ] as [string, string][],
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
    lijstKop: "Liste de départ",
    lijstIntro: "Avant votre départ, nous vous demandons de bien vouloir faire ce qui suit.",
    lijst: [
      ["Sol", "laisser Pleuntje balayé. Un balai est accroché dans la grande chambre, à gauche au coin près de la porte ; vous trouverez un aspirateur dans le placard étroit à gauche de la fenêtre."],
      ["Cuisine", "ranger toute la vaisselle propre et sèche dans les placards."],
      ["Lits", "défaire les lits et poser le linge de lit par terre, de préférence tout au même endroit."],
      ["Salle de bains", "suspendre les serviettes mouillées sur le radiateur de la salle de bains. Une fois sèches, elles peuvent être posées par terre avec le linge de lit."],
      ["Divers", "remettre la clé et le badge de la barrière dans la boîte à clés sur la remise."],
      ["Déchets", "jeter vos déchets dans les conteneurs pour ordures ménagères, verre et papier. Ces conteneurs se trouvent sur le côté droit de la route vers la sortie, à hauteur de la citerne de gaz."],
    ] as [string, string][],
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
          {/* Check-out lijst (23 okt 2026, tekst van Marjolein) */}
          <section>
            <h1 className="text-3xl font-bold text-forest-900 sm:text-4xl">{t.lijstKop}</h1>
            <p className="mt-3 font-bold text-forest-900">{t.lijstIntro}</p>
            <ul className="mt-4 space-y-3 text-forest-900">
              {t.lijst.map(([kop, tekst]) => (
                <li key={kop}>
                  <strong>{kop}:</strong> {tekst}
                </li>
              ))}
            </ul>
          </section>

          <div className="pt-4">
            <h2 className="text-2xl font-bold text-forest-900 sm:text-3xl">{t.kop}</h2>
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

// Pagina "Informatie voor je verblijf" (23 okt 2026): huisregels van Marjolein (haar papieren
// lijst uit het huisje, zonder wifi: de code staat openbaar op GitHub), daaronder de check-out
// lijst en afval en uitgang (uit AFVAL_TEKST). Niet in menu, sitemap of Google.
export const INFO_TEKST = {
  nl: {
    titel: "Informatie voor je verblijf – Pleuntje",
    omschrijving: "Huisregels, check-out lijst, afval en uitgang van Pleuntje.",
    kop: "Informatie voor je verblijf",
    intro: "Fijn dat je in Pleuntje verblijft! Hier vind je de huisregels, wat je doet voor vertrek en waar je je afval kwijt kunt.",
    huisKop: "Huisregels en praktische zaken",
    regels: [
      ["Kaarsen", "géén kaarsen of waxinelichtjes laten branden in Pleuntje, een houten chalet is helaas een stuk brandgevaarlijker dan een stenen huis."],
      ["Roken", "binnen roken is niet toegestaan. Buiten roken mag, in de bovenste la van de grijze ladekast in de woonkamer staat een asbak voor gebruik buiten. Graag de asbak legen en schoonmaken voor vertrek."],
      ["Geluid", "buiten het chalet hoorbare muziek is op het park (ook overdag) niet toegestaan, de eigenaar van het park let hier scherp op. Vanaf 22:00 uur moet het stil zijn vanwege de nachtrust."],
      ["Groepenkast", "let op! Dit chalet heeft slechts twee groepen van bij elkaar 16 ampère. Zorg ervoor dat je niet te veel elektrische apparaten tegelijk aanzet, vooral geen apparaten die veel elektriciteit gebruiken. Bijvoorbeeld: koffiezetapparaat en waterkoker kunnen niet tegelijk aan, dan valt de elektriciteit uit. De groepenkast vind je bovenin de smalle kast links van het raam in de grote slaapkamer. In die kast hangt ook een brandblusser."],
      ["Toilet", "spoel tampons en maandverband niet door in het toilet, het zijn oude rioolpijpen en verstopping ligt op de loer. Gebruik hiervoor de afvalbak in de badkamer."],
      ["Honden", "honden zijn toegestaan in Pleuntje. Honden mogen op een kleedje op de bank liggen, uit een oogpunt van hygiëne niet in bed. De tuin is omheind maar houd je dier in de gaten, je blijft te allen tijde zelf verantwoordelijk voor je huisdier."],
      ["Verlies/schade", "schade aan Pleuntje of aan de inboedel dient te worden vergoed door de gast. De eigenaar van Pleuntje is niet aansprakelijk voor verlies van en/of schade aan eigendommen van de gast."],
      ["Winkelen", "in Putten centrum en omgeving vind je een ruime keuze aan winkels, waaronder supermarkten als Albert Heijn, Jumbo, Plus, Lidl en Aldi. In Voorthuizen centrum zijn ook supermarkten: Albert Heijn, Jumbo en Aldi."],
    ] as [string, string][],
  },
  de: {
    titel: "Infos für deinen Aufenthalt – Pleuntje",
    omschrijving: "Hausregeln, Check-out-Liste, Müll und Ausfahrt von Pleuntje.",
    kop: "Infos für deinen Aufenthalt",
    intro: "Schön, dass du in Pleuntje wohnst! Hier findest du die Hausregeln, was du vor der Abreise erledigst und wo du deinen Müll entsorgen kannst.",
    huisKop: "Hausregeln und Praktisches",
    regels: [
      ["Kerzen", "bitte keine Kerzen oder Teelichter in Pleuntje anzünden – ein Holzchalet ist leider deutlich brandgefährlicher als ein Steinhaus."],
      ["Rauchen", "Rauchen ist drinnen nicht erlaubt. Draußen darfst du rauchen; in der obersten Schublade der grauen Kommode im Wohnzimmer liegt ein Aschenbecher für draußen. Bitte leere und reinige den Aschenbecher vor der Abreise."],
      ["Lärm", "Musik, die außerhalb des Chalets zu hören ist, ist im Park nicht erlaubt (auch tagsüber); der Parkbesitzer achtet streng darauf. Ab 22:00 Uhr gilt Nachtruhe."],
      ["Sicherungskasten", "Achtung! Dieses Chalet hat nur zwei Stromkreise mit zusammen 16 Ampere. Schalte nicht zu viele elektrische Geräte gleichzeitig ein, vor allem keine Geräte, die viel Strom verbrauchen. Zum Beispiel: Kaffeemaschine und Wasserkocher können nicht gleichzeitig laufen, sonst fällt der Strom aus. Der Sicherungskasten befindet sich oben im schmalen Schrank links vom Fenster im großen Schlafzimmer. In diesem Schrank hängt auch ein Feuerlöscher."],
      ["Toilette", "bitte keine Tampons oder Binden in die Toilette werfen – die Abwasserrohre sind alt und verstopfen schnell. Benutze dafür den Abfalleimer im Badezimmer."],
      ["Hunde", "Hunde sind in Pleuntje willkommen. Hunde dürfen auf einer Decke auf dem Sofa liegen, aus hygienischen Gründen aber nicht im Bett. Der Garten ist eingezäunt, behalte deinen Hund trotzdem im Auge; du bist jederzeit selbst für dein Tier verantwortlich."],
      ["Verlust/Schaden", "Schäden an Pleuntje oder am Inventar sind vom Gast zu ersetzen. Die Eigentümer von Pleuntje haften nicht für Verlust oder Beschädigung von Eigentum des Gastes."],
      ["Einkaufen", "im Zentrum von Putten und Umgebung gibt es viele Geschäfte, darunter Supermärkte wie Albert Heijn, Jumbo, Plus, Lidl und Aldi. Auch im Zentrum von Voorthuizen gibt es Supermärkte: Albert Heijn, Jumbo und Aldi."],
    ] as [string, string][],
  },
  en: {
    titel: "Information for your stay – Pleuntje",
    omschrijving: "House rules, check-out list, rubbish and exit at Pleuntje.",
    kop: "Information for your stay",
    intro: "We're glad you're staying at Pleuntje! Here you'll find the house rules, what to do before you leave and where to leave your rubbish.",
    huisKop: "House rules and practical matters",
    regels: [
      ["Candles", "please do not light candles or tea lights in Pleuntje – a wooden chalet is unfortunately much more of a fire risk than a brick house."],
      ["Smoking", "smoking indoors is not allowed. You may smoke outside; there is an ashtray for outdoor use in the top drawer of the grey chest of drawers in the living room. Please empty and clean the ashtray before you leave."],
      ["Noise", "music that can be heard outside the chalet is not allowed on the park (also during the day); the park owner is strict about this. From 22:00 it must be quiet for the night."],
      ["Fuse box", "please note! This chalet has only two circuits with a combined 16 amps. Don't switch on too many electrical appliances at the same time, especially not ones that use a lot of power. For example: the coffee maker and the kettle cannot be on at the same time, or the power will trip. The fuse box is at the top of the narrow cupboard to the left of the window in the large bedroom. A fire extinguisher also hangs in that cupboard."],
      ["Toilet", "please do not flush tampons or sanitary pads down the toilet – the drain pipes are old and block easily. Use the bin in the bathroom instead."],
      ["Dogs", "dogs are welcome at Pleuntje. Dogs may lie on a blanket on the sofa, but for hygiene reasons not in bed. The garden is fenced, but keep an eye on your dog; you remain responsible for your pet at all times."],
      ["Loss/damage", "damage to Pleuntje or its contents must be paid for by the guest. The owners of Pleuntje are not liable for loss of or damage to guests' belongings."],
      ["Shopping", "in the centre of Putten and the surrounding area you'll find plenty of shops, including supermarkets such as Albert Heijn, Jumbo, Plus, Lidl and Aldi. The centre of Voorthuizen also has supermarkets: Albert Heijn, Jumbo and Aldi."],
    ] as [string, string][],
  },
  fr: {
    titel: "Informations pour votre séjour – Pleuntje",
    omschrijving: "Règlement intérieur, liste de départ, déchets et sortie de Pleuntje.",
    kop: "Informations pour votre séjour",
    intro: "Nous sommes ravis de vous accueillir à Pleuntje ! Vous trouverez ici le règlement intérieur, ce qu'il faut faire avant le départ et où déposer vos déchets.",
    huisKop: "Règlement intérieur et informations pratiques",
    regels: [
      ["Bougies", "merci de ne pas allumer de bougies ni de bougies chauffe-plat dans Pleuntje : un chalet en bois présente malheureusement bien plus de risques d'incendie qu'une maison en pierre."],
      ["Tabac", "il est interdit de fumer à l'intérieur. Vous pouvez fumer dehors ; un cendrier pour l'extérieur se trouve dans le tiroir du haut de la commode grise du salon. Merci de vider et de nettoyer le cendrier avant votre départ."],
      ["Bruit", "la musique audible à l'extérieur du chalet n'est pas autorisée dans le parc (même en journée) ; le propriétaire du parc y veille strictement. À partir de 22h00, le silence est de rigueur pour le repos de chacun."],
      ["Tableau électrique", "attention ! Ce chalet ne dispose que de deux circuits de 16 ampères au total. Évitez d'allumer trop d'appareils électriques en même temps, surtout ceux qui consomment beaucoup. Par exemple : la cafetière et la bouilloire ne peuvent pas fonctionner en même temps, sinon le courant saute. Le tableau électrique se trouve en haut du placard étroit à gauche de la fenêtre dans la grande chambre. Un extincteur est également accroché dans ce placard."],
      ["Toilettes", "ne jetez pas de tampons ni de serviettes hygiéniques dans les toilettes : les canalisations sont anciennes et se bouchent facilement. Utilisez la poubelle de la salle de bains."],
      ["Chiens", "les chiens sont les bienvenus à Pleuntje. Ils peuvent s'allonger sur une couverture sur le canapé, mais pas dans le lit, pour des raisons d'hygiène. Le jardin est clôturé, mais gardez un œil sur votre chien ; vous restez à tout moment responsable de votre animal."],
      ["Perte/dommages", "les dommages causés à Pleuntje ou à son mobilier doivent être remboursés par le client. Les propriétaires de Pleuntje ne sont pas responsables de la perte ou de l'endommagement des biens du client."],
      ["Courses", "dans le centre de Putten et ses environs, vous trouverez un grand choix de magasins, dont des supermarchés comme Albert Heijn, Jumbo, Plus, Lidl et Aldi. Le centre de Voorthuizen compte aussi des supermarchés : Albert Heijn, Jumbo et Aldi."],
    ] as [string, string][],
  },
} satisfies Record<Taal, unknown>;

function Lijst({ items }: { items: [string, string][] }) {
  return (
    <ul className="mt-4 space-y-3 text-forest-900">
      {items.map(([kop, tekst]) => (
        <li key={kop}>
          <strong>{kop}:</strong> {tekst}
        </li>
      ))}
    </ul>
  );
}

export function InformatiePagina({ taal }: { taal: Taal }) {
  const i = INFO_TEKST[taal];
  const t = AFVAL_TEKST[taal];
  const blok = "rounded-3xl border border-forest-200 bg-white p-5 sm:p-7";
  return (
    <>
      <Kop taal={taal} />
      <main className="flex-1 px-4 py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-forest-900 sm:text-4xl">{i.kop}</h1>
            <p className="mt-3 text-lg text-forest-900">{i.intro}</p>
          </div>

          <section id="huisregels" className={`${blok} scroll-mt-4`}>
            <h2 className="text-2xl font-bold text-forest-900">{i.huisKop}</h2>
            <Lijst items={i.regels} />
          </section>

          <section id="check-out" className={`${blok} scroll-mt-4`}>
            <h2 className="text-2xl font-bold text-forest-900">{t.lijstKop}</h2>
            <p className="mt-3 font-bold text-forest-900">{t.lijstIntro}</p>
            <Lijst items={t.lijst} />
          </section>

          <section id="afval-en-uitgang" className={`${blok} scroll-mt-4`}>
            <h2 className="text-2xl font-bold text-forest-900">{t.kop}</h2>
            <p className="mt-3 text-forest-900">{t.tekst}</p>
            <figure className="mt-4 rounded-2xl border border-forest-200 bg-white p-2">
              <a href="/photos/plattegrond-uitgang-afval.jpg" target="_blank" rel="noopener">
                <Image
                  src="/photos/plattegrond-uitgang-afval.jpg"
                  alt={t.alt}
                  width={2000}
                  height={1414}
                  className="h-auto w-full rounded-xl"
                />
              </a>
              <figcaption className="px-2 pt-2 text-sm text-forest-700">{t.onder}</figcaption>
            </figure>
          </section>
        </div>
      </main>
      <Footer taal={taal} pagina="informatie/" toonTaal={false} />
    </>
  );
}
