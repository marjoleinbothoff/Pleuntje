// Hier staan de dagen die al bezet zijn, in de vorm "JJJJ-MM-DD".
// Wil je een dag toevoegen of weghalen? Zeg het gewoon tegen Claude,
// dan wordt dit lijstje bijgewerkt.
export const bookedDates: string[] = [
  // Nicola, incheck 17 sep, uitcheck 21 sep 2026
  "2026-09-17",
  "2026-09-18",
  "2026-09-19",
  "2026-09-20",
];

// Vertrekdagen: 's ochtends nog bezet, maar vanaf 11:00 alweer vrij.
// Op deze dagen kan er dus nog wel een nieuwe gast inchecken.
export const checkoutDates: string[] = [
  // Nicola vertrekt om 11:00
  "2026-09-21",
];
