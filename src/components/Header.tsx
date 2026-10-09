import Image from "next/image";

const navLinks = [
  { href: "#over-ons", label: "Over ons" },
  { href: "#binnenkijkje", label: "Binnenkijkje" },
  { href: "#voorzieningen", label: "Voorzieningen" },
  { href: "#huisregels", label: "Huisregels" },
  { href: "#omgeving", label: "Omgeving" },
  { href: "#boeken", label: "Boeken" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-3 rounded-3xl border border-forest-700/60 bg-forest-600/95 px-4 py-5 shadow-sm shadow-forest-900/20 backdrop-blur">
        <Image
          src="/photos/logo.png"
          alt="Pleuntje"
          width={40}
          height={40}
          className="absolute top-1/2 left-4 hidden h-10 w-10 -translate-y-1/2 rounded-full sm:block"
        />
        <nav className="flex w-full flex-wrap items-center justify-center gap-1 sm:justify-between sm:pl-14">
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
          className="shrink-0 rounded-full bg-sunset-100 px-5 py-2 text-sm font-bold whitespace-nowrap text-forest-900 shadow-md shadow-sunset-900/10 transition hover:bg-sunset-200"
        >
          Check beschikbaarheid
        </a>
      </div>
    </header>
  );
}
