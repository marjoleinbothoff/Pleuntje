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
      ["Bos op loopafstand", "In vijf minuten loop je het bos in."],
      ["Sauna om de hoek", "Naast het park, heerlijk om te ontspannen."],
      ["Werkelijke stilte", "Een rustige plek tussen de bomen. Je hoort werkelijk niets."],
      ["Omheinde tuin", "Je hond loopt veilig vrij rond."],
      ["Verse eieren", "Bij de boer in de buurt koop je verse eieren."],
      ["Gratis wifi", "Gewoon bereikbaar, als je dat wilt."],
      ["Plek voor drie", "Twee slaapkamers met boxsprings, netjes voor je opgemaakt."],
      ["Beddengoed en handdoeken aanwezig", "Bedden opgemaakt, handdoeken voor de douche én de keuken."],
      ["Niets meenemen", "Alles is aanwezig, je hoeft werkelijk niets mee te nemen."],
      ["Douchespullen", "Shampoo en douchegel liggen voor je klaar."],
      ["Direct geboekt", "Zonder tussenpersoon, je boeking is meteen rond."],
    ],
  },
  de: {
    kop: "Warum bei Pleuntje buchen?",
    punten: [
      ["Wald zu Fuß erreichbar", "In fünf Minuten bist du mitten im Wald."],
      ["Sauna um die Ecke", "Direkt neben dem Park, herrlich zum Entspannen."],
      ["Echte Stille", "Ein ruhiger Ort zwischen den Bäumen. Du hörst wirklich nichts."],
      ["Eingezäunter Garten", "Dein Hund läuft sicher frei herum."],
      ["Frische Eier", "Beim Bauern in der Nähe kaufst du frische Eier."],
      ["Kostenloses WLAN", "Erreichbar, wenn du es möchtest."],
      ["Platz für drei", "Zwei Schlafzimmer mit Boxspringbetten, ordentlich für dich bezogen."],
      ["Bettwäsche und Handtücher vorhanden", "Betten bezogen, Handtücher für Dusche und Küche."],
      ["Nichts mitbringen", "Alles ist da, du musst wirklich nichts mitnehmen."],
      ["Duschsachen", "Shampoo und Duschgel liegen für dich bereit."],
      ["Direkt gebucht", "Ohne Vermittler, deine Buchung ist sofort fest."],
    ],
  },
  en: {
    kop: "Why book Pleuntje?",
    punten: [
      ["Woods on your doorstep", "A five-minute walk and you're in the forest."],
      ["Sauna around the corner", "Right next to the park, perfect for relaxing."],
      ["True silence", "A quiet spot among the trees. You truly hear nothing."],
      ["Fenced garden", "Your dog can roam free safely."],
      ["Fresh eggs", "Buy fresh eggs from the farmer nearby."],
      ["Free Wi-Fi", "Stay connected, if you want to."],
      ["Room for three", "Two bedrooms with box-spring beds, neatly made up for you."],
      ["Bed linen and towels provided", "Beds made up, towels for the shower and the kitchen."],
      ["Bring nothing", "Everything is there, you really don't need to bring a thing."],
      ["Toiletries", "Shampoo and shower gel are ready for you."],
      ["Booked directly", "No middleman, your booking is confirmed straight away."],
    ],
  },
  fr: {
    kop: "Pourquoi réserver chez Pleuntje ?",
    punten: [
      ["La forêt à deux pas", "En cinq minutes à pied, vous êtes en forêt."],
      ["Un sauna tout près", "Juste à côté du parc, idéal pour se détendre."],
      ["Le vrai silence", "Un endroit calme entre les arbres. Vous n'entendez vraiment rien."],
      ["Jardin clôturé", "Votre chien peut se promener librement en toute sécurité."],
      ["Œufs frais", "Achetez des œufs frais chez le fermier voisin."],
      ["Wi-Fi gratuit", "Restez joignable, si vous le souhaitez."],
      ["De la place pour trois", "Deux chambres avec lits boxspring, soigneusement préparés pour vous."],
      ["Linge de lit et serviettes fournis", "Lits faits, serviettes pour la douche et la cuisine."],
      ["Rien à apporter", "Tout est sur place, vous n'avez vraiment rien à apporter."],
      ["Produits de douche", "Shampooing et gel douche sont à votre disposition."],
      ["Réservation directe", "Sans intermédiaire, votre réservation est confirmée aussitôt."],
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
