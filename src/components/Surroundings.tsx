"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import LeafIcon from "@/components/LeafIcon";

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
        name: "Landgoed Schovenhorst",
        time: "± 10-15 min",
        text: "Prachtig landgoed met vijf bijzondere bomentuinen, een speelbos en de beklimbare Bostoren (40 meter hoog, met een spectaculair uitzicht over de Veluwe). Ook heel leuk voor kinderen: klauternetten, hutten bouwen en een zandbak.",
        url: "https://schovenhorst.nl/bomentuin/vijf-bomentuinen/",
      },
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
        name: "Garderen",
        time: "± 10-15 min",
        text: "Knus Veluws dorpje met een eigen dorpsplein, leuke winkeltjes en gezellige terrasjes, vlak om de hoek.",
      },
      {
        name: "Amersfoort",
        time: "± 25-30 min",
        text: "Sfeervolle historische binnenstad met de Koppelpoort, gezellige grachtjes en volop terrasjes en winkels.",
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
        name: "Sauna Drôme, om de hoek van Pleuntje",
        time: "± 5 min",
        text: "Zoals je misschien al weet: heerlijk dichtbij! Authentieke houtgestookte sauna's, een lekker buitenbad en een Turks hamam, omringd door bos en water.",
        url: "https://saunadrome-putten.nl/",
        logo: "/photos/sauna-drome-logo.png",
      },
    ],
  },
] as const;

export default function Surroundings() {
  const [open, setOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    function checkHash() {
      if (window.location.hash === "#omgeving") setOpen(true);
    }
    function handleClick(event: MouseEvent) {
      const target = (event.target as HTMLElement)?.closest(
        'a[href="#omgeving"]',
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

  useEffect(() => {
    if (lightboxIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex((i) => (i === null ? i : (i + 1) % photos.length));
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((i) =>
          i === null ? i : (i - 1 + photos.length) % photos.length,
        );
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex]);

  return (
    <section
      id="omgeving"
      className="scroll-offset relative overflow-hidden px-4 py-20"
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-4xl font-bold text-forest-900">
            Ontdek de omgeving van{" "}
            <span className="glossy-text" data-text="Pleuntje">
              Pleuntje
            </span>
          </h2>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-8 mb-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-sunset-500 px-4 py-1.5 text-sm font-bold text-forest-900"
          >
            Omgeving
          </button>
          <p className="text-lg text-forest-900">
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
              className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-[2.5rem] bg-cream p-6 shadow-lg sm:p-10"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-forest-900">
                Ontdek de omgeving van Pleuntje
              </h3>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {photos.map((photo, index) => (
                  <div key={photo.src}>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      aria-label={`Bekijk foto groter: ${photo.caption}`}
                      className="relative block h-0 w-full cursor-pointer overflow-hidden rounded-2xl pt-[75%]"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 640px) 340px, 90vw"
                        className="object-cover"
                      />
                    </button>
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
                        <li
                          key={place.name}
                          className={
                            "logo" in place
                              ? "flex items-center gap-4"
                              : "flex items-start gap-2"
                          }
                        >
                          <LeafIcon className="mt-1 text-sunset-500" />
                          {"logo" in place && (
                            <Image
                              src={place.logo}
                              alt={`Logo van ${place.name}`}
                              width={96}
                              height={63}
                              className="h-14 w-auto shrink-0 object-contain"
                            />
                          )}
                          <div>
                            <p className="font-bold text-forest-900">
                              {"url" in place ? (
                                <a
                                  href={place.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-sunset-600"
                                >
                                  {place.name}
                                </a>
                              ) : (
                                place.name
                              )}{" "}
                              <span className="font-normal text-forest-700">
                                ({place.time})
                              </span>
                            </p>
                            <p className="mt-0.5 text-sm text-forest-700">
                              {place.text}
                            </p>
                          </div>
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

      {lightboxIndex !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Sluiten"
              className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
            >
              ✕
            </button>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(
                      (i) => ((i ?? 0) - 1 + photos.length) % photos.length,
                    );
                  }}
                  aria-label="Vorige foto"
                  className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:left-4"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) => ((i ?? 0) + 1) % photos.length);
                  }}
                  aria-label="Volgende foto"
                  className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:right-4"
                >
                  ›
                </button>
              </>
            )}

            <div
              className="relative h-[70vh] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[lightboxIndex].src}
                alt={photos[lightboxIndex].alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>

            {photos.length > 1 && (
              <span className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white">
                {lightboxIndex + 1} / {photos.length}
              </span>
            )}
          </div>,
          document.body,
        )}
    </section>
  );
}
