import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from "@/data/contact";

const links = [
  { href: "/#over-ons", label: "Over ons" },
  { href: "/#binnenkijkje", label: "Binnenkijkje" },
  { href: "/#voorzieningen", label: "Voorzieningen" },
  { href: "/#omgeving", label: "Omgeving" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#boeken", label: "Boeken en prijzen" },
];

export default function Footer() {
  return (
    <footer id="contact" className="scroll-offset bg-forest-900 px-5 pt-20 pb-10 text-cream">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-wordmark text-5xl font-medium">Pleuntje</p>
          <p className="mt-3 max-w-xs text-base leading-relaxed text-cream/75">
            Boshuis op de Veluwe, vlakbij Voorthuizen en Putten.
          </p>
        </div>

        <div>
          <p className="text-base font-medium text-cream">Contact</p>
          <ul className="mt-4 space-y-2 text-base text-cream/75">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="break-all hover:text-cream">
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a href={`tel:${CONTACT_PHONE_HREF}`} className="hover:text-cream">
                {CONTACT_PHONE_DISPLAY}
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Snel naar">
          <p className="text-base font-medium text-cream">Snel naar</p>
          <ul className="mt-4 space-y-2 text-base text-cream/75">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-cream">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-16 flex max-w-6xl flex-col gap-3 border-t border-cream/15 pt-6 text-sm text-cream/55 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Pleuntje, vakantiehuis op de Veluwe</p>
        <p className="flex gap-5">
          <a href="/privacyverklaring/" className="hover:text-cream">
            Privacyverklaring
          </a>
          <a href="/algemene-voorwaarden/" className="hover:text-cream">
            Algemene voorwaarden
          </a>
        </p>
      </div>
    </footer>
  );
}
