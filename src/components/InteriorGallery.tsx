"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

const photos = [
  {
    label: "Woonkamer",
    shape: "blob-3",
    alt: "Woonkamer van Pleuntje met bank en eethoek",
    images: [
      "/photos/woonkamer-3.jpg",
      "/photos/woonkamer-2.jpg",
      "/photos/woonkamer-4.jpg",
      "/photos/woonkamer-5.jpg",
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

export default function InteriorGallery() {
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const activeGroup = openGroup !== null ? photos[openGroup] : null;

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
    <section id="binnenkijkje" className="scroll-offset bg-sand px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <h2 className="text-4xl text-forest-900 sm:text-5xl">Binnenkijkje</h2>
          <p className="mt-6 text-lg leading-relaxed text-forest-800">
            Een gezellige woonkamer, een volledig ingerichte keuken, twee
            slaapkamers met boxsprings, een frisse badkamer en een terras om
            heerlijk buiten te zitten.
          </p>
        </div>

        {/* Grote foto van de woonkamer, daarnaast de andere ruimtes */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
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
                aria-label={`Bekijk foto's van ${photo.label}`}
                className={`group relative cursor-pointer overflow-hidden rounded-[4px] text-left ${
                  groot ? "col-span-2 aspect-[4/3] lg:row-span-2 lg:aspect-auto" : "aspect-square"
                }`}
              >
                <Image
                  src={photo.images[0]}
                  alt={photo.alt}
                  fill
                  sizes={groot ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 280px, 50vw"}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(20,30,22,0.6),rgba(20,30,22,0))]"
                />
                <span className="absolute bottom-3 left-4 font-wordmark text-2xl font-semibold text-white sm:bottom-4 sm:left-5">
                  {photo.label}
                </span>
                <span className="absolute right-4 bottom-4 hidden text-sm text-white/85 sm:block">
                  {photo.images.length} foto&apos;s
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
            aria-label="Sluiten"
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
          >
            ✕
          </button>

          {activeGroup.images.length > 1 && (
            <>
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
                aria-label="Vorige foto"
                className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:left-4"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPhotoIndex((i) => (i + 1) % activeGroup.images.length);
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
              src={activeGroup.images[photoIndex]}
              alt={`${activeGroup.alt} — foto ${photoIndex + 1}`}
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
