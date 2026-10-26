"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import LeafIcon from "@/components/LeafIcon";
import { OMGEVING } from "@/data/omgeving";
import type { Taal } from "@/i18n/talen";

const photos = [
  {
    src: "/photos/omgeving-bostoren.jpg",
    alt: {
      nl: "Bostoren op Landgoed Schovenhorst in Putten",
      de: "Bostoren auf dem Landgut Schovenhorst in Putten",
      en: "The Bostoren lookout tower at Schovenhorst estate in Putten",
      fr: "La tour Bostoren au domaine de Schovenhorst à Putten",
    },
    caption: {
      nl: "Bostoren, Landgoed Schovenhorst (Putten)",
      de: "Bostoren, Landgut Schovenhorst (Putten)",
      en: "Bostoren, Schovenhorst estate (Putten)",
      fr: "Bostoren, domaine de Schovenhorst (Putten)",
    },
  },
] as const;

const T: Record<
  Taal,
  {
    kop: string;
    knop: string;
    uitleg: string;
    sluiten: string;
    groter: string;
    logoVan: string;
    vorige: string;
    volgende: string;
    vorigeFoto: string;
    volgendeFoto: string;
  }
> = {
  nl: {
    kop: "Ontdek de omgeving van",
    knop: "Bekijk onze tips",
    uitleg:
      "Pleuntje staat op de Veluwe, vlakbij Voorthuizen en Putten. Genoeg te doen in de buurt! Klik op de knop hierboven voor onze favoriete plekjes, van vlakbij tot maximaal een uur rijden.",
    sluiten: "Sluiten",
    groter: "Bekijk foto groter",
    logoVan: "Logo van",
    vorige: "Vorige",
    volgende: "Volgende",
    vorigeFoto: "Vorige foto",
    volgendeFoto: "Volgende foto",
  },
  de: {
    kop: "Entdecke die Umgebung von",
    knop: "Unsere Tipps ansehen",
    uitleg:
      "Pleuntje liegt in der Veluwe, ganz in der Nähe von Voorthuizen und Putten. In der Umgebung gibt es viel zu erleben! Klicke oben auf den Knopf für unsere Lieblingsorte, von ganz nah bis höchstens eine Stunde Fahrt.",
    sluiten: "Schließen",
    groter: "Foto vergrößern",
    logoVan: "Logo von",
    vorige: "Zurück",
    volgende: "Weiter",
    vorigeFoto: "Vorheriges Foto",
    volgendeFoto: "Nächstes Foto",
  },
  en: {
    kop: "Discover the area around",
    knop: "See our tips",
    uitleg:
      "Pleuntje is on the Veluwe, close to Voorthuizen and Putten. There's plenty to do nearby! Click the button above for our favourite spots, from right next door to no more than an hour's drive.",
    sluiten: "Close",
    groter: "View larger photo",
    logoVan: "Logo of",
    vorige: "Previous",
    volgende: "Next",
    vorigeFoto: "Previous photo",
    volgendeFoto: "Next photo",
  },
  fr: {
    kop: "Découvrez les alentours de",
    knop: "Voir nos conseils",
    uitleg:
      "Pleuntje se trouve en Veluwe, tout près de Voorthuizen et de Putten. Il y a beaucoup à faire dans les environs ! Cliquez sur le bouton ci-dessus pour découvrir nos endroits préférés, de tout près à une heure de route maximum.",
    sluiten: "Fermer",
    groter: "Agrandir la photo",
    logoVan: "Logo de",
    vorige: "Précédente",
    volgende: "Suivante",
    vorigeFoto: "Photo précédente",
    volgendeFoto: "Photo suivante",
  },
};

export default function Surroundings({ taal }: { taal: Taal }) {
  const t = T[taal];
  const categories = OMGEVING[taal];
  const [open, setOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    // Haalt "#omgeving" weer uit het adres, zodat de pagina bij vernieuwen
    // niet steeds opnieuw met dit venster open begint.
    function clearHash() {
      setTimeout(() => {
        if (window.location.hash === "#omgeving") {
          history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search,
          );
        }
      }, 0);
    }
    function checkHash() {
      if (window.location.hash === "#omgeving") {
        setOpen(true);
        clearHash();
      }
    }
    function handleClick(event: MouseEvent) {
      const target = (event.target as HTMLElement)?.closest(
        'a[href="#omgeving"]',
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
      className="scroll-offset relative overflow-hidden overloop-omgeving px-4 pt-12 pb-20"
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-4xl font-bold text-roest-donker">
            {t.kop}{" "}
            <span className="glossy-text" data-text="Pleuntje">
              Pleuntje
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
                {t.kop} Pleuntje
              </h3>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {photos.map((photo, index) => (
                  <div key={photo.src}>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      aria-label={`${t.groter}: ${photo.caption[taal]}`}
                      className="relative block h-0 w-full cursor-pointer overflow-hidden rounded-2xl pt-[75%]"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt[taal]}
                        fill
                        sizes="(min-width: 640px) 340px, 90vw"
                        className="object-cover"
                      />
                    </button>
                    <p className="mt-1.5 text-sm text-forest-700">
                      {photo.caption[taal]}
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
                            place.logo
                              ? "flex items-center gap-4"
                              : "flex items-start gap-2"
                          }
                        >
                          <LeafIcon className="mt-1 text-sunset-500" />
                          {place.logo && (
                            <Image
                              src={place.logo}
                              alt={`${t.logoVan} ${place.name}`}
                              width={96}
                              height={63}
                              className="h-14 w-auto shrink-0 object-contain"
                            />
                          )}
                          <div>
                            <p className="font-bold text-forest-900">
                              {place.url ? (
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
              aria-label={t.sluiten}
              className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
            >
              ✕
            </button>

            {photos.length > 1 && (
              <div className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(
                      (i) => ((i ?? 0) - 1 + photos.length) % photos.length,
                    );
                  }}
                  aria-label={t.vorigeFoto}
                  className="flex items-center gap-1 rounded-full bg-sunset-100 px-4 py-1.5 text-sm font-bold whitespace-nowrap text-forest-900 shadow-md shadow-black/20 transition hover:bg-sunset-200"
                >
                  <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }}><path d="M9 5l7 7-7 7" /></svg>
                  {t.vorige}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) => ((i ?? 0) + 1) % photos.length);
                  }}
                  aria-label={t.volgendeFoto}
                  className="flex items-center gap-1 rounded-full bg-sunset-100 px-4 py-1.5 text-sm font-bold whitespace-nowrap text-forest-900 shadow-md shadow-black/20 transition hover:bg-sunset-200"
                >
                  {t.volgende}
                  <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}

            <div
              className="relative h-[70vh] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[lightboxIndex].src}
                alt={photos[lightboxIndex].alt[taal]}
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
