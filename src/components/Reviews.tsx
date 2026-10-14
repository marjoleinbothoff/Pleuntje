"use client";

import { useEffect, useState } from "react";

// "Wat gasten zeggen": de reviews die Marjolein op /beheer heeft geplaatst.
// Zolang er nog geen reviews zijn, wordt dit onderdeel niet getoond.

type Review = {
  id: string;
  naam: string;
  sterren: number;
  tekst: string;
  maand: string;
  bron: "site" | "airbnb";
};

const maanden = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

function maandNaam(maand: string) {
  const [j, m] = maand.split("-").map(Number);
  return `${maanden[m - 1]} ${j}`;
}

function Sterren({ aantal, groot = false }: { aantal: number; groot?: boolean }) {
  return (
    <span
      role="img"
      aria-label={`${aantal} van de 5 sterren`}
      className={`tracking-wider ${groot ? "text-2xl" : "text-lg"}`}
    >
      <span className="text-sunset-500">{"★".repeat(aantal)}</span>
      <span className="text-forest-200">{"★".repeat(5 - aantal)}</span>
    </span>
  );
}

function ReviewKaart({ r }: { r: Review }) {
  const [open, setOpen] = useState(false);
  const lang = r.tekst.length > 280;
  return (
    <figure className="flex h-full flex-col rounded-[1.75rem] border border-forest-200 bg-white/70 p-6 text-left shadow-sm shadow-forest-900/10">
      <Sterren aantal={r.sterren} />
      <blockquote className="mt-3 flex-1 text-base leading-relaxed whitespace-pre-line text-forest-900">
        {lang && !open ? `${r.tekst.slice(0, 260).trimEnd()}…` : r.tekst}
      </blockquote>
      {lang && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="mt-2 cursor-pointer self-start text-sm font-semibold text-forest-700 underline"
        >
          {open ? "Minder tonen" : "Lees verder"}
        </button>
      )}
      <figcaption className="mt-4 text-sm text-forest-800">
        <span className="font-bold text-forest-900">{r.naam}</span>
        {" · "}
        {maandNaam(r.maand)}
        {r.bron === "airbnb" && <span className="text-forest-700"> · via Airbnb</span>}
      </figcaption>
    </figure>
  );
}

const EERST_TONEN = 6;

export default function Reviews() {
  const [data, setData] = useState<{ reviews: Review[]; gemiddeld: number | null; aantal: number } | null>(null);
  const [alles, setAlles] = useState(false);

  useEffect(() => {
    let actief = true;
    fetch("/api/reviews.php", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (actief && d && Array.isArray(d.reviews)) setData(d);
      })
      .catch(() => {});
    return () => {
      actief = false;
    };
  }, []);

  if (!data || data.aantal === 0) return null;

  const zichtbaar = alles ? data.reviews : data.reviews.slice(0, EERST_TONEN);

  return (
    <section id="reviews" className="scroll-offset px-4 py-16">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-4xl font-bold text-forest-900">Wat gasten zeggen</h2>
        {data.gemiddeld !== null && (
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 text-lg text-forest-900">
            <Sterren aantal={Math.round(data.gemiddeld)} groot />
            <span>
              <strong>{data.gemiddeld.toLocaleString("nl-NL", { minimumFractionDigits: 1 })}</strong> uit{" "}
              {data.aantal} {data.aantal === 1 ? "review" : "reviews"}
            </span>
          </p>
        )}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {zichtbaar.map((r) => (
            <ReviewKaart key={r.id} r={r} />
          ))}
        </div>
        {data.reviews.length > EERST_TONEN && (
          <button
            type="button"
            onClick={() => setAlles(!alles)}
            className="mt-8 cursor-pointer rounded-full bg-sunset-100 px-6 py-2.5 text-base font-bold text-forest-900 transition hover:bg-sunset-200"
          >
            {alles ? "Minder reviews tonen" : `Alle ${data.aantal} reviews tonen`}
          </button>
        )}
      </div>
    </section>
  );
}
