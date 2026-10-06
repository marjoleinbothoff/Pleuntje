"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

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
  {
    title: "Huisregels",
    items: [
      "Aankomst tussen 15:00 en 20:00, vertrek voor 11:00",
      "Stilte tussen 21:00 en 09:00",
      "Niet roken of vapen",
      "Maximaal 3 huisdieren toegestaan",
      "Geen feesten of evenementen",
    ],
  },
];

export default function Amenities() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="voorzieningen"
      className="scroll-offset relative overflow-hidden px-4 py-20"
    >
      <div className="relative mx-auto max-w-xl text-center">
        <h2 className="text-4xl font-bold text-forest-900">
          <span className="glossy-text" data-text="Voorzieningen">
            Voorzieningen
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-8 mb-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-sunset-500 px-4 py-1.5 text-sm font-bold text-forest-900"
        >
          Voorzieningen
        </button>
        <p className="text-lg text-forest-900">
          Alles wat je nodig hebt staat klaar, zo kun je meteen genieten. Klik
          op de knop Voorzieningen hierboven voor het hele overzicht.
        </p>
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
              aria-label="Sluiten"
              className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
            >
              ✕
            </button>

            <div
              className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-[2.5rem] bg-cream p-6 shadow-lg sm:p-10"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-forest-900">
                Voorzieningen
              </h3>

              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                {categories.map((category) => (
                  <div key={category.title}>
                    <h4 className="text-sm font-bold tracking-wide text-forest-700 uppercase">
                      {category.title}
                    </h4>
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

              <p className="mx-auto mt-8 max-w-xl text-center text-xs text-forest-700">
                Pleuntje is uitsluitend bedoeld voor recreatief verblijf.
                Verblijf voor woon- of werkdoeleinden is niet toegestaan.
                Blijkt dit toch het geval, dan dien je direct te vertrekken,
                zonder restitutie.
              </p>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
