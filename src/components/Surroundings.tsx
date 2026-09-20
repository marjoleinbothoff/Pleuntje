import Image from "next/image";

const spots = [
  {
    emoji: "🌲",
    title: "Het bos",
    distance: "± 5 min lopen",
    text: "Stap zo de deur uit en je staat tussen de bomen. Volop wandel- en fietsroutes voor jong en oud.",
  },
  {
    emoji: "🧖‍♀️",
    title: "De sauna",
    distance: "om de hoek",
    text: "Naast het park kun je heerlijk stomen, zweten en ontspannen. Een perfecte afsluiting van je dag.",
  },
  {
    emoji: "🌳",
    title: "Het park",
    distance: "direct naast de sauna",
    text: "Een groen park om even lekker uit te waaien, te picknicken of de kinderen te laten spelen.",
  },
];

export default function Surroundings() {
  return (
    <section
      id="omgeving"
      className="scroll-offset relative overflow-hidden bg-forest-50 px-4 py-20"
    >
      <div
        aria-hidden
        className="blob absolute -top-16 right-0 h-64 w-64 bg-sunset-100/70"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-10 text-center lg:grid-cols-[1.1fr_0.9fr] lg:text-left">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-forest-700">
              Omgeving
            </span>
            <h2 className="mt-4 text-4xl font-bold text-forest-900">
              Alles binnen handbereik
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-forest-700 lg:mx-0">
              Pleun ligt op een fijne plek: de natuur van de Veluwe voor je
              deur, en ontspanning net om de hoek.
            </p>
          </div>
          <div className="photo-frame blob-3 square-box mx-auto max-w-xs">
            <Image
              src="/photos/tuin.jpg"
              alt="Pleun met de omheinde tuin, omringd door bomen en groen"
              fill
              sizes="(min-width: 1024px) 320px, 80vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-6 text-center sm:grid-cols-3">
          {spots.map((spot) => (
            <div
              key={spot.title}
              className="flex flex-col items-center rounded-[2rem] bg-white p-7 shadow-sm shadow-forest-900/5"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-100 text-3xl">
                {spot.emoji}
              </span>
              <h3 className="mt-4 text-xl font-bold text-forest-900">
                {spot.title}
              </h3>
              <span className="mt-1 rounded-full bg-sunset-100 px-3 py-1 text-xs font-bold text-sunset-700">
                {spot.distance}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-forest-600">
                {spot.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
