"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LeafIcon from "@/components/LeafIcon";
import type { Taal } from "@/i18n/talen";

type Categorie = { title: string; items: string[] };

const T: Record<Taal, { kop: string; knop: string; uitleg: string; sluiten: string; categories: Categorie[] }> = {
  nl: {
    kop: "Voorzieningen",
    knop: "Bekijk het overzicht",
    uitleg: "Alles wat je nodig hebt staat klaar, zo kun je meteen genieten. Klik op de knop hierboven voor het hele overzicht.",
    sluiten: "Sluiten",
    categories: [
      {
        title: "Keuken",
        items: [
          "Keuken met koelkast, vriezer en een heteluchtoventje",
          "Gaskookplaat",
          "Koffiezetapparaat (Nespresso)",
          "Waterkoker",
          "Broodrooster",
          "Pannen, olie, zout en peper",
          "Borden, kommen, kopjes, bestek en glazen",
          "Handdoeken en theedoeken aanwezig",
        ],
      },
      {
        title: "Slapen & badkamer",
        items: [
          "Alle bedden zijn boxsprings",
          "Beddengoed aanwezig, de bedden worden voor je opgemaakt",
          "Kledinghangers en opbergruimte voor kleding",
          "Handdoeken, shampoo en douchegel",
          "Haardroger",
          "Warm water",
        ],
      },
      {
        title: "Buiten",
        items: [
          "Eigen tuin en terras, met tuinmeubels",
          "Tuin omheind voor je hond, hoogte 80 cm",
          "Gratis parkeren op het terrein",
          "Oplaadpunt voor elektrische auto op loopafstand",
          "Eigen ingang",
        ],
      },
      {
        title: "Veiligheid",
        items: ["Rook- en koolmonoxidemelder", "Brandblusser", "EHBO-doos"],
      },
      {
        title: "Extra",
        items: [
          "Gratis wifi",
          "Platenspeler en geluidssysteem",
          "CV aanwezig in de gehele woning",
          "Schoonmaakartikelen aanwezig",
          "Honden water- en voerbakjes aanwezig",
        ],
      },
    ],
  },
  de: {
    kop: "Ausstattung",
    knop: "Übersicht ansehen",
    uitleg: "Alles, was du brauchst, ist schon da, damit du sofort genießen kannst. Klicke oben auf den Knopf für die vollständige Übersicht.",
    sluiten: "Schließen",
    categories: [
      {
        title: "Küche",
        items: [
          "Küche mit Kühlschrank, Gefrierfach und kleinem Heißluftofen",
          "Gaskochfeld",
          "Kaffeemaschine (Nespresso)",
          "Wasserkocher",
          "Toaster",
          "Töpfe und Pfannen, Öl, Salz und Pfeffer",
          "Teller, Schüsseln, Tassen, Besteck und Gläser",
          "Handtücher und Geschirrtücher vorhanden",
        ],
      },
      {
        title: "Schlafen & Bad",
        items: [
          "Alle Betten sind Boxspringbetten",
          "Bettwäsche vorhanden, die Betten werden für dich bezogen",
          "Kleiderbügel und Stauraum für Kleidung",
          "Handtücher, Shampoo und Duschgel",
          "Haartrockner",
          "Warmwasser",
        ],
      },
      {
        title: "Draußen",
        items: [
          "Eigener Garten und Terrasse mit Gartenmöbeln",
          "Garten eingezäunt für deinen Hund, Höhe 80 cm",
          "Kostenlose Parkplätze auf dem Gelände",
          "Ladestation für Elektroautos zu Fuß erreichbar",
          "Eigener Eingang",
        ],
      },
      {
        title: "Sicherheit",
        items: ["Rauch- und Kohlenmonoxidmelder", "Feuerlöscher", "Erste-Hilfe-Kasten"],
      },
      {
        title: "Extras",
        items: [
          "Kostenloses WLAN",
          "Plattenspieler und Musikanlage",
          "Zentralheizung im ganzen Haus",
          "Reinigungsmittel vorhanden",
          "Wasser- und Futternäpfe für Hunde vorhanden",
        ],
      },
    ],
  },
  en: {
    kop: "Amenities",
    knop: "View the overview",
    uitleg: "Everything you need is ready for you, so you can start enjoying right away. Click the button above for the full overview.",
    sluiten: "Close",
    categories: [
      {
        title: "Kitchen",
        items: [
          "Kitchen with fridge, freezer and a small convection oven",
          "Gas hob",
          "Coffee machine (Nespresso)",
          "Kettle",
          "Toaster",
          "Pots and pans, oil, salt and pepper",
          "Plates, bowls, cups, cutlery and glasses",
          "Towels and tea towels provided",
        ],
      },
      {
        title: "Sleeping & bathroom",
        items: [
          "All beds are box-spring beds",
          "Bed linen provided, beds are made up for you",
          "Clothes hangers and storage space for clothing",
          "Towels, shampoo and shower gel",
          "Hair dryer",
          "Hot water",
        ],
      },
      {
        title: "Outdoors",
        items: [
          "Private garden and terrace with garden furniture",
          "Garden fenced for your dog, 80 cm high",
          "Free parking on site",
          "Electric car charging point within walking distance",
          "Private entrance",
        ],
      },
      {
        title: "Safety",
        items: ["Smoke and carbon monoxide detector", "Fire extinguisher", "First aid kit"],
      },
      {
        title: "Extras",
        items: [
          "Free wifi",
          "Record player and sound system",
          "Central heating throughout",
          "Cleaning products provided",
          "Water and food bowls for dogs provided",
        ],
      },
    ],
  },
  fr: {
    kop: "Équipements",
    knop: "Voir la liste",
    uitleg: "Tout ce dont vous avez besoin est prêt, pour que vous puissiez profiter dès votre arrivée. Cliquez sur le bouton ci-dessus pour la liste complète.",
    sluiten: "Fermer",
    categories: [
      {
        title: "Cuisine",
        items: [
          "Cuisine avec réfrigérateur, congélateur et petit four à chaleur tournante",
          "Plaque de cuisson au gaz",
          "Machine à café (Nespresso)",
          "Bouilloire",
          "Grille-pain",
          "Casseroles et poêles, huile, sel et poivre",
          "Assiettes, bols, tasses, couverts et verres",
          "Serviettes et torchons fournis",
        ],
      },
      {
        title: "Chambres & salle de bain",
        items: [
          "Tous les lits sont des lits boxspring",
          "Linge de lit fourni, les lits sont faits à votre arrivée",
          "Cintres et rangements pour les vêtements",
          "Serviettes, shampooing et gel douche",
          "Sèche-cheveux",
          "Eau chaude",
        ],
      },
      {
        title: "Extérieur",
        items: [
          "Jardin privé et terrasse avec mobilier de jardin",
          "Jardin clôturé pour votre chien, hauteur 80 cm",
          "Parking gratuit sur place",
          "Borne de recharge pour voiture électrique à distance de marche",
          "Entrée privée",
        ],
      },
      {
        title: "Sécurité",
        items: ["Détecteur de fumée et de monoxyde de carbone", "Extincteur", "Trousse de premiers secours"],
      },
      {
        title: "Extras",
        items: [
          "Wifi gratuit",
          "Platine vinyle et système audio",
          "Chauffage central dans tout le chalet",
          "Produits d'entretien fournis",
          "Gamelles d'eau et de nourriture pour chiens fournies",
        ],
      },
    ],
  },
};

