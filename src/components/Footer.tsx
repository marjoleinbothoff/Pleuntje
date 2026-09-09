export default function Footer() {
  return (
    <footer
      id="contact"
      className="scroll-offset relative overflow-hidden bg-forest-800 px-4 py-14 text-forest-50"
    >
      <div className="relative mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
        <div>
          <span
            className="glossy-text text-3xl"
            data-text="Pleun"
          >
            Pleun
          </span>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-forest-100/80">
            Een gezellig vakantiehuisje op de Veluwe voor 3 personen. Bos op
            loopafstand, sauna om de hoek.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold tracking-wide text-sunset-300 uppercase">
            Contact
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-forest-100/90">
            <li>📍 Veluwe, Nederland</li>
            <li>✉️ hallo@pleun-veluwe.nl</li>
            <li>📞 06 12 34 56 78</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold tracking-wide text-sunset-300 uppercase">
            Snel naar
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-forest-100/90">
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

      <div className="relative mx-auto mt-10 max-w-6xl border-t border-forest-100/15 pt-6 text-center text-xs text-forest-100/60">
        © {new Date().getFullYear()} Pleun — vakantiehuisje op de Veluwe.
      </div>
    </footer>
  );
}
