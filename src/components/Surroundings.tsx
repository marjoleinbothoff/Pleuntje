import Image from "next/image";

export default function Surroundings() {
  return (
    <section
      id="omgeving"
      className="scroll-offset relative overflow-hidden bg-forest-50 px-4 py-20"
    >
      <div
        aria-hidden
        className="blob absolute -top-16 right-0 h-64 w-64 bg-sunset-100/70"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-10 text-center lg:grid-cols-[1.1fr_0.9fr] lg:text-left">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-forest-700">
              Omgeving
            </span>
            <h2 className="mt-4 text-4xl font-bold text-forest-900">
              Alles binnen handbereik
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-forest-700 lg:mx-0">
              Pleun ligt op een fijne plek: de natuur van de Veluwe voor je
              deur, en ontspanning net om de hoek.
            </p>
          </div>
          <div className="photo-frame blob-3 rect-box mx-auto max-w-[520px]">
            <Image
              src="/photos/terras-tafel.jpg"
              alt="De tuintafel buiten bij Pleun, tussen de hortensia's"
              fill
              sizes="(min-width: 1024px) 520px, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
