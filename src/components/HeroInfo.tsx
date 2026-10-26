"use client";
// Onder "Pleuntje" op de grote foto: wat het is, vanaf-prijs, reviewscore en een knop naar de kalender
// (26 okt 2026, wens Marjolein: bezoekers moeten meteen zien wat het is en wat het kost).
import { useEffect, useState } from "react";
import { useAvailability } from "@/lib/availability";
import { euroKort } from "@/lib/pricing";
import type { Taal } from "@/i18n/talen";

const LOCALE: Record<Taal, string> = { nl: "nl-NL", de: "de-DE", en: "en-GB", fr: "fr-FR" };

const T: Record<Taal, { wat: string; vanaf: (e: string) => string; reviews: (n: number) => string; knop: string; voordelig: string }> = {
  nl: {
    wat: "Boshuis op de Veluwe · 3 personen · hond welkom",
    vanaf: (e) => `vanaf €${e} per nacht`,
    reviews: (n) => `${n} ${n === 1 ? "review" : "reviews"}`,
    knop: "Bekijk beschikbaarheid",
    voordelig: "Direct boeken is voordeliger dan via Airbnb",
  },
  de: {
    wat: "Waldhaus in der Veluwe · 3 Personen · Hund willkommen",
    vanaf: (e) => `ab €${e} pro Nacht`,
    reviews: (n) => `${n} ${n === 1 ? "Bewertung" : "Bewertungen"}`,
    knop: "Verfügbarkeit prüfen",
    voordelig: "Direkt buchen ist günstiger als über Airbnb",
  },
  en: {
    wat: "Woodland cabin on the Veluwe · 3 guests · dogs welcome",
    vanaf: (e) => `from €${e} per night`,
    reviews: (n) => `${n} ${n === 1 ? "review" : "reviews"}`,
    knop: "Check availability",
    voordelig: "Booking direct is cheaper than via Airbnb",
  },
  fr: {
    wat: "Chalet en forêt sur la Veluwe · 3 personnes · chiens bienvenus",
    vanaf: (e) => `à partir de €${e} la nuit`,
    reviews: (n) => `${n} avis`,
    knop: "Voir les disponibilités",
    voordelig: "Réserver en direct coûte moins cher que via Airbnb",
  },
};

export default function HeroInfo({ taal }: { taal: Taal }) {
  const t = T[taal];
  const { prijzen, status } = useAvailability(true);
  const [score, setScore] = useState<{ gemiddeld: number | null; aantal: number } | null>(null);

  useEffect(() => {
    let actief = true;
    fetch("/api/reviews.php", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (actief && d && typeof d.aantal === "number") setScore({ gemiddeld: d.gemiddeld ?? null, aantal: d.aantal });
      })
      .catch(() => {});
    return () => {
      actief = false;
    };
  }, []);

  return (
    <div className="mt-4 text-photo-ink [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">
      <p className="text-lg font-semibold sm:text-2xl">{t.wat}</p>
      <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-base sm:text-xl">
        {/* Pas tonen als de echte prijs binnen is, zodat er niet even een verkeerd bedrag staat */}
        <span className={status === "loading" ? "invisible" : ""}>{t.vanaf(euroKort(prijzen.laagseizoen))}</span>
        {score && score.aantal > 0 && score.gemiddeld !== null && (
          <a href="#reviews" className="underline decoration-1 underline-offset-4 hover:opacity-80">
            <span className="text-[#f5c451]">★</span>{" "}
            {score.gemiddeld.toLocaleString(LOCALE[taal], { minimumFractionDigits: 1, maximumFractionDigits: 1 })} · {t.reviews(score.aantal)}
          </a>
        )}
      </p>
      {/* 26 okt 2026: op de site is hetzelfde weekend (6-8 nov) €243,58, via Airbnb €386 voor gasten */}
      <p className="mt-3 inline-block rounded-full px-4 py-1.5 text-sm font-bold text-white [text-shadow:none] sm:text-base" style={{ background: "#cc6a3a" }}>
        {t.voordelig}
      </p>
      <br />
      <a
        href="#boeken"
        className="mt-4 inline-flex min-h-11 items-center rounded-full bg-cream px-6 py-3 text-base font-bold text-forest-900 shadow-md shadow-black/30 transition hover:bg-zand [text-shadow:none]"
      >
        {t.knop}
      </a>
    </div>
  );
}
