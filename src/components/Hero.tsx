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

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="blob absolute inset-0 bg-gradient-to-br from-forest-200 to-forest-300/70" />
          <svg
            viewBox="0 0 400 400"
            className="relative h-full w-full"
            role="img"
            aria-label="Illustratie van stacaravan Pleun met houtlook, omringd door bomen en een omheinde tuin"
          >
            <circle cx="90" cy="70" r="30" fill="var(--orange-300)" opacity="0.9" />

            {/* bomen op de achtergrond */}
            <g opacity="0.9">
              <g transform="translate(60,90) scale(0.5)">
                <ellipse cx="0" cy="10" rx="20" ry="22" fill="var(--green-200)" />
                <ellipse cx="0" cy="-14" rx="14" ry="16" fill="var(--green-100)" />
                <rect x="-5" y="28" width="10" height="16" rx="4" fill="var(--green-700)" />
              </g>
              <g transform="translate(200,48) scale(0.42)">
                <ellipse cx="0" cy="10" rx="20" ry="22" fill="var(--green-200)" />
                <ellipse cx="0" cy="-14" rx="14" ry="16" fill="var(--green-100)" />
                <rect x="-5" y="28" width="10" height="16" rx="4" fill="var(--green-700)" />
              </g>
              <g transform="translate(340,80) scale(0.55)">
                <ellipse cx="0" cy="10" rx="20" ry="22" fill="var(--green-200)" />
                <ellipse cx="0" cy="-14" rx="14" ry="16" fill="var(--green-100)" />
                <rect x="-5" y="28" width="10" height="16" rx="4" fill="var(--green-700)" />
              </g>
            </g>

            {/* grasvelden */}
            <ellipse cx="70" cy="345" rx="50" ry="30" fill="var(--green-300)" />
            <ellipse cx="330" cy="345" rx="55" ry="32" fill="var(--green-400)" />
            <ellipse cx="200" cy="360" rx="90" ry="26" fill="var(--green-300)" opacity="0.8" />

            {/* omheinde tuin */}
            <g fill="var(--orange-700)">
              <rect x="30" y="298" width="76" height="6" rx="3" />
              <rect x="34" y="300" width="8" height="34" rx="4" />
              <rect x="50" y="300" width="8" height="34" rx="4" />
              <rect x="66" y="300" width="8" height="34" rx="4" />
              <rect x="82" y="300" width="8" height="34" rx="4" />
              <rect x="98" y="300" width="8" height="34" rx="4" />
              <rect x="294" y="298" width="76" height="6" rx="3" />
              <rect x="302" y="300" width="8" height="34" rx="4" />
              <rect x="318" y="300" width="8" height="34" rx="4" />
              <rect x="334" y="300" width="8" height="34" rx="4" />
              <rect x="350" y="300" width="8" height="34" rx="4" />
              <rect x="366" y="300" width="8" height="34" rx="4" />
            </g>

            {/* bomen op de middengrond */}
            <g transform="translate(30,190) scale(0.8)">
              <ellipse cx="0" cy="10" rx="20" ry="22" fill="var(--green-300)" />
              <ellipse cx="0" cy="-14" rx="14" ry="16" fill="var(--green-200)" />
              <rect x="-5" y="28" width="10" height="16" rx="4" fill="var(--green-800)" />
            </g>
            <g transform="translate(372,180) scale(0.85)">
              <ellipse cx="0" cy="10" rx="20" ry="22" fill="var(--green-300)" />
              <ellipse cx="0" cy="-14" rx="14" ry="16" fill="var(--green-200)" />
              <rect x="-5" y="28" width="10" height="16" rx="4" fill="var(--green-800)" />
            </g>

            {/* stacaravan met houtlook */}
            <path
              d="M108,322 L108,258 Q108,230 140,222 Q170,212 200,210 Q230,212 260,222 Q292,230 292,258 L292,322 Z"
              fill="var(--orange-300)"
            />
            <path
              d="M108,258 Q108,230 140,222 Q170,212 200,210 Q230,212 260,222 Q292,230 292,258 L292,268 Q260,240 200,238 Q140,240 108,268 Z"
              fill="var(--orange-500)"
            />
            <g stroke="var(--orange-600)" strokeWidth="2" opacity="0.55">
              <line x1="112" y1="278" x2="288" y2="278" />
              <line x1="112" y1="292" x2="288" y2="292" />
              <line x1="112" y1="306" x2="288" y2="306" />
            </g>
            <rect x="128" y="268" width="40" height="32" rx="9" fill="var(--green-800)" />
            <rect x="134" y="274" width="28" height="20" rx="5" fill="#fff7ea" />
            <rect x="232" y="268" width="40" height="32" rx="9" fill="var(--green-800)" />
            <rect x="238" y="274" width="28" height="20" rx="5" fill="#fff7ea" />
            <rect x="180" y="276" width="40" height="46" rx="12" fill="var(--green-700)" />
            <circle cx="200" cy="296" r="8" fill="#fff7ea" opacity="0.9" />
            <circle cx="209" cy="299" r="2.5" fill="var(--orange-500)" />
            <rect x="184" y="322" width="32" height="8" rx="4" fill="var(--orange-700)" />
            <rect x="106" y="316" width="188" height="10" rx="5" fill="var(--orange-700)" />

            {/* bomen op de voorgrond */}
            <g transform="translate(30,300) scale(1.05)">
              <ellipse cx="0" cy="10" rx="20" ry="22" fill="var(--green-500)" />
              <ellipse cx="0" cy="-14" rx="14" ry="16" fill="var(--green-300)" />
              <rect x="-5" y="28" width="10" height="16" rx="4" fill="var(--green-800)" />
            </g>
            <g transform="translate(372,292) scale(1.1)">
              <ellipse cx="0" cy="10" rx="20" ry="22" fill="var(--green-600)" />
              <ellipse cx="0" cy="-14" rx="14" ry="16" fill="var(--green-400)" />
              <rect x="-5" y="28" width="10" height="16" rx="4" fill="var(--green-800)" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
