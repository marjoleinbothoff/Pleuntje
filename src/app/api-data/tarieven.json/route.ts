// Maakt bij elke publicatie het bestand /api-data/tarieven.json.
// De server (public/api) rekent daarmee het bedrag voor de Mollie-betaling uit,
// zodat de site en de betaling altijd dezelfde prijzen gebruiken.
import { isHighSeason } from "@/data/highSeason";
import {
  CLEANING_FEE,
  DOG_FEE,
  HIGH_SEASON_RATE,
  LOW_SEASON_RATE,
  TOURIST_TAX_PER_PERSON_PER_NIGHT,
} from "@/lib/pricing";

export const dynamic = "force-static";

function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function GET() {
  // Alle hoogseizoen-dagen van vorig jaar tot drie jaar vooruit
  const now = new Date();
  const start = new Date(now.getFullYear() - 1, 0, 1);
  const end = new Date(now.getFullYear() + 3, 11, 31);
  const hoogseizoen: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const iso = toISODate(d);
    if (isHighSeason(iso)) hoogseizoen.push(iso);
  }

  return Response.json({
    laagseizoen: LOW_SEASON_RATE,
    hoogseizoen: HIGH_SEASON_RATE,
    schoonmaak: CLEANING_FEE,
    hond: DOG_FEE,
    toeristenbelasting: TOURIST_TAX_PER_PERSON_PER_NIGHT,
    hoogseizoenDagen: hoogseizoen,
    tot: toISODate(end),
  });
}
