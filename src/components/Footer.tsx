import Image from "next/image";
import { CONTACT_EMAIL } from "@/data/contact";

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

export default function Footer() {
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
              Veluwe, Nederland
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
            Snel naar
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-orange-100/90">
            <li>
              <a href="#over-ons" className="hover:text-sunset-200">
                Over ons
              </a>
            </li>
            <li>
              <a href="#binnenkijkje" className="hover:text-sunset-200">
                Binnenkijkje
              </a>
            </li>
            <li>
              <a href="#voorzieningen" className="hover:text-sunset-200">
                Voorzieningen
              </a>
            </li>
            <li>
              <a href="#omgeving" className="hover:text-sunset-200">
                Omgeving
              </a>
            </li>
            <li>
              <a href="#boeken" className="hover:text-sunset-200">
                Boeken en tarieven
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative mx-auto mt-10 flex max-w-6xl flex-col items-center gap-2 border-t border-orange-100/15 pt-8 text-center text-xs text-orange-100/60">
        {/* Het ronde Pleuntje-logo onderaan */}
        <Image
          src="/photos/logo.png"
          alt="Pleuntje"
          width={96}
          height={96}
          className="mb-3 h-24 w-24 rounded-full shadow-md shadow-forest-900/20"
        />
        <p>© {new Date().getFullYear()} Pleuntje — vakantiehuisje op de Veluwe.</p>
        <p className="flex gap-3">
          <a href="/privacyverklaring/" className="hover:text-sunset-200">
            Privacyverklaring
          </a>
          <span>·</span>
          <a href="/algemene-voorwaarden/" className="hover:text-sunset-200">
            Algemene voorwaarden
          </a>
        </p>
      </div>
    </footer>
  );
}
