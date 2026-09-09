const items = [
  {
    emoji: "🥾",
    title: "Bos op loopafstand",
    text: "Trek je wandelschoenen aan en binnen een paar minuten sta je tussen de bomen. Heerlijk voor een ochtendwandeling of een boswandeling bij zonsondergang.",
    tint: "bg-forest-100 text-forest-700",
  },
  {
    emoji: "🧖",
    title: "Sauna om de hoek",
    text: "Naast het park, net om de hoek, kun je heerlijk ontspannen in de sauna. Perfect om je vakantie compleet te maken.",
    tint: "bg-sunset-100 text-sunset-700",
  },
  {
    emoji: "🛏️",
    title: "Plek voor 3 personen",
    text: "Pleun is knus en gezellig ingericht voor maximaal 3 gasten. Ideaal voor een klein gezin of een weekendje weg met vrienden.",
    tint: "bg-forest-100 text-forest-700",
  },
];

export default function Highlights() {
  return (
    <section className="px-4 py-4">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-[2rem] border border-forest-100 bg-white/70 p-6 text-center shadow-sm shadow-forest-900/5 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl ${item.tint}`}
            >
              {item.emoji}
            </div>
            <h3 className="mt-4 text-xl font-bold text-forest-900">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-forest-600">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
