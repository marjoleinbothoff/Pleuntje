// Korte kennismaking direct onder de grote foto: de welkomsttekst links,
// rechts de vier dingen die gasten het meest waarderen (vervangt de getekende tegeltjes).
const punten = [
  { titel: "Bos op loopafstand", tekst: "In vijf minuten loop je het bos in." },
  { titel: "Sauna om de hoek", tekst: "Naast het park, heerlijk om te ontspannen." },
  { titel: "Plek voor drie", tekst: "Twee slaapkamers met boxsprings." },
  { titel: "Omheinde tuin", tekst: "Je hond loopt veilig vrij rond." },
];

export default function Highlights() {
  return (
    <section className="px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <div>
          <h2 className="text-4xl leading-tight text-forest-900 sm:text-5xl">
            Even helemaal tot rust komen
          </h2>
          <div className="mt-6 max-w-lg space-y-4 text-lg leading-relaxed text-forest-800">
            <p>
              Een knus chalet voor drie personen, helemaal omringd door bomen
              en met een eigen omheinde tuin voor je hond.
            </p>
            <p>
              Het bos ligt op loopafstand en de sauna vind je vlak om de hoek,
              naast het park.
            </p>
          </div>
        </div>

        <ul className="grid gap-x-10 sm:grid-cols-2">
          {punten.map((p) => (
            <li key={p.titel} className="border-t border-forest-200 py-5">
              <p className="font-wordmark text-2xl font-semibold text-forest-900">{p.titel}</p>
              <p className="mt-1 text-base text-forest-600">{p.tekst}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
