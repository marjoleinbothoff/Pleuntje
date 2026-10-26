// Korte kennismaking direct onder de grote foto: de welkomsttekst links,
// rechts de vier dingen die gasten het meest waarderen (vervangt de getekende tegeltjes).
import type { Taal } from "@/i18n/talen";

const T: Record<Taal, { kop: string; alinea1: string }> = {
  nl: {
    kop: "Even helemaal tot rust komen",
    alinea1: "Een knus chalet, helemaal omringd door bomen. Hier vertraag je vanzelf: een kop koffie op het terras, de vogels om je heen of gewoon even helemaal niets.",
  },
  de: {
    kop: "Einfach mal richtig zur Ruhe kommen",
    alinea1: "Ein gemütliches Chalet, ganz von Bäumen umgeben. Hier wirst du ganz von selbst langsamer: eine Tasse Kaffee auf der Terrasse, die Vögel um dich herum oder einfach mal gar nichts.",
  },
  en: {
    kop: "Time to truly unwind",
    alinea1: "A cosy chalet, completely surrounded by trees. Here you slow down without even trying: a cup of coffee on the terrace, the birds all around you, or simply doing nothing at all.",
  },
  fr: {
    kop: "Se ressourcer en toute tranquillité",
    alinea1: "Un chalet douillet, entièrement entouré d'arbres. Ici, on ralentit tout naturellement : un café sur la terrasse, les oiseaux tout autour, ou tout simplement ne rien faire.",
  },
};

// "Waarom boeken bij Pleuntje?" (25 okt 2026, wens Marjolein): vakje onder de welkomsttekst en de vier punten.
const WAAROM: Record<Taal, { kop: string; punten: [string, string][] }> = {
  nl: {
    kop: "Waarom boeken bij Pleuntje?",
    punten: [
      ["Bos op loopafstand", "In vijf minuten sta je in het bos."],
      ["Sauna om de hoek", "Direct naast het park."],
      ["Weg van de drukte", "Je eigen plekje, verscholen tussen de bomen."],
      ["Omheinde tuin", "Je hond loopt veilig los."],
      ["Verse eieren", "Bij de boer om de hoek."],
      ["Gratis wifi", "Bereikbaar als je wilt."],
      ["Plek voor drie", "Twee slaapkamers met boxsprings."],
      ["Beddengoed en handdoeken aanwezig", "Ook shampoo en douchegel."],
      ["Direct boeken", "Zonder tussenpersoon, dus voordeliger."],
    ],
  },
  de: {
    kop: "Warum bei Pleuntje buchen?",
    punten: [
      ["Wald zu Fuß erreichbar", "In fünf Minuten bist du im Wald."],
      ["Sauna um die Ecke", "Direkt neben dem Park."],
      ["Weg vom Trubel", "Dein eigenes Plätzchen, versteckt zwischen den Bäumen."],
      ["Eingezäunter Garten", "Dein Hund läuft sicher frei."],
      ["Frische Eier", "Beim Bauern um die Ecke."],
      ["Kostenloses WLAN", "Erreichbar, wenn du willst."],
      ["Platz für drei", "Zwei Schlafzimmer mit Boxspringbetten."],
      ["Bettwäsche und Handtücher vorhanden", "Auch Shampoo und Duschgel."],
      ["Direkt buchen", "Ohne Vermittler, also günstiger."],
    ],
  },
  en: {
    kop: "Why book Pleuntje?",
    punten: [
      ["Woods on your doorstep", "Five minutes' walk to the forest."],
      ["Sauna around the corner", "Right next to the park."],
      ["Away from it all", "Your own little spot, tucked away among the trees."],
      ["Fenced garden", "Your dog can roam free safely."],
      ["Fresh eggs", "From the farmer around the corner."],
      ["Free Wi-Fi", "Connected if you want to be."],
      ["Room for three", "Two bedrooms with box-spring beds."],
      ["Bed linen and towels provided", "Shampoo and shower gel too."],
      ["Book direct", "No middleman, so better value."],
    ],
  },
  fr: {
    kop: "Pourquoi réserver chez Pleuntje ?",
    punten: [
      ["La forêt à deux pas", "Cinq minutes à pied."],
      ["Un sauna tout près", "Juste à côté du parc."],
      ["Loin de l'agitation", "Votre petit coin à vous, niché entre les arbres."],
      ["Jardin clôturé", "Votre chien se promène en sécurité."],
      ["Œufs frais", "Chez le fermier voisin."],
      ["Wi-Fi gratuit", "Joignable si vous le souhaitez."],
      ["De la place pour trois", "Deux chambres avec lits boxspring."],
      ["Linge de lit et serviettes fournis", "Shampooing et gel douche aussi."],
      ["Réservation directe", "Sans intermédiaire, donc plus avantageux."],
    ],
  },
};

// Dunne lijn voor het vinkje.
const lijn = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export default function Highlights({ taal }: { taal: Taal }) {
  const t = T[taal];
  const w = WAAROM[taal];
  return (
    <section className="bg-zand px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <div>
          <h2 className="text-4xl leading-tight text-roest-donker sm:text-5xl">
            {t.kop}
          </h2>
          <div className="mx-auto mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-forest-800">
            <p>{t.alinea1}</p>
          </div>
        </div>

      </div>

      {/* Waarom boeken bij Pleuntje? */}
      <div className="relative mx-auto mt-16 max-w-6xl overflow-hidden rounded-[2rem] px-6 py-10 shadow-[0_22px_45px_-20px_rgba(107,58,31,0.7)] sm:px-10 sm:py-12" style={{ background: "linear-gradient(135deg, #a8572f 0%, var(--roest) 45%, var(--terra-midden) 100%)" }}>
        <h2 className="text-center text-3xl leading-tight text-white sm:text-4xl">{w.kop}</h2>
        <ul className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {w.punten.map(([titel, tekst]) => (
            <li key={titel} className="flex gap-3">
              <span aria-hidden="true" className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-perzik text-roest-donker">
                <svg viewBox="0 0 24 24" className="h-4 w-4" {...lijn} strokeWidth={2.4}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </span>
              <div>
                <p className="font-wordmark text-xl font-semibold text-white">{titel}</p>
                <p className="mt-0.5 text-base leading-relaxed text-white">{tekst}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
