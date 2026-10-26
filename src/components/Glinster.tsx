// Klein gouden fonkelend sterretje als versiering (26 okt 2026, proefje op verzoek van Marjolein).
// Weghalen: dit bestand + de <Glinster>-regels in Hero, Highlights en AboutSection + .glinster in globals.css.
export default function Glinster({
  className = "",
  grootte = 22,
  vertraging = 0,
}: {
  className?: string;
  grootte?: number;
  vertraging?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={grootte}
      height={grootte}
      className={`glinster pointer-events-none absolute ${className}`}
      style={{ animationDelay: `${vertraging}s` }}
    >
      <defs>
        <linearGradient id="glinster-goud" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff6d6" />
          <stop offset="45%" stopColor="#f2cf6b" />
          <stop offset="100%" stopColor="#c8962e" />
        </linearGradient>
      </defs>
      <path d="M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z" fill="url(#glinster-goud)" />
    </svg>
  );
}
