"use client";

import { useEffect, useState } from "react";

const navLinks = [
  { href: "#over-ons", label: "Over ons" },
  { href: "#binnenkijkje", label: "Binnenkijkje" },
  { href: "#voorzieningen", label: "Voorzieningen" },
  { href: "#omgeving", label: "Omgeving" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

// Dun menu bovenaan de pagina, zonder logo en zonder boekknop (boeken staat onderaan). Ligt eerst doorzichtig over de grote foto en
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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-end px-5 sm:h-20">

        <nav aria-label="Hoofdmenu" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[15px] transition-colors ${
                licht ? "text-forest-800 hover:text-forest-500" : "text-photo-ink/95 hover:text-photo-ink"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={`flex h-11 w-11 items-center justify-center lg:hidden ${
            licht ? "text-forest-900" : "text-photo-ink"
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
        </nav>
      )}
    </header>
  );
}
