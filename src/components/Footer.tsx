import LogoStempel from "@/components/LogoStempel";
import TaalKiezer from "@/components/TaalKiezer";
import { CONTACT_EMAIL } from "@/data/contact";
import { pad, type Taal } from "@/i18n/talen";

const T: Record<
  Taal,
  {
    plaats: string;
    snel: string;
    links: [string, string][];
    taal: string;
    slot: string;
    privacy: string;
    voorwaarden: string;
  }
> = {
  nl: {
    plaats: "Veluwe, Nederland",
    snel: "Snel naar",
    links: [
      ["over-ons", "Over ons"],
      ["binnenkijkje", "Binnenkijkje"],
      ["voorzieningen", "Voorzieningen"],
      ["omgeving", "Omgeving"],
      ["boeken", "Boeken en tarieven"],
    ],
    taal: "Taal",
    slot: "vakantiehuisje op de Veluwe.",
    privacy: "Privacyverklaring",
    voorwaarden: "Algemene voorwaarden",
  },
  de: {
    plaats: "Veluwe, Niederlande",
    snel: "Direkt zu",
    links: [
      ["over-ons", "Über uns"],
      ["binnenkijkje", "Einblicke"],
      ["voorzieningen", "Ausstattung"],
      ["omgeving", "Umgebung"],
      ["boeken", "Buchen und Preise"],
    ],
    taal: "Sprache",
    slot: "Ferienhaus in der Veluwe.",
    privacy: "Datenschutzerklärung",
    voorwaarden: "Allgemeine Geschäftsbedingungen",
  },
  en: {
    plaats: "Veluwe, the Netherlands",
    snel: "Quick links",
    links: [
      ["over-ons", "About us"],
      ["binnenkijkje", "Inside"],
      ["voorzieningen", "Amenities"],
      ["omgeving", "Surroundings"],
      ["boeken", "Booking and rates"],
    ],
    taal: "Language",
    slot: "holiday cottage on the Veluwe.",
    privacy: "Privacy statement",
    voorwaarden: "Terms and conditions",
  },
  fr: {
    plaats: "Veluwe, Pays-Bas",
    snel: "Accès rapide",
    links: [
      ["over-ons", "À propos"],
      ["binnenkijkje", "Intérieur"],
      ["voorzieningen", "Équipements"],
      ["omgeving", "Alentours"],
      ["boeken", "Réservation et tarifs"],
    ],
    taal: "Langue",
    slot: "chalet de vacances en Veluwe.",
    privacy: "Déclaration de confidentialité",
    voorwaarden: "Conditions générales",
  },
};

// Dunne lijn-icoontjes in een rondje (in plaats van emoji)
const icoonRond =
  "flex h-9 w-9 flex-none items-center justify-center rounded-full border border-orange-100/50 text-orange-100";
const lijn = {
  width: 17,
  height: 17,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// pagina = welke pagina dit is (voor de taalknopjes): "" voor de voorkant, of bijv. "privacyverklaring/".
// Op een andere pagina dan de voorkant gaan de "Snel naar"-links naar de voorkant.
// toonTaal = false op pagina's die alleen in het Nederlands bestaan (routepagina's).
export default function Footer({
  taal,
  pagina = "",
  toonTaal = true,
}: {
  taal: Taal;
  pagina?: string;
  toonTaal?: boolean;
}) {
  const t = T[taal];
  const voorkant = pagina === "" ? "" : pad(taal);
  return (
    <footer
      id="contact"
      className="scroll-offset relative overflow-hidden rounded-t-[2.5rem] bg-forest-600 px-4 py-14 text-orange-100"
    >
      <div className="relative mx-auto grid max-w-6xl gap-10 sm:grid-cols-2">
        <div>
          <h4 className="text-sm font-bold tracking-wide text-sunset-300 uppercase">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-orange-100/90">
            <li className="flex items-center gap-3">
              <span className={icoonRond} aria-hidden>
                {/* Kaartspeld met een dennenboompje erin: de Veluwe */}
                <svg {...lijn}>
                  <path d="M12 21.5s-6.5-5.7-6.5-11.2a6.5 6.5 0 0 1 13 0c0 5.5-6.5 11.2-6.5 11.2z" />
                  <path d="M12 6.4l-2.4 3.4h1.3l-1.8 2.6h5.8l-1.8-2.6h1.3z" />
                  <path d="M12 12.4v1.6" />
                </svg>
              </span>
              {t.plaats}
            </li>
            <li className="flex items-center gap-3">
              <span className={icoonRond} aria-hidden>
                <svg {...lijn}>
                  <rect x="3.5" y="6" width="17" height="12" rx="1.5" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
              </span>
              <a href={`mailto:${CONTACT_EMAIL}`} className="break-all hover:text-sunset-200">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold tracking-wide text-sunset-300 uppercase">
            {t.snel}
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-orange-100/90">
            {t.links.map(([anker, label]) => (
              <li key={anker}>
                <a href={`${voorkant}#${anker}`} className="hover:text-sunset-200">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          {toonTaal && (
            <>
              <h4 className="mt-8 text-sm font-bold tracking-wide text-sunset-300 uppercase">
                {t.taal}
              </h4>
              <TaalKiezer
                taal={taal}
                pagina={pagina}
                className="mt-1 text-sm text-orange-100/90"
                linkClassName="hover:text-sunset-200"
                actiefClassName="font-bold text-sunset-200"
              />
            </>
          )}
        </div>
      </div>

      <div className="relative mx-auto mt-10 flex max-w-6xl flex-col items-center gap-2 border-t border-orange-100/15 pt-8 text-center text-xs text-orange-100/60">
        {/* Het ronde stempel-logo van Pleuntje onderaan */}
        <LogoStempel className="mb-3 h-36 w-36 drop-shadow-md" />
        <p>© {new Date().getFullYear()} Pleuntje — {t.slot}</p>
        <p className="flex gap-3">
          <a href={pad(taal, "privacyverklaring/")} className="hover:text-sunset-200">
            {t.privacy}
          </a>
          <span>·</span>
          <a href={pad(taal, "algemene-voorwaarden/")} className="hover:text-sunset-200">
            {t.voorwaarden}
          </a>
        </p>
      </div>
    </footer>
  );
}
