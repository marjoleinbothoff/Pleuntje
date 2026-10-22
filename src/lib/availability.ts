import { useEffect, useState } from "react";
import { STANDAARD_PRIJZEN, type Prijzen } from "@/lib/pricing";
import { REGELFOUTEN } from "@/i18n/boeken";
import type { Taal } from "@/i18n/talen";

// De beschikbaarheid komt live van de server bij Vimexx (public/api/beschikbaarheid.php).
// Marjolein beheert de blokkades op boshuispleuntje.nl/beheer; Airbnb-boekingen komen er
// automatisch bij. De server geeft een lijst "nachten": elke datum is de nacht die op die dag begint.

export type DayStatus = "free" | "booked" | "checkin" | "checkout";

export function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  return toISODate(new Date(y, m - 1, d + days));
}

// Een dag is helemaal bezet als de nacht ervóór én de nacht erna bezet zijn.
// Alleen de nacht erna bezet: incheckdag. Alleen de nacht ervoor: vertrekdag.
export function dayStatus(nights: Set<string>, iso: string): DayStatus {
  const nightBefore = nights.has(addDays(iso, -1));
  const nightAfter = nights.has(iso);
  if (nightBefore && nightAfter) return "booked";
  if (nightAfter) return "checkin";
  if (nightBefore) return "checkout";
  return "free";
}

// Zit er tussen aankomst en vertrek een nacht die al bezet is?
export function overlapsNights(
  nights: Set<string>,
  checkIn: string,
  checkOut: string,
) {
  for (let day = checkIn; day < checkOut; day = addDays(day, 1)) {
    if (nights.has(day)) return true;
  }
  return false;
}

// Boekingsregels; Marjolein stelt ze in op /beheer. Dit zijn de standaardwaarden
// (gelijk aan die op de server), voor als de server even niet bereikbaar is.
export type Regels = {
  minNachten: number;
  maxNachten: number;
  dagenVooraf: number;
  maandenVooruit: number;
};

export const STANDAARD_REGELS: Regels = {
  minNachten: 2,
  maxNachten: 21,
  dagenVooraf: 2,
  maandenVooruit: 12,
};

export function addMonths(iso: string, months: number) {
  const [y, m, d] = iso.split("-").map(Number);
  return toISODate(new Date(y, m - 1 + months, d));
}

export function countNights(checkIn: string, checkOut: string) {
  let n = 0;
  for (let day = checkIn; day < checkOut && n < 1000; day = addDays(day, 1)) n++;
  return n;
}

// Vroegste en laatste dag waarop iemand mag aankomen
export function arrivalRange(regels: Regels, today: string) {
  return {
    earliest: addDays(today, regels.dagenVooraf),
    latest: addMonths(today, regels.maandenVooruit),
  };
}

// Mag iemand op deze dag aankomen? (binnen de regels, en die nacht nog vrij)
export function isValidArrival(
  nights: Set<string>,
  regels: Regels,
  today: string,
  iso: string,
) {
  const { earliest, latest } = arrivalRange(regels, today);
  return iso >= earliest && iso <= latest && !nights.has(iso);
}

// Geeft een uitleg terug als een periode niet aan de regels voldoet, anders null
export function ruleProblem(
  regels: Regels,
  today: string,
  checkIn: string,
  checkOut: string,
  taal: Taal = "nl",
) {
  const f = REGELFOUTEN[taal];
  const { earliest, latest } = arrivalRange(regels, today);
  const n = countNights(checkIn, checkOut);
  if (checkIn < earliest) {
    return regels.dagenVooraf === 0
      ? f.voorbij
      : f.vooraf(regels.dagenVooraf);
  }
  if (checkIn > latest) {
    return f.vooruit(regels.maandenVooruit);
  }
  if (n < regels.minNachten) {
    return f.min(regels.minNachten);
  }
  if (n > regels.maxNachten) {
    return f.max(regels.maxNachten);
  }
  return null;
}

export type AvailabilityState = {
  nights: Set<string>;
  regels: Regels;
  prijzen: Prijzen;
  today: string;
  status: "loading" | "ok" | "error";
};

export function useAvailability(active = true): AvailabilityState {
  const [state, setState] = useState<AvailabilityState>(() => ({
    nights: new Set(),
    regels: STANDAARD_REGELS,
    prijzen: STANDAARD_PRIJZEN,
    today: toISODate(new Date()),
    status: "loading",
  }));

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    fetch("/api/beschikbaarheid.php", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Laden mislukt");
        return response.json();
      })
      .then(
        (data: {
          nachten?: string[];
          regels?: Partial<Regels>;
          prijzen?: Partial<Prijzen>;
          vandaag?: string;
        }) => {
          if (cancelled) return;
          if (!Array.isArray(data.nachten)) throw new Error("Onverwacht antwoord");
          setState({
            nights: new Set(data.nachten),
            regels: { ...STANDAARD_REGELS, ...(data.regels ?? {}) },
            prijzen: { ...STANDAARD_PRIJZEN, ...(data.prijzen ?? {}) },
            today:
              typeof data.vandaag === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data.vandaag)
                ? data.vandaag
                : toISODate(new Date()),
            status: "ok",
          });
        },
      )
      .catch(() => {
        if (!cancelled) setState((s) => ({ ...s, status: "error" }));
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

  return state;
}
