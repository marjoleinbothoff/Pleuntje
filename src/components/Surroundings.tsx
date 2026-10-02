"use client";

import { useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

const photos = [
  {
    src: "/photos/omgeving-bostoren.jpg",
    alt: "Bostoren op Landgoed Schovenhorst in Putten",
    caption: "Bostoren, Landgoed Schovenhorst (Putten)",
  },
];

const categories = [
  {
    title: "Natuur & wandelen",
    places: [
      {
        name: "Nationaal Park De Hoge Veluwe",
        time: "± 25 min",
        text: "Prachtig natuurgebied met bos, heide en zandverstuivingen. Leen gratis een wit fietsje en fiets rond. Ook mooi voor kinderen.",
      },
      {
        name: "Radio Kootwijk",
        time: "± 20 min",
        text: "Bijzonder oud radiostation midden in een indrukwekkend stuifzandgebied. Sfeervol wandelgebied, net even anders.",
      },
      {
        name: "Kasteel Staverden",
        time: "± 15 min",
        text: "Piepklein dorpje (het kleinste van Nederland!) met een kasteeltje en watermolen. Heerlijk rustig wandelen.",
      },
      {
        name: "Speulderbos & Garderen",
        time: "± 10-15 min",
        text: "Mooie boswandelingen vlak om de hoek.",
      },
    ],
  },
  {
    title: "Cultuur & musea",
    places: [
      {
        name: "Kröller-Müller Museum",
        time: "± 25-30 min, in De Hoge Veluwe",
        text: "Wereldberoemde kunstcollectie met veel werk van Van Gogh, plus een prachtige beeldentuin.",
      },
      {
        name: "Paleis Het Loo, Apeldoorn",
        time: "± 25-30 min",
        text: "Voormalig koninklijk paleis met schitterende tuinen.",
      },
      {
        name: "Amersfoort",
        time: "± 25-30 min",
        text: "Gezellige historische binnenstad met de Koppelpoort, grachtjes en leuke terrasjes.",
      },
      {
        name: "Elburg",
        time: "± 30 min",
        text: "Goed bewaard middeleeuws vestingstadje, heel sfeervol om doorheen te slenteren.",
      },
      {
        name: "Kasteel Cannenburch, Vaassen",
        time: "± 35 min",
        text: "Sfeervol kasteel met mooie tuinen.",
      },
      {
        name: "Nederlands Openluchtmuseum, Arnhem",
        time: "± 40 min",
        text: "Historische gebouwen en verhalen door heel Nederland heen, op één groot terrein.",
      },
      {
        name: "Nationaal Militair Museum, Soesterberg",
        time: "± 40 min",
        text: "Boeiend museum over oorlog en vrede, ook met vliegtuigen buiten.",
      },
    ],
  },
  {
    title: "Gezellige dorpjes & steden",
    places: [
      {
        name: "Barneveld",
        time: "± 10 min",
        text: "Dichtstbijzijnde plaats, leuk voor een terrasje of wat boodschappen.",
      },
      {
        name: "Nunspeet",
        time: "± 20 min",
        text: "Aan de rand van de Veluwe, met strandjes aan het Veluwemeer.",
      },
      {
        name: "Harderwijk",
        time: "± 20-25 min",
        text: "Historisch havenstadje aan het water, gezellig om te wandelen.",
      },
      {
        name: "Hattem",
        time: "± 35 min",
        text: "Klein, goed bewaard vestingstadje, heel schilderachtig.",
      },
      {
        name: "Deventer",
        time: "± 40-45 min",
        text: "Sfeervolle Hanzestad met een gezellig historisch centrum.",
      },
      {
        name: "Zwolle",
        time: "± 45 min",
        text: "Prachtige oude binnenstad, veel terrasjes en winkels.",
      },
      {
        name: "Nijmegen",
        time: "± 50 min",
        text: "Oudste stad van Nederland, mooie Waalkade om te wandelen.",
      },
      {
        name: "Utrecht",
        time: "± 50-55 min",
        text: "Sfeervolle grachten, de Domtoren, veel te doen.",
      },
    ],
  },
  {
    title: "Leuk voor kinderen",
    places: [
      {
        name: "Bosbad Putten",
        time: "± 10 min",
        text: "Heerlijk natuurlijk zwembad midden in het bos, met een echt strandje. Top voor het hele gezin, vlakbij.",
      },
      {
        name: "Apenheul, Apeldoorn",
        time: "± 25-30 min",
        text: "Dierentuin waar apen vrij rondlopen. Ook leuk voor volwassenen!",
      },
      {
        name: "Julianatoren, Apeldoorn",
        time: "± 25-30 min",
        text: "Attractiepark voor de kleintjes.",
      },
      {
        name: "Dolfinarium, Harderwijk",
        time: "± 20-25 min",
        text: "Shows met dolfijnen en zeeleeuwen.",
      },
      {
        name: "Burgers' Zoo, Arnhem",
        time: "± 40 min",
        text: "Grote, mooie dierentuin met verschillende klimaatgebieden. Ook top voor volwassenen.",
      },
      {
        name: "Walibi Holland, Biddinghuizen",
        time: "± 40-45 min",
        text: "Pretpark met achtbanen, vooral leuk voor oudere kinderen en tieners.",
      },
    ],
  },
  {
    title: "Ontspannen",
    places: [
      {
        name: "De sauna om de hoek van Pleuntje",
        time: "± 5 min",
        text: "Zoals je misschien al weet: heerlijk dichtbij!",
      },
      {
        name: "Terrasjes en restaurants",
        time: "Barneveld & Harderwijk",
        text: "Voor een lekker etentje.",
      },
    ],
  },
] as const;

export default function Surroundings() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="omgeving"
      className="scroll-offset relative overflow-hidden px-4 py-20"
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-4xl font-bold text-forest-50">
            Ontdek de omgeving van{" "}
            <span className="glossy-text" data-text="Pleuntje">
              Pleuntje
            </span>
          </h2>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-8 mb-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-sunset-100 px-4 py-1.5 text-sm font-bold text-sunset-700"
          >
            Omgeving
          </button>
          <p className="text-lg text-forest-50">
            Pleuntje ligt midden op de Veluwe, vlakbij Voorthuizen en
            Putten. Genoeg te doen in de buurt! Klik op de knop Omgeving
            hierboven voor onze favoriete plekjes, van vlakbij tot
            maximaal een uur rijden.
          </p>
        </div>
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
              className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-[2.5rem] bg-white p-6 shadow-lg sm:p-10"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-forest-900">
                Ontdek de omgeving van Pleuntje
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {photos.map((photo) => (
                  <div key={photo.src}>
                    <div className="relative h-0 w-full overflow-hidden rounded-2xl pt-[75%]">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 640px) 220px, 45vw"
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-1.5 text-sm text-forest-700">
                      {photo.caption}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                {categories.map((category) => (
                  <div key={category.title}>
                    <h4 className="text-sm font-bold tracking-wide text-sunset-600 uppercase">
                      {category.title}
                    </h4>
                    <ul className="mt-3 space-y-3">
                      {category.places.map((place) => (
                        <li key={place.name}>
                          <p className="font-bold text-forest-900">
                            {place.name}{" "}
                            <span className="font-normal text-forest-500">
                              ({place.time})
                            </span>
                          </p>
                          <p className="mt-0.5 text-sm text-forest-700">
                            {place.text}
                          </p>
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
