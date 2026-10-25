"use client";

import { useEffect, useState } from "react";

// Naar beneden trekken om te verversen, alleen als de site als app vanaf het beginscherm is geopend
// (25 okt 2026, wens Marjolein: in die app op haar iPad is er geen adresbalk of ververs-knop).
// In gewone Safari doet de browser dit zelf al, dus daar gebeurt hier niets.
const DREMPEL = 90;
const TEKST: Record<string, [string, string, string]> = {
  nl: ["Trek verder om te verversen", "Laat los om te verversen", "Verversen…"],
  de: ["Weiter ziehen zum Aktualisieren", "Loslassen zum Aktualisieren", "Aktualisieren…"],
  en: ["Pull further to refresh", "Release to refresh", "Refreshing…"],
  fr: ["Tirez encore pour actualiser", "Relâchez pour actualiser", "Actualisation…"],
};

export default function TrekOmTeVerversen() {
  const [afstand, setAfstand] = useState(0);
  const [bezig, setBezig] = useState(false);

  useEffect(() => {
    const alsApp =
      (navigator as Navigator & { standalone?: boolean }).standalone === true ||
      window.matchMedia?.("(display-mode: standalone)").matches;
    if (!alsApp) return;

    let start: number | null = null;
    let huidig = 0;
    const begin = (e: TouchEvent) => {
      // Alleen als je helemaal bovenaan bent en niet in een venster (zoals het boekingsvenster) trekt
      const inVenster = (e.target as Element | null)?.closest?.(".fixed, [role=dialog]");
      start = window.scrollY <= 0 && !inVenster ? e.touches[0].clientY : null;
      huidig = 0;
    };
    const beweeg = (e: TouchEvent) => {
      if (start === null) return;
      huidig = Math.max(0, e.touches[0].clientY - start);
      if (window.scrollY > 0) huidig = 0;
      setAfstand(huidig);
    };
    const einde = () => {
      if (start !== null && huidig >= DREMPEL) {
        setBezig(true);
        window.location.reload();
      } else {
        setAfstand(0);
      }
      start = null;
      huidig = 0;
    };
    window.addEventListener("touchstart", begin, { passive: true });
    window.addEventListener("touchmove", beweeg, { passive: true });
    window.addEventListener("touchend", einde);
    window.addEventListener("touchcancel", einde);
    return () => {
      window.removeEventListener("touchstart", begin);
      window.removeEventListener("touchmove", beweeg);
      window.removeEventListener("touchend", einde);
      window.removeEventListener("touchcancel", einde);
    };
  }, []);

  if (afstand < 20 && !bezig) return null;
  const klaar = bezig || afstand >= DREMPEL;
  const t = TEKST[document.documentElement.lang.slice(0, 2)] ?? TEKST.nl;
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-3 z-[200] flex justify-center"
      style={{ transform: `translateY(${Math.min(afstand, DREMPEL) / 3}px)` }}
    >
      <div className="flex items-center gap-2 rounded-full bg-forest-700 px-4 py-2 text-sm font-semibold text-cream shadow-lg">
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${bezig ? "animate-spin" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          style={bezig ? undefined : { transform: `rotate(${Math.min(afstand, DREMPEL) * 3}deg)` }}
          aria-hidden="true"
        >
          <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4" />
        </svg>
        {bezig ? t[2] : klaar ? t[1] : t[0]}
      </div>
    </div>
  );
}
