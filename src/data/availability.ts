// Hier staan de dagen die helemaal bezet zijn, in de vorm "JJJJ-MM-DD".
// Wil je een dag toevoegen of weghalen? Zeg het gewoon tegen Claude,
// dan wordt dit lijstje bijgewerkt.
export const bookedDates: string[] = [
  // Nicola, incheck 17 sep, uitcheck 21 sep 2026
  "2026-09-18",
  "2026-09-19",
  "2026-09-20",
  // Gasten, incheck 9 okt, uitcheck 11 okt 2026
  "2026-10-10",
  // Gasten, incheck 30 okt, uitcheck 1 nov 2026
  "2026-10-31",
  // Gasten, incheck 13 nov, uitcheck 15 nov 2026
  "2026-11-14",
  // Gasten, incheck 26 nov, uitcheck 30 nov 2026
  "2026-11-27",
  "2026-11-28",
  "2026-11-29",
  // Marjolein en Ed zelf, 24 dec 2026 t/m 2 jan 2027
  "2026-12-24",
  "2026-12-25",
  "2026-12-26",
  "2026-12-27",
  "2026-12-28",
  "2026-12-29",
  "2026-12-30",
  "2026-12-31",
  "2027-01-01",
  "2027-01-02",
];

// Vertrekdagen: 's ochtends nog bezet, maar vanaf 11:00 alweer vrij.
// Op deze dagen kan er dus nog wel een nieuwe gast inchecken.
export const checkoutDates: string[] = [
  // Nicola vertrekt om 11:00
  "2026-09-21",
  // Gasten vertrekken 11 okt
  "2026-10-11",
  // Gasten vertrekken 1 nov
  "2026-11-01",
  // Gasten vertrekken 15 nov
  "2026-11-15",
  // Gasten vertrekken 30 nov
  "2026-11-30",
];

// Incheckdagen: 's ochtends nog vrij, maar vanaf die middag bezet
// omdat er dan een nieuwe gast aankomt.
export const checkinDates: string[] = [
  // Nicola komt aan
  "2026-09-17",
  // Gasten komen aan 9 okt
  "2026-10-09",
  // Gasten komen aan 30 okt
  "2026-10-30",
  // Gasten komen aan 13 nov
  "2026-11-13",
  // Gasten komen aan 26 nov
  "2026-11-26",
];
