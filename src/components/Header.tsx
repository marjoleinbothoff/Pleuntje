const navLinks = [
  { href: "#over-ons", label: "Over ons" },
  { href: "#binnenkijkje", label: "Binnenkijkje" },
  { href: "#voorzieningen", label: "Voorzieningen" },
  { href: "#omgeving", label: "Omgeving" },
  { href: "#boeken", label: "Boeken" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 rounded-3xl border border-forest-700/60 bg-forest-600/95 px-4 py-5 shadow-sm shadow-forest-900/20 backdrop-blur">
        <nav className="flex w-full flex-wrap items-center justify-center gap-1 sm:justify-between">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap text-cream transition hover:bg-forest-700 sm:px-4 sm:text-base"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#boeken"
          className="shrink-0 rounded-full bg-sunset-500 px-5 py-2 text-sm font-bold whitespace-nowrap text-forest-900 shadow-md shadow-sunset-500/30 transition hover:bg-sunset-600"
        >
          Check beschikbaarheid
        </a>
      </div>
    </header>
  );
}
