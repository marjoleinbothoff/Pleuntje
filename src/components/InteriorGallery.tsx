"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Taal } from "@/i18n/talen";

// Namen en beschrijvingen van de ruimtes, in dezelfde volgorde als de foto's hieronder
const T: Record<
  Taal,
  {
    kop: string;
    intro: string;
    klik: string;
    bekijk: (ruimte: string) => string;
    foto: string;
    sluiten: string;
    vorige: string;
    volgende: string;
    vorigeFoto: string;
    volgendeFoto: string;
    ruimtes: { label: string; alt: string }[];
  }
> = {
  nl: {
    kop: "Binnenkijkje",
    intro:
      "Een gezellige woonkamer, een volledig ingerichte keuken, twee slaapkamers met boxsprings, een frisse badkamer en een terras om heerlijk buiten te zitten.",
    klik: "Klik op een foto om alle foto's van die ruimte te bekijken.",
    bekijk: (r) => `Bekijk foto's van ${r}`,
    foto: "foto",
    sluiten: "Sluiten",
    vorige: "Vorige",
    volgende: "Volgende",
    vorigeFoto: "Vorige foto",
    volgendeFoto: "Volgende foto",
    ruimtes: [
      { label: "Woonkamer", alt: "Woonkamer van Pleuntje met bank en eethoek" },
      { label: "Keuken", alt: "Keuken van Pleuntje" },
      { label: "Badkamer", alt: "Badkamer van Pleuntje met inloopdouche en wastafel" },
      { label: "Slaapkamers", alt: "Slaapkamers van Pleuntje" },
      { label: "Terras", alt: "Terras van Pleuntje met zitje tussen het groen" },
    ],
  },
  de: {
    kop: "Einblicke",
    intro:
      "Ein gemütliches Wohnzimmer, eine voll ausgestattete Küche, zwei Schlafzimmer mit Boxspringbetten, ein frisches Badezimmer und eine Terrasse, auf der man herrlich draußen sitzen kann.",
    klik: "Klicke auf ein Foto, um alle Fotos dieses Raums zu sehen.",
    bekijk: (r) => `Fotos ansehen: ${r}`,
    foto: "Foto",
    sluiten: "Schließen",
    vorige: "Zurück",
    volgende: "Weiter",
    vorigeFoto: "Vorheriges Foto",
    volgendeFoto: "Nächstes Foto",
    ruimtes: [
      { label: "Wohnzimmer", alt: "Wohnzimmer von Pleuntje mit Sofa und Essecke" },
      { label: "Küche", alt: "Küche von Pleuntje" },
      { label: "Badezimmer", alt: "Badezimmer von Pleuntje mit begehbarer Dusche und Waschbecken" },
      { label: "Schlafzimmer", alt: "Schlafzimmer von Pleuntje" },
      { label: "Terrasse", alt: "Terrasse von Pleuntje mit Sitzecke im Grünen" },
    ],
  },
  en: {
    kop: "Take a look inside",
    intro:
      "A cosy living room, a fully equipped kitchen, two bedrooms with box-spring beds, a fresh bathroom and a terrace for sitting outside.",
    klik: "Click on a photo to see all photos of that room.",
    bekijk: (r) => `View photos: ${r}`,
    foto: "photo",
    sluiten: "Close",
    vorige: "Previous",
    volgende: "Next",
    vorigeFoto: "Previous photo",
    volgendeFoto: "Next photo",
    ruimtes: [
      { label: "Living room", alt: "Pleuntje's living room with sofa and dining area" },
      { label: "Kitchen", alt: "Pleuntje's kitchen" },
      { label: "Bathroom", alt: "Pleuntje's bathroom with walk-in shower and washbasin" },
      { label: "Bedrooms", alt: "Pleuntje's bedrooms" },
      { label: "Terrace", alt: "Pleuntje's terrace with seating among the greenery" },
    ],
  },
  fr: {
    kop: "Un aperçu de l'intérieur",
    intro:
      "Un salon chaleureux, une cuisine entièrement équipée, deux chambres avec lits boxspring, une salle de bain lumineuse et une terrasse pour profiter du plein air.",
    klik: "Cliquez sur une photo pour voir toutes les photos de cette pièce.",
    bekijk: (r) => `Voir les photos : ${r}`,
    foto: "photo",
    sluiten: "Fermer",
    vorige: "Précédente",
    volgende: "Suivante",
    vorigeFoto: "Photo précédente",
    volgendeFoto: "Photo suivante",
    ruimtes: [
      { label: "Salon", alt: "Salon de Pleuntje avec canapé et coin repas" },
      { label: "Cuisine", alt: "Cuisine de Pleuntje" },
      { label: "Salle de bain", alt: "Salle de bain de Pleuntje avec douche à l'italienne et lavabo" },
      { label: "Chambres", alt: "Chambres de Pleuntje" },
      { label: "Terrasse", alt: "Terrasse de Pleuntje avec coin salon dans la verdure" },
    ],
  },
};

