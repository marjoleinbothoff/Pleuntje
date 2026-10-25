"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Taal } from "@/i18n/talen";

// Huisregels in een venster (25 okt 2026, wens Marjolein: "die wil ik meer in het zicht").
// Knop bij Voorzieningen, "Huisregels" in het menu en een linkje in het boekingsvenster openen allemaal
// dit venster (via #huisregels). De volledige uitleg voor gasten staat op /informatie/.
const T: Record<Taal, { kop: string; knop: string; sluiten: string; slot: string; regels: [string, string][] }> = {
  nl: {
    kop: "Huisregels",
    knop: "Bekijk de huisregels",
    sluiten: "Sluiten",
    slot: "Zo blijft Pleuntje voor iedereen een fijne, rustige plek. Dank je wel!",
    regels: [
      ["Maximaal 3 personen", "Er mogen niet meer mensen verblijven dan bij de boeking opgegeven."],
      ["Inchecken en uitchecken", "Inchecken tussen 15:00 en 20:00 uur, uitchecken vóór 11:00 uur."],
      ["Niet roken of vapen binnen", "Buiten mag het; er is een asbak voor buiten."],
      ["Geen kaarsen", "Ook geen waxinelichtjes: een houten chalet is extra brandgevaarlijk."],
      ["Rust", "Geen muziek die buiten te horen is, ook overdag niet. Nachtrust van 22:00 tot 8:00 uur en zondagsrust."],
      ["Alleen recreatief verblijf", "Geen feesten of evenementen, en niet als verblijf voor werk of wonen."],
      ["Honden welkom", "Maximaal 3 honden. Op een kleedje op de bank mag, in bed niet."],
    ],
  },
  de: {
    kop: "Hausregeln",
    knop: "Hausregeln ansehen",
    sluiten: "Schließen",
    slot: "So bleibt Pleuntje für alle ein schöner, ruhiger Ort. Vielen Dank!",
    regels: [
      ["Höchstens 3 Personen", "Es dürfen nicht mehr Personen übernachten als bei der Buchung angegeben."],
      ["Check-in und Check-out", "Check-in zwischen 15:00 und 20:00 Uhr, Check-out vor 11:00 Uhr."],
      ["Drinnen nicht rauchen oder dampfen", "Draußen ist es erlaubt; ein Aschenbecher für draußen ist vorhanden."],
      ["Keine Kerzen", "Auch keine Teelichter: Ein Holzchalet ist besonders brandgefährlich."],
      ["Ruhe", "Keine Musik, die draußen zu hören ist, auch tagsüber nicht. Nachtruhe von 22:00 bis 8:00 Uhr und Sonntagsruhe."],
      ["Nur Erholungsaufenthalt", "Keine Feiern oder Veranstaltungen, und nicht als Unterkunft zum Arbeiten oder Wohnen."],
      ["Hunde willkommen", "Höchstens 3 Hunde. Auf einer Decke auf dem Sofa ja, im Bett nicht."],
    ],
  },
  en: {
    kop: "House rules",
    knop: "View the house rules",
    sluiten: "Close",
    slot: "This keeps Pleuntje a lovely, quiet place for everyone. Thank you!",
    regels: [
      ["Maximum 3 people", "No more people may stay than stated in the booking."],
      ["Check-in and check-out", "Check-in between 15:00 and 20:00, check-out before 11:00."],
      ["No smoking or vaping indoors", "Outside is fine; there is an ashtray for outdoor use."],
      ["No candles", "No tea lights either: a wooden chalet is an extra fire risk."],
      ["Peace and quiet", "No music that can be heard outside, also not during the day. Quiet hours from 22:00 to 8:00 and on Sundays."],
      ["Holiday stays only", "No parties or events, and not as accommodation for work or living."],
      ["Dogs welcome", "Maximum 3 dogs. On a blanket on the sofa is fine, not in bed."],
    ],
  },
  fr: {
    kop: "Règlement intérieur",
    knop: "Voir le règlement intérieur",
    sluiten: "Fermer",
    slot: "Ainsi, Pleuntje reste un endroit agréable et calme pour tous. Merci !",
    regels: [
      ["3 personnes maximum", "Le nombre de personnes ne peut pas dépasser celui indiqué lors de la réservation."],
      ["Arrivée et départ", "Arrivée entre 15h00 et 20h00, départ avant 11h00."],
      ["Ne pas fumer ni vapoter à l'intérieur", "C'est permis dehors ; un cendrier pour l'extérieur est disponible."],
      ["Pas de bougies", "Pas de bougies chauffe-plat non plus : un chalet en bois présente un risque d'incendie accru."],
      ["Calme", "Pas de musique audible à l'extérieur, même en journée. Repos nocturne de 22h00 à 8h00 et repos dominical."],
      ["Séjours de loisirs uniquement", "Pas de fêtes ni d'événements, et pas d'hébergement pour le travail ou pour y habiter."],
      ["Chiens bienvenus", "3 chiens maximum. Sur une couverture sur le canapé, oui ; dans le lit, non."],
    ],
  },
};

export default function Huisregels({ taal, metKnop = true, licht = false }: { taal: Taal; metKnop?: boolean; licht?: boolean }) {
  const t = T[taal];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function wisHash() {
      if (window.location.hash === "#huisregels") {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
    function kijkHash() {
      if (window.location.hash === "#huisregels") {
        setOpen(true);
        wisHash();
      }
    }
    function klik(event: MouseEvent) {
      const link = (event.target as HTMLElement)?.closest('a[href="#huisregels"]');
      if (link) {
        event.preventDefault();
        setOpen(true);
      }
    }
    kijkHash();
    window.addEventListener("hashchange", kijkHash);
    document.addEventListener("click", klik);
    return () => {
      window.removeEventListener("hashchange", kijkHash);
      document.removeEventListener("click", klik);
    };
  }, []);

  return (
    <>
      {metKnop && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`mt-5 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-5 py-2 text-sm font-bold transition ${licht ? "border-cream text-cream hover:bg-cream hover:text-forest-900" : "border-roest text-roest-donker hover:bg-roest hover:text-white"}`}
        >
          {t.knop}
        </button>
      )}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={t.kop}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.sluiten}
              className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
            >
              ✕
            </button>
            <div
              className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[2.5rem] bg-cream p-6 shadow-lg sm:p-10"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-forest-900">{t.kop}</h3>
              <ul className="mt-6 space-y-4">
                {t.regels.map(([titel, tekst]) => (
                  <li key={titel} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-roest text-white"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-bold text-forest-900">{titel}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-forest-800">{tekst}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-forest-800">{t.slot}</p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
