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

        <ul className="grid gap-x-10 sm:grid-cols-2">
          {t.punten.map((p) => (
            <li key={p.titel} className="border-t border-roest/30 py-5">
              <p className="font-wordmark text-2xl font-semibold text-roest-donker">{p.titel}</p>
              <p className="mt-1 text-base text-forest-800">{p.tekst}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
