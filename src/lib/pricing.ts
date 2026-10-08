import { isHighSeason } from "@/data/highSeason";

const LOW_SEASON_RATE = 105;
const HIGH_SEASON_RATE = 115;
const CLEANING_FEE = 50;

export function calculateTotal(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut || checkOut <= checkIn) return null;

  const cursor = new Date(checkIn);
  const end = new Date(checkOut);
  let nights = 0;
  let total = 0;

  while (cursor < end) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    const iso = `${y}-${m}-${d}`;
    total += isHighSeason(iso) ? HIGH_SEASON_RATE : LOW_SEASON_RATE;
    nights += 1;
    cursor.setDate(cursor.getDate() + 1);
  }

  total += CLEANING_FEE;
  return { nights, total };
}
