"use client";

import { useState } from "react";

const navLinks = [
  { href: "#over-ons", label: "Over ons" },
  { href: "#omgeving", label: "Omgeving" },
  { href: "#boeken", label: "Boeken" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-forest-200/60 bg-cream/90 px-5 py-3 shadow-sm shadow-forest-900/5 backdrop-blur">
        <a href="#top" className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sunset-300 to-sunset-500 text-lg shadow-inner"
          >
            🌲
          </span>
          <span
            className="glossy-text text-2xl"
            data-text="Pleun"
          >
            Pleun
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-forest-700 transition hover:bg-forest-100 hover:text-forest-900"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#boeken"
            className="ml-2 rounded-full bg-sunset-500 px-5 py-2 text-sm font-bold text-white shadow-md shadow-sunset-500/30 transition hover:bg-sunset-600"
          >
            Check beschikbaarheid
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-100 text-forest-700 md:hidden"
          aria-label="Menu openen"
          aria-expanded={open}
        >
          <span className="text-xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-3xl border border-forest-200/60 bg-cream/95 p-4 shadow-md md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-base font-semibold text-forest-700 hover:bg-forest-100"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#boeken"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-2xl bg-sunset-500 px-4 py-3 text-center text-base font-bold text-white"
          >
            Check beschikbaarheid
          </a>
        </div>
      )}
    </header>
  );
}
