"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { EIGENAAR } from "@/components/Teller";

// Geheim gebaar (21 nov 2026, wens Marjolein): houd het logo onderaan 3 seconden ingedrukt,
// dan telt dit apparaat (deze app of deze browser) niet meer mee in de bezoekersteller.
// Nodig omdat elke app op het beginscherm van de iPhone/iPad een eigen geheugen heeft:
// /beheer openen in de Beheer-app helpt niet voor de Pleuntje-app of Safari.
// Gasten merken er niets van.
const DUUR = 3000;

export default function GeheimGebaar({ children }: { children: ReactNode }) {
  const klok = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [melding, setMelding] = useState<string | null>(null);

  const stop = () => {
    if (klok.current) clearTimeout(klok.current);
    klok.current = null;
  };

  const start = () => {
    stop();
    klok.current = setTimeout(() => {
      klok.current = null;
      let al = false;
      try {
        al = localStorage.getItem(EIGENAAR) === "1";
        localStorage.setItem(EIGENAAR, "1");
      } catch {
        setMelding("Dat lukte niet in deze browser.");
        return;
      }
      setMelding(al ? "Dit apparaat telde al niet mee." : "Dit apparaat telt niet meer mee.");
    }, DUUR);
  };

  useEffect(() => {
    if (!melding) return;
    const t = setTimeout(() => setMelding(null), 4000);
    return () => clearTimeout(t);
  }, [melding]);

  useEffect(() => stop, []);

  return (
    <>
      <div
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onContextMenu={(e) => e.preventDefault()}
        style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none", touchAction: "manipulation" }}
      >
        {children}
      </div>
      {melding && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-6 z-50 mx-auto max-w-sm rounded-full bg-green-600 px-5 py-3 text-center text-base font-semibold text-white shadow-lg"
        >
          {melding}
        </div>
      )}
    </>
  );
}