export default function Amenities({ taal }: { taal: Taal }) {
  const t = T[taal];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Haalt "#voorzieningen" weer uit het adres, zodat de pagina bij vernieuwen
    // niet steeds opnieuw met dit venster open begint.
    function clearHash() {
      setTimeout(() => {
        if (window.location.hash === "#voorzieningen") {
          history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search,
          );
        }
      }, 0);
    }
    function checkHash() {
      if (window.location.hash === "#voorzieningen") {
        setOpen(true);
        clearHash();
      }
    }
    function handleClick(event: MouseEvent) {
      const target = (event.target as HTMLElement)?.closest(
        'a[href="#voorzieningen"]',
      );
      if (target) {
        setOpen(true);
        clearHash();
      }
    }
    checkHash();
    window.addEventListener("hashchange", checkHash);
    document.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("hashchange", checkHash);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <section
      id="voorzieningen"
      className="scroll-offset relative overflow-hidden bg-salie px-4 pt-20 pb-12"
    >
      <div className="relative mx-auto max-w-xl text-center">
        <h2 className="text-4xl font-bold text-roest-donker">
          <span className="glossy-text" data-text={t.kop}>
            {t.kop}
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-8 mb-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-roest px-5 py-2 text-sm font-bold text-white transition hover:bg-roest-donker"
        >
          {t.knop}
        </button>
        <p className="text-lg text-forest-900">{t.uitleg}</p>
      </div>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.sluiten}
              className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
            >
              ✕
            </button>

            <div
              className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-[2.5rem] bg-cream p-6 shadow-lg sm:p-10"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-forest-900">
                {t.kop}
              </h3>

              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                {t.categories.map((category) => (
                  <div key={category.title}>
                    <h4 className="text-sm font-bold tracking-wide text-forest-700 uppercase">
                      {category.title}
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {category.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm leading-relaxed text-forest-900"
                        >
                          <LeafIcon className="mt-0.5 text-sunset-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
