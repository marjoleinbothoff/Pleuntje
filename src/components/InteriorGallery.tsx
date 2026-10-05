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
    <section id="binnenkijkje" className="scroll-offset px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sunset-100 px-4 py-1.5 text-sm font-bold text-sunset-700">
            Binnenkijkje
          </span>
          <h2 className="mt-8 text-4xl font-bold text-forest-800">
            Ook van binnen knus en compleet
          </h2>
          <p className="mt-3 text-lg text-forest-800">
            Een gezellige woonkamer, een volledig ingerichte keuken, een
            frisse badkamer en een terras om heerlijk buiten te zitten.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {photos.map((photo, groupIndex) => {
            function openThisGroup() {
              setOpenGroup(groupIndex);
              setPhotoIndex(0);
            }

            return (
              <div key={photo.label} className="text-center">
                <button
                  type="button"
                  onClick={openThisGroup}
                  className={`photo-frame ${photo.shape} square-box mx-auto block w-full max-w-xs cursor-pointer`}
                  aria-label={`Bekijk foto's van ${photo.label}`}
                >
                  <Image
                    src={photo.images[0]}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 640px) 33vw, 80vw"
                    className="object-cover"
                  />
                </button>
                <button
                  type="button"
                  onClick={openThisGroup}
                  className="mt-4 inline-block cursor-pointer rounded-full bg-sunset-100 px-4 py-1.5 text-sm font-bold text-sunset-700"
                >
                  {photo.label}
                </button>
              </div>
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
