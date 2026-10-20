import { Fraunces, DM_Sans } from "next/font/google";

// Lettertypes van het stempel-logo (alleen hier gebruikt)
const fraunces = Fraunces({ subsets: ["latin"], weight: "600" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: "600" });

// Het ronde stempel-logo van Pleuntje (zomerversie, oktober 2026):
// het echte chalet met berken, struiken met hortensia's en de zon.
// Hetzelfde logo staat als los bestand in public/photos/logo-pleuntje.svg.
export default function LogoStempel({ className }: { className?: string }) {
  return (
    <svg
      viewBox="4 4 232 232"
      className={className}
      role="img"
      aria-label="Pleuntje – boshuis op de Veluwe"
    >
      <defs>
        <path id="pl-stempel-top" d="M40 120 A80 80 0 0 1 200 120" />
        <path id="pl-stempel-bot" d="M28 120 A92 92 0 0 0 212 120" />
        <clipPath id="pl-stempel-clip">
          <circle cx="120" cy="120" r="72" />
        </clipPath>
        <path
          id="pl-stempel-kruin"
          d="M0 -18 C5 -19 8 -15 9 -12 C14 -13 17 -8 15 -4 C19 -1 18 5 14 7 C16 12 11 16 6 14 C4 18 -3 18 -5 14 C-10 17 -15 12 -13 8 C-18 6 -18 -1 -14 -3 C-16 -9 -11 -13 -7 -12 C-6 -16 -3 -19 0 -18 Z"
        />
      </defs>
      <circle cx="120" cy="120" r="116" fill="#1F3A33" />
      <circle cx="120" cy="120" r="106" fill="none" stroke="#F3ECDD" strokeWidth="1.5" />
      <g clipPath="url(#pl-stempel-clip)">
        <rect x="40" y="40" width="160" height="160" fill="#A9D3EE" />
        <circle cx="150" cy="60" r="8" fill="#F6C94E" />
        {/* Berken achter het huis */}
        <path d="M102 120 V94 M138 120 V100" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <rect x="101" y="113" width="2.2" height="1.6" fill="#263038" />
        <use href="#pl-stempel-kruin" transform="translate(102 92) scale(1.1 1.15)" fill="#4E7F5A" />
        <use href="#pl-stempel-kruin" transform="translate(99 88) scale(0.55 0.6)" fill="#6E9E5C" />
        <use href="#pl-stempel-kruin" transform="translate(138 98) scale(0.95 1.0)" fill="#5C8E62" />
        <use href="#pl-stempel-kruin" transform="translate(135 94) scale(0.5 0.55)" fill="#7BA866" />
        {/* Het chalet */}
        <rect x="140" y="108" width="3" height="13" fill="#5A6468" />
        <path d="M74 123 L104 117 L166 123 V154 H74 Z" fill="#D49A3A" />
        <path d="M72 123.5 L104 116.5 L168 123.5" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinejoin="round" />
        <line x1="74" y1="127" x2="166" y2="127" stroke="#A9711C" strokeWidth="2.5" strokeDasharray="2 1.5" />
        <rect x="80" y="131" width="16" height="23" fill="#263038" />
        <rect x="81.5" y="132.5" width="5.5" height="20" fill="#5D7480" />
        <rect x="89" y="132.5" width="5.5" height="20" fill="#5D7480" />
        <rect x="102" y="131" width="15" height="11" fill="#263038" />
        <rect x="103.5" y="132.5" width="5" height="8" fill="#5D7480" />
        <rect x="110.5" y="132.5" width="5" height="8" fill="#5D7480" />
        <rect x="123" y="131" width="15" height="11" fill="#263038" />
        <rect x="124.5" y="132.5" width="5" height="8" fill="#5D7480" />
        <rect x="131.5" y="132.5" width="5" height="8" fill="#5D7480" />
        <rect x="144" y="131" width="9" height="23" fill="#263038" />
        <rect x="145.5" y="133" width="6" height="8" fill="#5D7480" />
        <rect x="157" y="131" width="6" height="6" fill="#263038" />
        {/* Gras, berk links en struiken met hortensia's */}
        <rect x="40" y="154" width="160" height="40" fill="#7FA65A" />
        <path d="M64 156 V112 M64 130 L58 124" stroke="#FFFFFF" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <rect x="63" y="138" width="2.4" height="1.8" fill="#263038" />
        <rect x="63" y="146" width="2.4" height="1.8" fill="#263038" />
        <use href="#pl-stempel-kruin" transform="translate(62 108) scale(0.9 1.15)" fill="#4E7F5A" />
        <use href="#pl-stempel-kruin" transform="translate(59 104) scale(0.45 0.55)" fill="#6E9E5C" />
        <use href="#pl-stempel-kruin" transform="translate(178 141) scale(0.75 0.72)" fill="#3F6F4C" />
        <use href="#pl-stempel-kruin" transform="translate(176 138) scale(0.4 0.38)" fill="#5C8E62" />
        <circle cx="181" cy="137" r="2.4" fill="#E28AA6" />
        <circle cx="174" cy="145" r="2.4" fill="#E28AA6" />
        <circle cx="184" cy="147" r="2.4" fill="#E28AA6" />
        <circle cx="72" cy="153" r="8" fill="#4E7F5A" />
        <circle cx="168" cy="153" r="8" fill="#4E7F5A" />
        <circle cx="111" cy="155" r="6" fill="#4E7F5A" />
        <circle cx="69" cy="150" r="2.4" fill="#E28AA6" />
        <circle cx="75" cy="155" r="2.4" fill="#E28AA6" />
        <circle cx="171" cy="149" r="2.4" fill="#E28AA6" />
        <circle cx="165" cy="154" r="2.4" fill="#E28AA6" />
      </g>
      <circle cx="120" cy="120" r="72" fill="none" stroke="#F3ECDD" strokeWidth="2" />
      <text fontFamily={fraunces.style.fontFamily} fontWeight="600" fontSize="26" letterSpacing="7" fill="#F3ECDD">
        <textPath href="#pl-stempel-top" startOffset="50%" textAnchor="middle">
          PLEUNTJE
        </textPath>
      </text>
      <text fontFamily={dmSans.style.fontFamily} fontWeight="600" fontSize="12.5" letterSpacing="4" fill="#F6C94E">
        <textPath href="#pl-stempel-bot" startOffset="50%" textAnchor="middle">
          BOSHUIS · VELUWE
        </textPath>
      </text>
      <circle cx="31" cy="120" r="3" fill="#F6C94E" />
      <circle cx="209" cy="120" r="3" fill="#F6C94E" />
    </svg>
  );
}
