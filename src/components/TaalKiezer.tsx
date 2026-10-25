"use client";

import { TAAL_KORT, TAAL_NAAM, TAAL_OPSLAG, TALEN, pad, type Taal } from "@/i18n/talen";

// Kleine ronde vlaggetjes naast de lettercodes (25 okt 2026, wens Marjolein). Zelf getekend, zodat ze
// op elk apparaat hetzelfde zijn (Windows toont vlag-emoji niet).
function Vlag({ taal }: { taal: Taal }) {
  const banen = (kleuren: string[], richting: "h" | "v") =>
    kleuren.map((k, i) =>
      richting === "h" ? (
        <rect key={i} x="0" y={(i * 24) / kleuren.length} width="24" height={24 / kleuren.length + 0.2} fill={k} />
      ) : (
        <rect key={i} x={(i * 24) / kleuren.length} y="0" width={24 / kleuren.length + 0.2} height="24" fill={k} />
      ),
    );
  let inhoud;
  if (taal === "nl") inhoud = banen(["#AE1C28", "#FFFFFF", "#21468B"], "h");
  else if (taal === "de") inhoud = banen(["#000000", "#DD0000", "#FFCE00"], "h");
  else if (taal === "fr") inhoud = banen(["#002395", "#FFFFFF", "#ED2939"], "v");
  else
    inhoud = (
      <>
        <rect width="24" height="24" fill="#012169" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#FFFFFF" strokeWidth="5" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" strokeWidth="1.8" />
        <path d="M12 0V24M0 12H24" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="4" />
      </>
    );
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 rounded-full ring-1 ring-black/15">
      <clipPath id={`vlag-${taal}`}>
        <circle cx="12" cy="12" r="12" />
      </clipPath>
      <g clipPath={`url(#vlag-${taal})`}>{inhoud}</g>
    </svg>
  );
}

// Taalknopjes (NL · DE · EN · FR). Gaat naar dezelfde pagina in de andere taal
// en onthoudt de keuze, zodat de site daarna niet meer zelf van taal wisselt.
export default function TaalKiezer({
  taal,
  pagina = "",
  className = "",
  linkClassName = "",
  actiefClassName = "",
}: {
  taal: Taal;
  pagina?: string;
  className?: string;
  linkClassName?: string;
  actiefClassName?: string;
}) {
  return (
    <nav aria-label="Language / Taal" className={`flex items-center gap-1 ${className}`}>
      {TALEN.map((t, i) => (
        <span key={t} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden className="opacity-50">
              ·
            </span>
          )}
          <a
            href={pad(t, pagina)}
            hrefLang={t}
            lang={t}
            title={TAAL_NAAM[t]}
            aria-label={TAAL_NAAM[t]}
            aria-current={t === taal ? "true" : undefined}
            onClick={() => {
              try {
                localStorage.setItem(TAAL_OPSLAG, t);
              } catch {
                // geen opslag mogelijk (bijv. privévenster): geen probleem
              }
            }}
            className={`inline-flex items-center gap-1.5 px-1 py-2 ${t === taal ? actiefClassName : linkClassName}`}
          >
            <Vlag taal={t} />
            {TAAL_KORT[t]}
          </a>
        </span>
      ))}
    </nav>
  );
}
