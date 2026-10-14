import { useEffect, useState } from "react";

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

export type AvailabilityState = {
  nights: Set<string>;
  status: "loading" | "ok" | "error";
};

export function useAvailability(active = true): AvailabilityState {
  const [state, setState] = useState<AvailabilityState>({
    nights: new Set(),
    status: "loading",
  });

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    fetch("/api/beschikbaarheid.php", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Laden mislukt");
        return response.json();
      })
      .then((data: { nachten?: string[] }) => {
        if (cancelled) return;
        if (!Array.isArray(data.nachten)) throw new Error("Onverwacht antwoord");
        setState({ nights: new Set(data.nachten), status: "ok" });
      })
      .catch(() => {
        if (!cancelled) setState((s) => ({ ...s, status: "error" }));
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

  return state;
}