const photos = [
  {
    label: "Woonkamer",
    shape: "blob-3",
    alt: "Woonkamer van Pleuntje met bank en eethoek",
    images: [
      "/photos/woonkamer-03.jpg",
      "/photos/woonkamer-02.jpg",
      "/photos/woonkamer-04.jpg",
      "/photos/woonkamer-11.jpg",
      "/photos/woonkamer-05.jpg",
      "/photos/woonkamer-06.jpg",
      "/photos/woonkamer-08.jpg",
      "/photos/woonkamer-09.jpg",
    ],
  },
  {
    label: "Keuken",
    shape: "blob",
    alt: "Keuken van Pleuntje",
    images: [
      "/photos/keuken.jpg",
      "/photos/keuken-2.jpg",
      "/photos/keuken-4.jpg",
      "/photos/keuken-5.jpg",
    ],
  },
  {
    label: "Badkamer",
    shape: "blob-alt",
    alt: "Badkamer van Pleuntje met inloopdouche en wastafel",
    images: [
      "/photos/badkamer.jpg",
      "/photos/badkamer-3.jpg",
      "/photos/badkamer-4.jpg",
    ],
  },
  {
    label: "Slaapkamers",
    shape: "blob-3",
    alt: "Slaapkamers van Pleuntje",
    images: [
      "/photos/slaapkamer-1.jpg",
      "/photos/slaapkamer-2.jpg",
      "/photos/slaapkamer-3.jpg",
    ],
  },
  {
    label: "Terras",
    shape: "blob",
    alt: "Terras van Pleuntje met zitje tussen het groen",
    images: [
      "/photos/terras-1.jpg",
      "/photos/terras-2.jpg",
      "/photos/terras-3.jpg",
      "/photos/terras-4.jpg",
      "/photos/terras-5.jpg",
    ],
  },
] as const;

export default function InteriorGallery({ taal }: { taal: Taal }) {
  const t = T[taal];
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const activeGroup = openGroup !== null ? photos[openGroup] : null;
  const activeTekst = openGroup !== null ? t.ruimtes[openGroup] : null;

  useEffect(() => {
    if (!activeGroup) return;

    function onKeyDown(event: KeyboardEvent) {
      if (!activeGroup) return;
      if (event.key === "Escape") setOpenGroup(null);
      if (event.key === "ArrowRight") {
        setPhotoIndex((i) => (i + 1) % activeGroup.images.length);
      }
      if (event.key === "ArrowLeft") {
        setPhotoIndex(
          (i) => (i - 1 + activeGroup.images.length) % activeGroup.images.length,
        );
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeGroup]);

  return (
    <section id="binnenkijkje" className="scroll-offset px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-4xl font-bold text-forest-900">{t.kop}</h2>
          <p className="mt-8 text-lg text-forest-900">{t.intro}</p>
          <p className="mt-4 text-base text-forest-700">{t.klik}</p>
        </div>

        {/* Grote foto van de woonkamer bovenaan, daaronder de andere ruimtes twee aan twee.
            Overal dezelfde indeling als op de telefoon (Marjolein wil op de iPad hetzelfde zien). */}
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4">
          {photos.map((photo, groupIndex) => {
            const groot = groupIndex === 0;
            return (
              <button
                key={photo.label}
                type="button"
                onClick={() => {
                  setOpenGroup(groupIndex);
                  setPhotoIndex(0);
                }}
                aria-label={t.bekijk(t.ruimtes[groupIndex].label)}
                className={`group flex cursor-pointer flex-col text-left ${groot ? "col-span-2" : ""}`}
              >
                <span
                  className={`relative block w-full overflow-hidden rounded-[4px] ${
                    groot ? "aspect-[4/3]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={photo.images[0]}
                    alt={t.ruimtes[groupIndex].alt}
                    fill
                    sizes={groot ? "(min-width: 1024px) 900px, 100vw" : "(min-width: 1024px) 450px, 50vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </span>
                {/* Naam onder de foto, zodat de foto zelf vrij blijft */}
                <span className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <span className="font-wordmark text-xl leading-tight font-semibold text-forest-900 sm:text-2xl">
                    {t.ruimtes[groupIndex].label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activeGroup &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setOpenGroup(null)}
          >
          <button
            type="button"
            onClick={() => setOpenGroup(null)}
            aria-label={t.sluiten}
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
          >
            ✕
          </button>

          {activeGroup.images.length > 1 && (
            <div className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPhotoIndex(
                    (i) =>
                      (i - 1 + activeGroup.images.length) %
                      activeGroup.images.length,
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
                  setPhotoIndex((i) => (i + 1) % activeGroup.images.length);
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
              src={activeGroup.images[photoIndex]}
              alt={`${activeTekst?.alt ?? ""} — ${t.foto} ${photoIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {activeGroup.images.length > 1 && (
            <span className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white">
              {photoIndex + 1} / {activeGroup.images.length}
            </span>
          )}
          </div>,
          document.body,
        )}
    </section>
  );
}
