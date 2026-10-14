"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const navLinks = [
  { href: "#over-ons", label: "Over ons" },
  { href: "#binnenkijkje", label: "Binnenkijkje" },
  { href: "#voorzieningen", label: "Voorzieningen" },
  { href: "#omgeving", label: "Omgeving" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

// Dun menu bovenaan de pagina. Ligt eerst doorzichtig over de grote foto en
// krijgt een lichte achtergrond zodra je naar beneden scrolt.
// Op de telefoon klapt het menu uit onder een knop.
export default function Header() {
  const [gescrold, setGescrold] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function kijk() {
      setGescrold(window.scrollY > 40);
    }
    kijk();
    window.addEventListener("scroll", kijk, { passive: true });
    return () => window.removeEventListener("scroll", kijk);
  }, []);

  const licht = gescrold || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        licht ? "border-b border-forest-200 bg-cream/95 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20">
        <a href="#top" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <Image
            src="/photos/logo.png"
            alt=""
            width={44}
            height={44}
            className="h-10 w-10 rounded-full bg-cream sm:h-11 sm:w-11"
          />
          <span
            className={`font-wordmark text-2xl font-semibold transition-colors ${
              licht ? "text-forest-900" : "text-white"
            }`}
          >
            Pleuntje
          </span>
        </a>

        <nav aria-label="Hoofdmenu" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[15px] transition-colors ${
                licht ? "text-forest-800 hover:text-forest-500" : "text-white/90 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#boeken"
            className={`rounded-sm px-5 py-2.5 text-[15px] font-medium transition-colors ${
              licht
                ? "bg-forest-700 text-cream hover:bg-forest-800"
                : "bg-white text-forest-900 hover:bg-cream"
            }`}
          >
            Boeken
          </a>
        </nav>

        <button
          type="button"
          className={`flex h-11 w-11 items-center justify-center lg:hidden ${
            licht ? "text-forest-900" : "text-white"
          }`}
          aria-expanded={menuOpen}
          aria-controls="mobiel-menu"
          aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
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
          aria-label="Hoofdmenu"
          className="border-t border-forest-200 bg-cream px-5 pb-6 lg:hidden"
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
          <a
            href="#boeken"
            className="mt-5 block rounded-sm bg-forest-700 py-3.5 text-center text-lg font-medium text-cream"
            onClick={() => setMenuOpen(false)}
          >
            Boeken
          </a>
        </nav>
      )}
    </header>
  );
}
