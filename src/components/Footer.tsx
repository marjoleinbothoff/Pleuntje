import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from "@/data/contact";

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
          <ul className="mt-3 space-y-2 text-sm text-orange-100/90">
            <li>📍 Veluwe, Nederland</li>
            <li>
              ✉️{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-sunset-200">
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              📞{" "}
              <a href={`tel:${CONTACT_PHONE_HREF}`} className="hover:text-sunset-200">
                {CONTACT_PHONE_DISPLAY}
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
              <a href="#omgeving" className="hover:text-sunset-200">
                Omgeving
              </a>
            </li>
            <li>
              <a href="#boeken" className="hover:text-sunset-200">
                Boeken
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-6xl border-t border-orange-100/15 pt-6 text-center text-xs text-orange-100/60">
        © {new Date().getFullYear()} Pleuntje — vakantiehuisje op de Veluwe.
      </div>
    </footer>
  );
}
