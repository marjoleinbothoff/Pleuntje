import { isHighSeason } from "@/data/highSeason";

const LOW_SEASON_RATE = 105;
const HIGH_SEASON_RATE = 115;
const CLEANING_FEE = 50;
const TOURIST_TAX_PER_PERSON_PER_NIGHT = 1.79;

const DOG_FEE = 18;

function dogFeeFor(dogs: number) {
  return dogs > 0 ? DOG_FEE : 0;
}

export function calculateTotal(
  checkIn: string,
  checkOut: string,
  dogs: number = 0,
  guests: number = 1,
) {
  if (!checkIn || !checkOut || checkOut <= checkIn) return null;

  const cursor = new Date(checkIn);
  const end = new Date(checkOut);
  let nights = 0;
  let lowNights = 0;
  let highNights = 0;

  while (cursor < end) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    const iso = `${y}-${m}-${d}`;
    if (isHighSeason(iso)) highNights += 1;
    else lowNights += 1;
    nights += 1;
    cursor.setDate(cursor.getDate() + 1);
  }

  const accommodationTotal =
    lowNights * LOW_SEASON_RATE + highNights * HIGH_SEASON_RATE;
  const dogFee = dogFeeFor(dogs);
  const touristTax =
    Math.round(nights * guests * TOURIST_TAX_PER_PERSON_PER_NIGHT * 100) /
    100;
  const total = accommodationTotal + CLEANING_FEE + dogFee + touristTax;

  return {
    nights,
    lowNights,
    highNights,
    lowRate: LOW_SEASON_RATE,
    highRate: HIGH_SEASON_RATE,
    accommodationTotal,
    cleaningFee: CLEANING_FEE,
    dogs,
    dogFee,
    guests,
    touristTaxRate: TOURIST_TAX_PER_PERSON_PER_NIGHT,
    touristTax,
    total,
  };
}

export function formatEuro(amount: number) {
  return amount.toLocaleString("nl-NL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
