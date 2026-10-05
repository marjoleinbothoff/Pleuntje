const navLinks = [
  { href: "#over-ons", label: "Over ons" },
  { href: "#binnenkijkje", label: "Binnenkijkje" },
  { href: "#omgeving", label: "Omgeving" },
  { href: "#boeken", label: "Boeken" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-center rounded-3xl border border-forest-700/60 bg-forest-600/95 px-4 py-3 shadow-sm shadow-forest-900/20 backdrop-blur">
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
          <a
            href="#boeken"
            className="shrink-0 rounded-full bg-sunset-500 px-3 py-1.5 text-xs font-bold whitespace-nowrap text-white shadow-md shadow-sunset-500/30 transition hover:bg-sunset-600 sm:px-5 sm:py-2 sm:text-sm"
          >
            Check beschikbaarheid
          </a>
        </nav>
      </div>
    </header>
  );
}
