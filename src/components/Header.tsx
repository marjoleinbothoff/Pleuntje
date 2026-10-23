"use client";

import { useState } from "react";
import TaalKiezer from "@/components/TaalKiezer";
import type { Taal } from "@/i18n/talen";

const hrefs = ["#over-ons", "#binnenkijkje", "#voorzieningen", "#omgeving", "#reviews", "#boeken", "#contact"];

const T: Record<Taal, { labels: string[]; menu: string; open: string; dicht: string }> = {
  nl: {
    labels: ["Over ons", "Binnenkijkje", "Voorzieningen", "Omgeving", "Reviews", "Boeken", "Contact"],
    menu: "Hoofdmenu",
    open: "Menu openen",
    dicht: "Menu sluiten",
  },
  de: {
    labels: ["Über uns", "Einblicke", "Ausstattung", "Umgebung", "Bewertungen", "Buchen", "Kontakt"],
    menu: "Hauptmenü",
    open: "Menü öffnen",
    dicht: "Menü schließen",
  },
  en: {
    labels: ["About us", "Inside", "Amenities", "Surroundings", "Reviews", "Book", "Contact"],
    menu: "Main menu",
    open: "Open menu",
    dicht: "Close menu",
  },
  fr: {
    labels: ["À propos", "Intérieur", "Équipements", "Alentours", "Avis", "Réserver", "Contact"],
    menu: "Menu principal",
    open: "Ouvrir le menu",
    dicht: "Fermer le menu",
  },
};

// Dun menu bovenaan de pagina, zonder logo en zonder boekknop (boeken staat onderaan). Ligt doorzichtig over de grote foto
// en scrolt NIET mee (Marjolein wil de ruimte op de telefoon voor de foto's houden).
// Vanaf tablet staan alle woorden naast elkaar over de foto; alleen op de telefoon klapt het menu uit onder een knop.
// Rechtsboven (telefoon: linksboven) staan de taalknopjes NL · DE · EN · FR.
// Op de telefoon iets lager (pt-6): Safari op de iPhone legt bovenin een vervaagd randje over de pagina (23 okt 2026).
export default function Header({ taal }: { taal: Taal }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = T[taal];
  const navLinks = hrefs.map((href, i) => ({ href, label: t.labels[i] }));

  const licht = menuOpen;

  return (
    <header
      className={`absolute inset-x-0 top-0 z-50 transition-colors duration-300 ${
        licht ? "border-b border-forest-200 bg-cream/95 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-6 px-5 pt-6 sm:min-h-20 sm:py-3">
        <TaalKiezer
          taal={taal}
          className={`order-first text-sm tracking-wide sm:order-last sm:shrink-0 [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] ${
            licht ? "text-forest-800" : "text-photo-ink"
          }`}
          linkClassName="opacity-80 hover:opacity-100"
          actiefClassName="font-semibold underline underline-offset-4"
        />
        <nav aria-label={t.menu} className="hidden flex-1 flex-wrap items-center justify-center gap-x-7 gap-y-1 sm:flex lg:justify-between">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`py-2 text-base tracking-wide transition-colors [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] ${
                licht ? "text-forest-800 hover:text-forest-500" : "text-photo-ink/95 hover:text-photo-ink"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={`flex h-11 w-11 items-center justify-center sm:hidden ${
            licht ? "text-forest-900" : "text-photo-ink"
          }`}
          aria-expanded={menuOpen}
          aria-controls="mobiel-menu"
          aria-label={menuOpen ? t.dicht : t.open}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobiel-menu"
          aria-label={t.menu}
          className="border-t border-forest-200 bg-cream px-5 pb-6 sm:hidden"
        >
          <ul>
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-forest-100">
                <a
                  href={link.href}
                  className="block py-3.5 text-lg text-forest-900"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
