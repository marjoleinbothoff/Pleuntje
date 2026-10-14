import { isHighSeason } from "@/data/highSeason";

// Standaardprijzen. Marjolein past de prijzen zelf aan op /beheer; de site haalt de
// actuele prijzen op bij de server (beschikbaarheid.php). Deze waarden gelden alleen als
// zij nog niets heeft ingesteld, en worden ook in /api-data/tarieven.json gezet.
export const LOW_SEASON_RATE = 105;
export const HIGH_SEASON_RATE = 115;
export const CLEANING_FEE = 50;
export const TOURIST_TAX_PER_PERSON_PER_NIGHT = 1.79;

export const DOG_FEE = 18;

export type Prijzen = {
  laagseizoen: number;
  hoogseizoen: number;
  schoonmaak: number;
  hond: number;
  toeristenbelasting: number;
};

export const STANDAARD_PRIJZEN: Prijzen = {
  laagseizoen: LOW_SEASON_RATE,
  hoogseizoen: HIGH_SEASON_RATE,
  schoonmaak: CLEANING_FEE,
  hond: DOG_FEE,
  toeristenbelasting: TOURIST_TAX_PER_PERSON_PER_NIGHT,
};

export function calculateTotal(
  checkIn: string,
  checkOut: string,
  dogs: number = 0,
  guests: number = 1,
  prijzen: Prijzen = STANDAARD_PRIJZEN,
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
    lowNights * prijzen.laagseizoen + highNights * prijzen.hoogseizoen;
  const dogFee = dogs > 0 ? prijzen.hond : 0;
  const touristTax =
    Math.round(nights * guests * prijzen.toeristenbelasting * 100) / 100;
  const total =
    Math.round((accommodationTotal + prijzen.schoonmaak + dogFee + touristTax) * 100) / 100;

  return {
    nights,
    lowNights,
    highNights,
    lowRate: prijzen.laagseizoen,
    highRate: prijzen.hoogseizoen,
    accommodationTotal,
    cleaningFee: prijzen.schoonmaak,
    dogs,
    dogFee,
    guests,
    touristTaxRate: prijzen.toeristenbelasting,
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

// Bedrag zonder ",00" als het een heel getal is: 105 → "105", 105.5 → "105,50"
export function euroKort(amount: number) {
  return Number.isInteger(amount) ? String(amount) : formatEuro(amount);
}
