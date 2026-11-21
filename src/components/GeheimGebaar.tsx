"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { EIGENAAR } from "@/components/Teller";

// Geheim gebaar (21 nov 2026, wens Marjolein): houd het logo onderaan 3 seconden ingedrukt
// (of tik er 5 keer snel achter elkaar op), dan telt dit apparaat (deze app of deze browser)
// niet meer mee in de bezoekersteller.
// Nodig omdat elke app op het beginscherm van de iPhone/iPad een eigen geheugen heeft:
// /beheer openen in de Beheer-app helpt niet voor de Pleuntje-app of Safari.
// Gasten merken er niets van.
// Eerste versie gebruikte pointer-events; op haar iPhone gebeurde er niets (iOS breekt een
// lang ingedrukte vinger af met pointercancel). Nu met touch-events, kleine bewegingen toegestaan.
const DUUR = 3000;
const TIKKEN = 5;

export default function GeheimGebaar({ children }: { children: ReactNode }) {
  const klok = useRef<ReturnType<typeof setTimeout> | null>(null);
  const begin = useRef<{ x: number; y: number } | null>(null);
  const tikken = useRef<number[]>([]);
  const [melding, setMelding] = useState<string | null>(null);

  const markeer = () => {
    let al = false;
    try {
      al = localStorage.getItem(EIGENAAR) === "1";
      localStorage.setItem(EIGENAAR, "1");
    } catch {
      setMelding("Dat lukte niet in deze browser.");
      return;
    }
    try {
      navigator.vibrate?.(60);
    } catch {}
    setMelding(al ? "Dit apparaat telde al niet mee." : "Dit apparaat telt niet meer mee.");
  };

  const stop = () => {
    if (klok.current) clearTimeout(klok.current);
    klok.current = null;
    begin.current = null;
  };

  const start = (x: number, y: number) => {
    stop();
    begin.current = { x, y };
    klok.current = setTimeout(() => {
      klok.current = null;
      begin.current = null;
      tikken.current = [];
      markeer();
    }, DUUR);
  };

  const beweeg = (x: number, y: number) => {
    const b = begin.current;
    if (b && Math.hypot(x - b.x, y - b.y) > 25) stop();
  };

  const tik = () => {
    const nu = Date.now();
    tikken.current = [...tikken.current.filter((t) => nu - t < 2500), nu];
    if (tikken.current.length >= TIKKEN) {
      tikken.current = [];
      markeer();
    }
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
        onTouchStart={(e) => start(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => beweeg(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={stop}
        onMouseDown={(e) => start(e.clientX, e.clientY)}
        onMouseUp={stop}
        onMouseLeave={stop}
        onClick={tik}
        onContextMenu={(e) => e.preventDefault()}
        className="select-none"
        style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none", touchAction: "none", cursor: "default" }}
      >
        <div style={{ pointerEvents: "none" }}>{children}</div>
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
