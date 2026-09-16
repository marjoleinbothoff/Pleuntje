import Image from "next/image";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-10 pb-20 sm:pt-16">
      <div
        aria-hidden
        className="blob absolute -top-24 -left-24 h-72 w-72 bg-forest-200/60 sm:h-96 sm:w-96"
      />
      <div
        aria-hidden
        className="blob-alt absolute -right-16 top-10 h-56 w-56 bg-sunset-200/70 sm:h-80 sm:w-80"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700">
            🌳 Midden op de Veluwe
          </span>

          <h1 className="mt-5 text-5xl leading-tight font-bold text-forest-900 sm:text-6xl">
            Welkom bij{" "}
            <span className="glossy-text" data-text="Pleun">
              Pleun
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-lg text-forest-700 lg:mx-0">
            Een knusse stacaravan met houtlook voor 3 personen, helemaal
            omringd door bomen en met een eigen omheinde tuin. Het bos ligt
            op loopafstand en de sauna vind je vlak om de hoek, naast het
            park. Even helemaal tot rust komen.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <a
              href="#boeken"
              className="w-full rounded-full bg-sunset-500 px-7 py-3.5 text-center text-base font-bold text-white shadow-lg shadow-sunset-500/30 transition hover:-translate-y-0.5 hover:bg-sunset-600 sm:w-auto"
            >
              Bekijk beschikbaarheid
            </a>
            <a
              href="#over-ons"
              className="w-full rounded-full border-2 border-forest-300 px-7 py-3.5 text-center text-base font-bold text-forest-700 transition hover:-translate-y-0.5 hover:bg-forest-100 sm:w-auto"
            >
              Maak kennis met Pleun
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm font-semibold text-forest-600 lg:justify-start">
            <span className="flex items-center gap-1.5">🛏️ Max. 3 gasten</span>
            <span className="flex items-center gap-1.5">🥾 Bos op loopafstand</span>
            <span className="flex items-center gap-1.5">🧖 Sauna om de hoek</span>
            <span className="flex items-center gap-1.5">🌳 Omheinde tuin</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="blob-alt absolute -right-6 -bottom-6 -z-10 h-40 w-40 bg-sunset-200/70" />
          <div className="photo-frame blob relative aspect-square w-full">
            <Image
              src="/photos/terras-tafel.jpg"
              alt="Het terras van Pleun met een tafel en stoelen tussen de hortensia's"
              fill
              sizes="(min-width: 1024px) 420px, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
