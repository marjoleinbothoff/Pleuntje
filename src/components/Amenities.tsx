
const categories = [
  {
    title: "Keuken",
    items: [
      "Volledige keuken met koelkast, vriezer, oventje en fornuis",
      "Bakplaat",
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
    items: [
      "Rook- en koolmonoxidemelder",
      "Brandblusser",
      "EHBO-doos",
    ],
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
];

// De voorzieningen staan nu gewoon open op de pagina, in rustige kolommen.
export default function Amenities() {
  return (
    <section id="voorzieningen" className="scroll-offset px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <h2 className="text-4xl text-forest-900 sm:text-5xl">Voorzieningen</h2>
          <p className="mt-6 text-lg leading-relaxed text-forest-800">
            Alles wat je nodig hebt staat klaar, zo kun je meteen genieten.
          </p>
        </div>

        <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category.title} className="border-t border-forest-200 pt-6">
              <h3 className="text-2xl text-forest-900">{category.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {category.items.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-relaxed text-forest-800">
                    <span aria-hidden className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-forest-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
