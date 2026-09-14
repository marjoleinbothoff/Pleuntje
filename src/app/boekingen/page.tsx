import type { Metadata } from "next";
import { bookings } from "@/data/availability";

export const metadata: Metadata = {
  title: "Boekingen – Pleun",
  robots: { index: false, follow: false },
};

const monthLabels = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

function formatRange(checkIn: string, checkOut: string) {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const sameMonth =
    inDate.getMonth() === outDate.getMonth() &&
    inDate.getFullYear() === outDate.getFullYear();

  const outLabel = `${outDate.getDate()} ${monthLabels[outDate.getMonth()]} ${outDate.getFullYear()}`;
  const inLabel = sameMonth
    ? `${inDate.getDate()}`
    : `${inDate.getDate()} ${monthLabels[inDate.getMonth()]} ${inDate.getFullYear()}`;

  return `${inLabel} t/m ${outLabel}`;
}

function nightCount(checkIn: string, checkOut: string) {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export default function BoekingenPage() {
  const sorted = [...bookings].sort((a, b) => (a.checkIn < b.checkIn ? -1 : 1));

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-16">
      <span className="inline-flex items-center gap-2 rounded-full bg-sunset-100 px-4 py-1.5 text-sm font-bold text-sunset-700">
        Niet openbaar — alleen voor jou
      </span>
      <h1 className="mt-4 text-4xl font-bold text-forest-900">Boekingen</h1>
      <p className="mt-2 text-forest-700">
        Dit lijstje staat nergens in het menu van de site. Alleen jij komt
        hier, via dit linkje.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {sorted.length === 0 && (
          <p className="rounded-2xl bg-forest-50 p-5 text-forest-600">
            Nog geen boekingen.
          </p>
        )}
        {sorted.map((b) => (
          <div
            key={`${b.guest}-${b.checkIn}`}
            className="flex items-center justify-between rounded-2xl border border-forest-100 bg-white p-5 shadow-sm shadow-forest-900/5"
          >
            <div>
              <p className="text-lg font-bold text-forest-900">{b.guest}</p>
              <p className="text-forest-600">{formatRange(b.checkIn, b.checkOut)}</p>
            </div>
            <span className="rounded-full bg-forest-100 px-3 py-1 text-sm font-bold text-forest-700">
              {nightCount(b.checkIn, b.checkOut)} nachten
            </span>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-forest-500">
        Wil je een boeking toevoegen, aanpassen of verwijderen? Zeg het
        gewoon tegen Claude.
      </p>
    </main>
  );
}
