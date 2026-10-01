const navLinks = [
  { href: "#over-ons", label: "Over ons" },
  { href: "#omgeving", label: "Omgeving" },
  { href: "#boeken", label: "Boeken" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-6xl items-center gap-3 rounded-full border border-forest-200/60 bg-white/90 px-5 py-3 shadow-sm shadow-forest-900/5 backdrop-blur">
        <a href="#top" className="flex shrink-0 items-center gap-2">
          <span className="glossy-text text-2xl" data-text="Pleun">
            Pleun
          </span>
        </a>

        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap text-forest-700 transition hover:bg-forest-100 hover:text-forest-900"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#boeken"
            className="ml-2 shrink-0 rounded-full bg-sunset-500 px-5 py-2 text-sm font-bold whitespace-nowrap text-white shadow-md shadow-sunset-500/30 transition hover:bg-sunset-600"
          >
            Check beschikbaarheid
          </a>
        </nav>
      </div>
    </header>
  );
}
