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
            Een knus vakantiehuisje voor 3 personen, verstopt tussen het
            groen. Het bos ligt op loopafstand en de sauna vind je vlak om de
            hoek, naast het park. Even helemaal tot rust komen.
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
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="blob absolute inset-0 bg-gradient-to-br from-forest-200 to-forest-300/70" />
          <svg
            viewBox="0 0 400 400"
            className="relative h-full w-full"
            role="img"
            aria-label="Illustratie van huisje Pleun tussen de bomen"
          >
            <circle cx="90" cy="90" r="34" fill="var(--orange-300)" opacity="0.9" />
            <path
              d="M60 340 L60 220 L200 120 L340 220 L340 340 Z"
              fill="var(--orange-100)"
            />
            <path d="M40 230 L200 110 L360 230 L330 250 L200 155 L70 250 Z" fill="var(--orange-500)" />
            <rect x="150" y="250" width="100" height="90" rx="18" fill="var(--orange-300)" />
            <rect x="178" y="270" width="44" height="70" rx="10" fill="var(--green-700)" />
            <circle cx="205" cy="305" r="4" fill="var(--orange-500)" />
            <rect x="90" y="255" width="45" height="45" rx="10" fill="#fff" opacity="0.85" />
            <rect x="265" y="255" width="45" height="45" rx="10" fill="#fff" opacity="0.85" />
            <rect x="182" y="160" width="36" height="50" rx="8" fill="var(--green-700)" />
            <g>
              <ellipse cx="70" cy="330" rx="46" ry="34" fill="var(--green-400)" />
              <ellipse cx="330" cy="330" rx="50" ry="36" fill="var(--green-500)" />
              <ellipse cx="200" cy="360" rx="60" ry="24" fill="var(--green-300)" />
            </g>
            <g opacity="0.9">
              <circle cx="330" cy="150" r="26" fill="var(--green-500)" />
              <rect x="322" y="150" width="16" height="34" rx="6" fill="var(--green-800)" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
