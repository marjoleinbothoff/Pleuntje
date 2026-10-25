"use client";

import { useEffect } from "react";

// Telt bezoekers voor het ochtendoverzicht van Marjolein (zie public/api/lib/teller.php).
// Geen cookies, geen namen: alleen een seintje "er is een pagina bekeken".
const EIGENAAR = "pleuntje-eigenaar";

function magTellen() {
  try {
    if (location.pathname.startsWith("/beheer")) {
      // Wie op /beheer komt is Marjolein zelf: haar bezoeken tellen voortaan niet mee
      localStorage.setItem(EIGENAAR, "1");
      return false;
    }
    return localStorage.getItem(EIGENAAR) !== "1";
  } catch {
    return true;
  }
}

export function tel(soort: "pagina" | "boekvenster") {
  if (typeof window === "undefined" || !magTellen()) return;
  try {
    const gegevens = JSON.stringify({
      s: soort,
      p: location.pathname,
      r: document.referrer,
      t: document.documentElement.lang || "nl",
    });
    const blob = new Blob([gegevens], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/teller.php", blob)) {
      fetch("/api/teller.php", { method: "POST", body: gegevens, keepalive: true }).catch(() => {});
    }
  } catch {
    // Tellen mag nooit iets op de site laten mislukken
  }
}

export default function Teller() {
  useEffect(() => {
    tel("pagina");
  }, []);
  return null;
}
