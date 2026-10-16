"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Reviews: op de pagina alleen een kopje, de gemiddelde score en een knop (net als
// Voorzieningen en Omgeving). De reviews zelf staan in een venster dat opent via de knop
// of via "Reviews" in het menu. Zolang er nog geen reviews zijn, wordt dit onderdeel niet getoond.

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

export default function Reviews() {
  const [data, setData] = useState<{ reviews: Review[]; gemiddeld: number | null; aantal: number } | null>(null);
  const [open, setOpen] = useState(false);

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

  // Net als bij Voorzieningen: "Reviews" in het menu opent meteen het venster
  useEffect(() => {
    function clearHash() {
      setTimeout(() => {
        if (window.location.hash === "#reviews") {
          history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      }, 0);
    }
    function checkHash() {
      if (window.location.hash === "#reviews") {
        setOpen(true);
        clearHash();
      }
    }
    function handleClick(event: MouseEvent) {
      const target = (event.target as HTMLElement)?.closest('a[href="#reviews"]');
      if (target) {
        setOpen(true);
        clearHash();
      }
    }
    checkHash();
    window.addEventListener("hashchange", checkHash);
    document.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("hashchange", checkHash);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!data || data.aantal === 0) return null;

  const score =
    data.gemiddeld !== null ? (
      <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 text-lg text-forest-900">
        <Sterren aantal={Math.round(data.gemiddeld)} groot />
        <span>
          <strong>{data.gemiddeld.toLocaleString("nl-NL", { minimumFractionDigits: 1 })}</strong> uit{" "}
          {data.aantal} {data.aantal === 1 ? "review" : "reviews"}
        </span>
      </p>
    ) : null;

  return (
    <section id="reviews" className="scroll-offset relative overflow-hidden px-4 py-20">
      <div className="relative mx-auto max-w-xl text-center">
        <h2 className="text-4xl font-bold text-forest-900">
          <span className="glossy-text" data-text="Reviews">
            Reviews
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-8 mb-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-sunset-100 px-4 py-1.5 text-sm font-bold text-forest-900"
        >
          Lees de reviews
        </button>
        {score}
        <p className="mt-3 text-lg text-forest-900">
          Benieuwd wat andere gasten van hun verblijf vonden? Klik op de knop hierboven.
        </p>
      </div>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Sluiten"
              className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
            >
              ✕
            </button>
            <div
              className="max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-[2.5rem] bg-cream p-6 shadow-lg sm:p-10"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Reviews"
            >
              <h3 className="text-center text-2xl font-bold text-forest-900">Wat gasten zeggen</h3>
              {score}
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.reviews.map((r) => (
                  <ReviewKaart key={r.id} r={r} />
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
