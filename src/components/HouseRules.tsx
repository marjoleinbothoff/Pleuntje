"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LeafIcon from "@/components/LeafIcon";

const categories = [
  {
    title: "Algemeen",
    items: [
      "Aankomst tussen 15:00 uur en 20:00 uur, vertrek voor 11:00 uur",
      "Stilte tussen 21:00 uur en 09:00 uur",
      "Niet roken of vapen",
      "Vuilniszakken met afval weggooien in de containers op het terrein, rechts vlakbij de uitgang, schuin tegenover de speeltuin",
      "Geen feesten of evenementen",
    ],
  },
  {
    title: "Honden",
    items: [
      "Honden: €18 per verblijf (maximaal 3 honden)",
      "Eigen omheinde tuin, 80 cm hoog",
      "Niet op de bank, meubels of in de bedden",
      "Wil je hond toch even op de bank? Er ligt een kleedje klaar",
      "Is je hond nat geworden? Bij de voordeur hangt een handdoek om hem af te drogen",
    ],
  },
];

export default function HouseRules() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function checkHash() {
      if (window.location.hash === "#huisregels") setOpen(true);
    }
    function handleClick(event: MouseEvent) {
      const target = (event.target as HTMLElement)?.closest(
        'a[href="#huisregels"]',
      );
      if (target) setOpen(true);
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
      id="huisregels"
      className="scroll-offset relative overflow-hidden px-4 py-20"
    >
      <div className="relative mx-auto max-w-xl text-center">
        <h2 className="text-4xl font-bold text-forest-900">
          <span className="glossy-text" data-text="Huisregels">
            Huisregels
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-8 mb-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-sunset-100 px-4 py-1.5 text-sm font-bold text-forest-900"
        >
          Huisregels
        </button>
        <p className="text-lg text-forest-900">
          Zo zorgen we er samen voor dat iedereen fijn kan genieten van
          Pleuntje. Klik op de knop Huisregels hierboven voor het hele
          overzicht.
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
                Huisregels
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
