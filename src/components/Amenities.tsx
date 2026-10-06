const categories = [
  {
    title: "Keuken",
    items: [
      "Volledige keuken met koelkast, vriezer, oven en fornuis",
      "Bakplaat",
      "Koffiezetapparaat (Nespresso)",
      "Waterkoker",
      "Broodrooster",
      "Pannen, olie, zout en peper",
      "Borden, kommen, kopjes, bestek en glazen (ook wijnglazen)",
    ],
  },
  {
    title: "Slapen & badkamer",
    items: [
      "Beddengoed aanwezig, de bedden worden voor je opgemaakt",
      "Extra kussens en dekens",
      "Kledinghangers en opbergruimte voor kleding",
      "Handdoeken, shampoo, douchegel en conditioner",
      "Haardroger",
      "Warm water",
    ],
  },
  {
    title: "Buiten",
    items: [
      "Eigen, omheind terras met tuinmeubels",
      "Gratis parkeren op het terrein",
      "Oplaadpunt voor elektrische auto",
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
      "Eigen woonkamer met verwarming",
      "Schoonmaakartikelen aanwezig",
    ],
  },
];

export default function Amenities() {
  return (
    <section
      id="voorzieningen"
      className="scroll-offset relative overflow-hidden px-4 py-20"
    >
      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-4xl font-bold text-forest-900">
            <span className="glossy-text" data-text="Voorzieningen">
              Voorzieningen
            </span>
          </h2>
          <p className="mt-4 text-lg text-forest-900">
            Alles wat je nodig hebt staat klaar, zo kun je meteen genieten.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category.title}>
              <h3 className="text-sm font-bold tracking-wide text-sunset-600 uppercase">
                {category.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {category.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-relaxed text-forest-900"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-sunset-200 bg-sunset-50 p-6 sm:p-8">
          <h3 className="text-xl font-bold text-forest-900">
            Belangrijk om te weten
          </h3>
          <p className="mt-3 text-forest-900">
            Pleuntje is uitsluitend bedoeld voor recreatief verblijf.
            Verblijf voor woon- of werkdoeleinden is niet toegestaan. Blijkt
            dit toch het geval, dan dien je direct te vertrekken, zonder
            restitutie.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-forest-900">
            <li>Aankomst tussen 15:00 en 20:00, vertrek voor 11:00</li>
            <li>Stilte tussen 21:00 en 09:00</li>
            <li>Niet roken of vapen</li>
            <li>Maximaal 3 huisdieren toegestaan</li>
            <li>Geen feesten of evenementen</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
