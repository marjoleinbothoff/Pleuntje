export type Booking = {
  guest: string;
  checkIn: string; // dag dat de gast aankomt, "JJJJ-MM-DD"
  checkOut: string; // dag dat de gast weer vertrekt, "JJJJ-MM-DD"
};

// Alle boekingen staan hier in één lijstje. Wil je een boeking
// toevoegen of weghalen? Zeg het gewoon tegen Claude, dan wordt dit
// bijgewerkt — de kalender en de boekingenlijst passen zich vanzelf aan.
export const bookings: Booking[] = [
  { guest: "Nicola", checkIn: "2026-09-17", checkOut: "2026-09-21" },
];

function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function nightsBetween(checkIn: string, checkOut: string) {
  const nights: string[] = [];
  const cursor = new Date(checkIn);
  cursor.setDate(cursor.getDate() + 1);
  const end = new Date(checkOut);
  while (cursor < end) {
    nights.push(toISODate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return nights;
}

// Hieronder wordt alles automatisch berekend uit de boekingen hierboven.

// Nachten die helemaal bezet zijn (niet de incheck- of uitcheckdag zelf).
export const bookedDates: string[] = bookings.flatMap((b) =>
  nightsBetween(b.checkIn, b.checkOut),
);

// Vertrekdagen: 's ochtends nog bezet, maar vanaf 11:00 alweer vrij.
export const checkoutDates: string[] = bookings.map((b) => b.checkOut);

// Incheckdagen: 's ochtends nog vrij, maar vanaf die middag bezet.
export const checkinDates: string[] = bookings.map((b) => b.checkIn);
