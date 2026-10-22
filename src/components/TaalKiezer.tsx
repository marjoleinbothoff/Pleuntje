"use client";

import { TAAL_KORT, TAAL_NAAM, TAAL_OPSLAG, TALEN, pad, type Taal } from "@/i18n/talen";

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
            className={`px-1 py-2 ${t === taal ? actiefClassName : linkClassName}`}
          >
            {TAAL_KORT[t]}
          </a>
        </span>
      ))}
    </nav>
  );
}
