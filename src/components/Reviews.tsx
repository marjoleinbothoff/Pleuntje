"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LOCALE, type Taal } from "@/i18n/talen";

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

const T: Record<
  Taal,
  {
    kop: string;
    knop: string;
    uitleg: string;
    venster: string;
    sterren: (n: number) => string;
    uit: string;
    review: string;
    reviews: string;
    minder: string;
    meer: string;
    viaAirbnb: string;
    sluiten: string;
    origineel?: string;
  }
> = {
  nl: {
    kop: "Reviews",
    knop: "Lees de reviews",
    uitleg: "Benieuwd wat andere gasten van hun verblijf vonden? Klik op de knop hierboven.",
    venster: "Wat gasten zeggen",
    sterren: (n) => `${n} van de 5 sterren`,
    uit: "uit",
    review: "review",
    reviews: "reviews",
    minder: "Minder tonen",
    meer: "Lees verder",
    viaAirbnb: "via Airbnb",
    sluiten: "Sluiten",
  },
  de: {
    kop: "Bewertungen",
    knop: "Bewertungen lesen",
    uitleg: "Neugierig, wie anderen Gästen ihr Aufenthalt gefallen hat? Klicke oben auf den Knopf.",
    venster: "Das sagen unsere Gäste",
    sterren: (n) => `${n} von 5 Sternen`,
    uit: "aus",
    review: "Bewertung",
    reviews: "Bewertungen",
    minder: "Weniger anzeigen",
    meer: "Weiterlesen",
    viaAirbnb: "über Airbnb",
    sluiten: "Schließen",
    origineel: "Die Bewertungen werden in der Originalsprache angezeigt (meist Niederländisch).",
  },
  en: {
    kop: "Reviews",
    knop: "Read the reviews",
    uitleg: "Curious what other guests thought of their stay? Click the button above.",
    venster: "What guests say",
    sterren: (n) => `${n} out of 5 stars`,
    uit: "from",
    review: "review",
    reviews: "reviews",
    minder: "Show less",
    meer: "Read more",
    viaAirbnb: "via Airbnb",
    sluiten: "Close",
    origineel: "Reviews are shown in their original language (mostly Dutch).",
  },
  fr: {
    kop: "Avis",
    knop: "Lire les avis",
    uitleg: "Envie de savoir ce que d'autres hôtes ont pensé de leur séjour ? Cliquez sur le bouton ci-dessus.",
    venster: "Ce que disent nos hôtes",
    sterren: (n) => `${n} étoiles sur 5`,
    uit: "sur",
    review: "avis",
    reviews: "avis",
    minder: "Afficher moins",
    meer: "Lire la suite",
    viaAirbnb: "via Airbnb",
    sluiten: "Fermer",
    origineel: "Les avis sont affichés dans leur langue d'origine (le plus souvent le néerlandais).",
  },
};

function maandNaam(maand: string, taal: Taal) {
  const [j, m] = maand.split("-").map(Number);
  return new Date(j, m - 1, 1).toLocaleDateString(LOCALE[taal], { month: "long", year: "numeric" });
}

function Sterren({ aantal, groot = false, taal }: { aantal: number; groot?: boolean; taal: Taal }) {
  return (
    <span
      role="img"
      aria-label={T[taal].sterren(aantal)}
      className={`tracking-wider ${groot ? "text-2xl" : "text-lg"}`}
    >
      <span className="text-sunset-500">{"★".repeat(aantal)}</span>
      <span className="text-forest-200">{"★".repeat(5 - aantal)}</span>
    </span>
  );
}

function ReviewKaart({ r, taal }: { r: Review; taal: Taal }) {
  const t = T[taal];
  const [open, setOpen] = useState(false);
  const lang = r.tekst.length > 280;
  return (
    <figure className="flex h-full flex-col rounded-[1.75rem] border border-forest-200 bg-white/70 p-6 text-left shadow-sm shadow-forest-900/10">
      <Sterren aantal={r.sterren} taal={taal} />
      <blockquote className="mt-3 flex-1 text-base leading-relaxed whitespace-pre-line text-forest-900">
        {lang && !open ? `${r.tekst.slice(0, 260).trimEnd()}…` : r.tekst}
      </blockquote>
      {lang && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="mt-2 cursor-pointer self-start text-sm font-semibold text-forest-700 underline"
        >
          {open ? t.minder : t.meer}
        </button>
      )}
      <figcaption className="mt-4 text-sm text-forest-800">
        <span className="font-bold text-forest-900">{r.naam}</span>
        {" · "}
        {maandNaam(r.maand, taal)}
        {r.bron === "airbnb" && <span className="text-forest-700"> · {t.viaAirbnb}</span>}
      </figcaption>
    </figure>
  );
}

export default function Reviews({ taal }: { taal: Taal }) {
  const t = T[taal];
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
        <Sterren aantal={Math.round(data.gemiddeld)} groot taal={taal} />
        <span>
          <strong>{data.gemiddeld.toLocaleString(LOCALE[taal], { minimumFractionDigits: 1 })}</strong> {t.uit}{" "}
          {data.aantal} {data.aantal === 1 ? t.review : t.reviews}
        </span>
      </p>
    ) : null;

  return (
    <section id="reviews" className="scroll-offset relative overflow-hidden band-reviews px-4 py-20">
      <div className="relative mx-auto max-w-xl text-center">
        <h2 className="text-4xl font-bold text-roest-donker">
          <span className="glossy-text" data-text={t.kop}>
            {t.kop}
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-8 mb-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-roest px-5 py-2 text-sm font-bold text-white transition hover:bg-roest-donker"
        >
          {t.knop}
        </button>
        {score}
        <p className="mt-3 text-lg text-forest-900">
          {t.uitleg}
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
              aria-label={t.sluiten}
              className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
            >
              ✕
            </button>
            <div
              className="max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-[2.5rem] bg-cream p-6 shadow-lg sm:p-10"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={t.kop}
            >
              <h3 className="text-center text-2xl font-bold text-forest-900">{t.venster}</h3>
              {score}
              {t.origineel && <p className="mt-2 text-center text-sm text-forest-700">{t.origineel}</p>}
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.reviews.map((r) => (
                  <ReviewKaart key={r.id} r={r} taal={taal} />
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
