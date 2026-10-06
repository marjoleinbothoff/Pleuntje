// Hoogseizoen (€115 per nacht): schoolvakanties (regio Midden) en de
// Nederlandse feestdagen. Pasen, Hemelvaart en Pinksteren schuiven elk jaar
// mee, die worden hieronder automatisch berekend. De schoolvakanties
// hieronder moeten elk nieuw schooljaar handmatig worden bijgewerkt (geef
// de nieuwe data gewoon door aan Claude).
export const schoolHolidayRanges: { start: string; end: string }[] = [
  { start: "2026-10-17", end: "2026-10-25" }, // Herfstvakantie 2026
  { start: "2026-12-19", end: "2027-01-03" }, // Kerstvakantie 2026/2027
  { start: "2027-02-20", end: "2027-02-28" }, // Voorjaarsvakantie 2027
  { start: "2027-04-24", end: "2027-05-02" }, // Meivakantie 2027
  { start: "2027-07-17", end: "2027-08-29" }, // Zomervakantie 2027
];

function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

// Berekent eerste paasdag voor een gegeven jaar (Meeus/Jones/Butcher).
function easterSunday(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

function dutchHolidaysForYear(year: number): string[] {
  const easter = easterSunday(year);
  const koningsdag = new Date(year, 3, 27); // 27 april
  if (koningsdag.getDay() === 0) koningsdag.setDate(26); // op zondag: 26 april

  return [
    toISODate(new Date(year, 0, 1)), // Nieuwjaarsdag
    toISODate(easter), // Eerste Paasdag
    toISODate(addDays(easter, 1)), // Tweede Paasdag
    toISODate(koningsdag), // Koningsdag
    toISODate(new Date(year, 4, 5)), // Bevrijdingsdag
    toISODate(addDays(easter, 39)), // Hemelvaartsdag
    toISODate(addDays(easter, 49)), // Eerste Pinksterdag
    toISODate(addDays(easter, 50)), // Tweede Pinksterdag
    toISODate(new Date(year, 11, 25)), // Eerste Kerstdag
    toISODate(new Date(year, 11, 26)), // Tweede Kerstdag
  ];
}

export function isHighSeason(iso: string): boolean {
  const year = Number(iso.slice(0, 4));
  if (dutchHolidaysForYear(year).includes(iso)) return true;

  return schoolHolidayRanges.some(
    (range) => iso >= range.start && iso <= range.end,
  );
}
