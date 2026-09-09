import Image from "next/image";

const photos = [
  {
    src: "/photos/keuken.jpg",
    alt: "Complete keuken van Pleun met kookplaat, oven en koffiezetapparaat",
    label: "Keuken",
    shape: "blob",
  },
  {
    src: "/photos/badkamer.jpg",
    alt: "Badkamer van Pleun met inloopdouche en wastafel",
    label: "Badkamer",
    shape: "blob-alt",
  },
  {
    src: "/photos/hal.jpg",
    alt: "Knusse hal van Pleun met opbergkast en groene planten",
    label: "Hal",
    shape: "blob-3",
  },
] as const;

export default function InteriorGallery() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sunset-100 px-4 py-1.5 text-sm font-bold text-sunset-700">
            Binnenkijkje
          </span>
          <h2 className="mt-4 text-4xl font-bold text-forest-900">
            Ook vanbinnen knus en compleet
          </h2>
          <p className="mt-3 text-lg text-forest-700">
            Een volledig ingerichte keuken, een frisse badkamer en een
            knusse hal om je jas en wandelschoenen op te hangen.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {photos.map((photo) => (
            <div key={photo.label} className="text-center">
              <div className={`photo-frame ${photo.shape} relative mx-auto aspect-square w-full max-w-xs`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 80vw"
                  className="object-cover"
                />
              </div>
              <span className="mt-4 inline-block rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700">
                {photo.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
