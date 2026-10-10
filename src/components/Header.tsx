import Image from "next/image";

const navLinks = [
  { href: "#over-ons", label: "Over ons" },
  { href: "#binnenkijkje", label: "Binnenkijkje" },
  { href: "#voorzieningen", label: "Voorzieningen" },
  { href: "#omgeving", label: "Omgeving" },
  { href: "#boeken", label: "Boeken" },
  { href: "#contact", label: "Contact" },
];

// Oranje menubalk met logo. Staat midden op de pagina, onder de foto's en
// boven "Over ons". Op de telefoon staat het logo in het midden boven het menu,
// op grotere schermen staat alles op één rij.
export default function Header() {
  return (
    <header className="relative z-10 px-4 pt-14 pb-4 sm:pt-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 rounded-3xl border border-forest-700/60 bg-forest-600/95 px-4 py-5 shadow-sm shadow-forest-900/20 sm:flex-row sm:gap-6 sm:px-5 sm:py-4">
        <Image
          src="/photos/logo.png"
          alt="Pleuntje"
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 rounded-full sm:h-[84px] sm:w-[84px]"
        />
        <nav className="flex flex-1 flex-wrap items-center justify-center gap-1">
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
        {/* Lege ruimte rechts zodat het menu op grote schermen precies in het midden staat */}
        <span aria-hidden className="hidden w-[84px] shrink-0 lg:block" />
      </div>
    </header>
  );
}
