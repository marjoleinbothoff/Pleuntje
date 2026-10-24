// Korte kennismaking direct onder de grote foto: de welkomsttekst links,
// rechts de vier dingen die gasten het meest waarderen (vervangt de getekende tegeltjes).
import type { Taal } from "@/i18n/talen";

const T: Record<Taal, { kop: string; alinea1: string; alinea2: string; punten: { titel: string; tekst: string }[] }> = {
  nl: {
    kop: "Even helemaal tot rust komen",
    alinea1: "Een knus chalet voor drie personen, helemaal omringd door bomen en met een eigen omheinde tuin voor je hond.",
    alinea2: "Het bos ligt op loopafstand en de sauna vind je vlak om de hoek, naast het park.",
    punten: [
      { titel: "Bos op loopafstand", tekst: "In vijf minuten loop je het bos in." },
      { titel: "Sauna om de hoek", tekst: "Naast het park, heerlijk om te ontspannen." },
      { titel: "Plek voor drie", tekst: "Twee slaapkamers met boxsprings." },
      { titel: "Omheinde tuin", tekst: "Je hond loopt veilig vrij rond." },
    ],
  },
  de: {
    kop: "Einfach mal richtig zur Ruhe kommen",
    alinea1: "Ein gemütliches Chalet für drei Personen, ganz von Bäumen umgeben und mit einem eigenen eingezäunten Garten für deinen Hund.",
    alinea2: "Der Wald ist zu Fuß erreichbar und die Sauna liegt gleich um die Ecke, direkt neben dem Park.",
    punten: [
      { titel: "Wald zu Fuß erreichbar", tekst: "In fünf Minuten bist du mitten im Wald." },
      { titel: "Sauna um die Ecke", tekst: "Direkt neben dem Park, herrlich zum Entspannen." },
      { titel: "Platz für drei", tekst: "Zwei Schlafzimmer mit Boxspringbetten." },
      { titel: "Eingezäunter Garten", tekst: "Dein Hund läuft sicher frei herum." },
    ],
  },
  en: {
    kop: "Time to truly unwind",
    alinea1: "A cosy chalet for three people, surrounded by trees and with its own fenced garden for your dog.",
    alinea2: "The woods are within walking distance and the sauna is just around the corner, right next to the park.",
    punten: [
      { titel: "Woods on your doorstep", tekst: "A five-minute walk and you're in the forest." },
      { titel: "Sauna around the corner", tekst: "Right next to the park, perfect for relaxing." },
      { titel: "Room for three", tekst: "Two bedrooms with box-spring beds." },
      { titel: "Fenced garden", tekst: "Your dog can roam free safely." },
    ],
  },
  fr: {
    kop: "Se ressourcer en toute tranquillité",
    alinea1: "Un chalet douillet pour trois personnes, entouré d'arbres, avec son propre jardin clôturé pour votre chien.",
    alinea2: "La forêt est à deux pas et le sauna se trouve juste à côté du parc.",
    punten: [
      { titel: "La forêt à deux pas", tekst: "En cinq minutes à pied, vous êtes en forêt." },
      { titel: "Un sauna tout près", tekst: "Juste à côté du parc, idéal pour se détendre." },
      { titel: "De la place pour trois", tekst: "Deux chambres avec lits boxspring." },
      { titel: "Jardin clôturé", tekst: "Votre chien peut se promener librement en toute sécurité." },
    ],
  },
};

// Dunne lijn-icoontjes, in dezelfde volgorde als de punten: bos, sauna, bed, hondenpootje.
const lijn = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const ICOONTJES = [
  <svg key="bos" viewBox="0 0 24 24" className="h-6 w-6" {...lijn}><path d="M8 3 4 10h2.5L3.5 15H12L9 10h2.5Z" /><path d="M8 15v4" /><path d="M16 7l-3.5 6h2l-3 4.5h9l-3-4.5h2Z" /><path d="M16 17.5V21" /></svg>,
  <svg key="sauna" viewBox="0 0 24 24" className="h-6 w-6" {...lijn}><path d="M8 3c-1 1.5 1 2.5 0 4M12 3c-1 1.5 1 2.5 0 4M16 3c-1 1.5 1 2.5 0 4" /><path d="M4 11h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /><path d="M4 15h16" /></svg>,
  <svg key="bed" viewBox="0 0 24 24" className="h-6 w-6" {...lijn}><path d="M3 18V7M21 18v-5a3 3 0 0 0-3-3h-7v6" /><path d="M3 15h18" /><circle cx="7" cy="11.5" r="1.8" /></svg>,
  <svg key="poot" viewBox="0 0 24 24" className="h-6 w-6" {...lijn}><ellipse cx="12" cy="16" rx="4" ry="3.3" /><circle cx="6" cy="10.5" r="1.7" /><circle cx="9.5" cy="6.5" r="1.7" /><circle cx="14.5" cy="6.5" r="1.7" /><circle cx="18" cy="10.5" r="1.7" /></svg>,
];

export default function Highlights({ taal }: { taal: Taal }) {
  const t = T[taal];
  return (
    <section className="bg-zand px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <div>
          <h2 className="text-4xl leading-tight text-roest-donker sm:text-5xl">
            {t.kop}
          </h2>
          <div className="mt-6 max-w-lg space-y-4 text-lg leading-relaxed text-forest-800">
            <p>{t.alinea1}</p>
            <p>{t.alinea2}</p>
          </div>
        </div>

        {/* Gekleurd vlak achter de vier punten (25 okt 2026, wens Marjolein: "een gekleurd stuk, verzin maar wat leuks"):
            donker mosgroen met crème letters, elk punt met een eigen lijn-icoontje in een perzik rondje,
            en een vaag dennenboompje als versiering in de hoek. */}
        <div className="relative overflow-hidden rounded-[2rem] bg-forest-700 px-6 py-4 shadow-[0_18px_40px_-20px_rgba(44,48,27,0.6)] sm:px-9 sm:py-6">
          <svg aria-hidden="true" viewBox="0 0 100 120" className="pointer-events-none absolute -bottom-6 -right-6 h-48 w-40 text-forest-600" fill="currentColor">
            <path d="M50 0 22 42h14L14 74h18L6 110h88L68 74h18L64 42h14Z" />
            <rect x="44" y="108" width="12" height="12" />
          </svg>
          <ul className="relative grid gap-x-8 sm:grid-cols-2">
            {t.punten.map((p, i) => (
              <li key={p.titel} className={`flex gap-4 py-5 ${i > 0 ? "border-t border-cream/20" : ""} ${i === 1 ? "sm:border-t-0" : ""}`}>
                <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-perzik text-roest-donker">
                  {ICOONTJES[i]}
                </span>
                <div>
                  <p className="font-wordmark text-2xl font-semibold text-photo-ink">{p.titel}</p>
                  <p className="mt-1 text-base text-cream/85">{p.tekst}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
