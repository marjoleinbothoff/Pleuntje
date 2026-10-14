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
      <span className="text-forest-600">{"★".repeat(aantal)}</span>
      <span className="text-forest-200">{"★".repeat(5 - aantal)}</span>
    </span>
  );
}

function ReviewKaart({ r }: { r: Review }) {
  const [open, setOpen] = useState(false);
  const lang = r.tekst.length > 280;
  return (
    <figure className="flex h-full flex-col border-t border-forest-200 pt-6 text-left">
      <Sterren aantal={r.sterren} />
      <blockquote className="mt-4 flex-1 font-wordmark text-[1.35rem] leading-snug whitespace-pre-line text-forest-900">
        {lang && !open ? `${r.tekst.slice(0, 260).trimEnd()}…` : r.tekst}
      </blockquote>
      {lang && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="mt-3 cursor-pointer self-start text-sm text-forest-600 underline underline-offset-4"
        >
          {open ? "Minder tonen" : "Lees verder"}
        </button>
      )}
      <figcaption className="mt-5 text-sm text-forest-600">
        <span className="font-medium text-forest-900">{r.naam}</span>, {maandNaam(r.maand)}
        {r.bron === "airbnb" && <span>, via Airbnb</span>}
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
    <section id="reviews" className="scroll-offset px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl text-forest-900 sm:text-5xl">Wat gasten zeggen</h2>
        {data.gemiddeld !== null && (
          <p className="mt-4 flex flex-wrap items-center gap-x-3 text-lg text-forest-800">
            <Sterren aantal={Math.round(data.gemiddeld)} groot />
            <span>
              <strong>{data.gemiddeld.toLocaleString("nl-NL", { minimumFractionDigits: 1 })}</strong> uit{" "}
              {data.aantal} {data.aantal === 1 ? "review" : "reviews"}
            </span>
          </p>
        )}
        <div className="mt-14 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {zichtbaar.map((r) => (
            <ReviewKaart key={r.id} r={r} />
          ))}
        </div>
        {data.reviews.length > EERST_TONEN && (
          <button
            type="button"
            onClick={() => setAlles(!alles)}
            className="mt-14 cursor-pointer rounded-sm border border-forest-700 px-7 py-3.5 text-base font-medium text-forest-900 transition-colors hover:bg-forest-700 hover:text-cream"
          >
            {alles ? "Minder reviews tonen" : `Alle ${data.aantal} reviews tonen`}
          </button>
        )}
      </div>
    </section>
  );
}
