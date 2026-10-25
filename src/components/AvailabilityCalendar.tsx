"use client";

import { useEffect, useRef, useState } from "react";
import { dayStatus, toISODate } from "@/lib/availability";
import { STANDAARD_PRIJZEN, euroKort, type Prijzen } from "@/lib/pricing";
import { isHighSeason, HIGH_SEASON_COLOR } from "@/data/highSeason";
import { BOEKEN, KALENDER } from "@/i18n/boeken";
import { LOCALE, type Taal } from "@/i18n/talen";

const checkoutGradient =
  "linear-gradient(90deg, var(--booked) 50%, var(--green-200) 50%)";
const checkinGradient =
  "linear-gradient(90deg, var(--green-200) 50%, var(--booked) 50%)";

// Zonnegeel (zoals de zon in het logo) voor hoogseizoen, zodat het duidelijk afwijkt van laagseizoen
const highSeasonColor = HIGH_SEASON_COLOR;

// Felle bladgroen-kleur voor de gekozen dagen: steekt af tegen het warme oranje/beige
const selectedColor = "#4f8a2b";

// Namen van dagen en maanden in de taal van de bezoeker (maandag eerst)
function dagNamen(taal: Taal) {
  // 5 januari 2026 is een maandag
  return Array.from({ length: 7 }, (_, i) =>
    new Date(2026, 0, 5 + i)
      .toLocaleDateString(LOCALE[taal], { weekday: "short" })
      .replace(".", "")
      .slice(0, 2)
      .toLowerCase(),
  );
}

function maandNaam(taal: Taal, month: number) {
  return new Date(2026, month, 1).toLocaleDateString(LOCALE[taal], { month: "long" });
}

function buildMonthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

type AvailabilityCalendarProps = {
  // Taal van de teksten (de beheerpagina gebruikt Nederlands)
  taal?: Taal;
  // Bezette nachten (elke datum = de nacht die op die dag begint)
  nights: Set<string>;
  // Prijzen tonen (op de site wel, op de beheerpagina niet)
  showPrices?: boolean;
  prijzen?: Prijzen;
  instruction?: string;
  // Welke dagen aangeklikt mogen worden (bijv. volgens de boekingsregels).
  // Niet opgegeven: alle vrije dagen vanaf vandaag.
  isSelectable?: (iso: string) => boolean;
  // Hoeveel maanden vooruit je kunt bladeren
  maxMonthsAhead?: number;
  selectedCheckIn?: string;
  selectedCheckOut?: string;
  onSelectDate?: (iso: string) => void;
  // Tik je ergens buiten de kalender (niet in een formulier, knop of veld)? Dan worden de gekozen dagen gewist.
  onClearSelection?: () => void;
};

function MonthGrid({
  taal = "nl",
  year,
  month,
  nights,
  isSelectable,
  selectedCheckIn,
  selectedCheckOut,
  onSelectDate,
}: {
  year: number;
  month: number;
} & AvailabilityCalendarProps) {
  const cells = buildMonthCells(year, month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div data-kalender-maand className="rounded-[2rem] border border-forest-700 bg-forest-600 p-5 shadow-sm shadow-forest-900/20 sm:p-6">
      <h3 className="text-center text-lg font-bold text-forest-50">
        {maandNaam(taal, month)} {year}
      </h3>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-bold text-forest-100">
        {dagNamen(taal).map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <span key={i} />;
          const iso = toISODate(date);
          const isPast = date < today;
          const status = dayStatus(nights, iso);
          const isBooked = status === "booked";
          const isCheckout = status === "checkout";
          const isCheckin = status === "checkin";
          const isTurnover = isCheckout || isCheckin;
          const isSelectedStart = iso === selectedCheckIn;
          const isSelectedEnd = iso === selectedCheckOut;
          const isInRange =
            !!selectedCheckIn &&
            !!selectedCheckOut &&
            iso > selectedCheckIn &&
            iso < selectedCheckOut;
          // Buiten de regels (te vroeg, te ver vooruit, te kort of te lang): grijs, niet aan te klikken
          const isOutsideRules =
            !isPast && !isBooked && !!onSelectDate && !!isSelectable && !isSelectable(iso);
          const isClickable = !isPast && !isBooked && !isOutsideRules && onSelectDate;
          // Wissel-dagen (incheck/vertrek) houden altijd hun halve kleur, ook als je er niet kunt beginnen
          const isGreyedOut = isOutsideRules && !(status === "checkout" || status === "checkin");
          const isHigh = isHighSeason(iso);
          const isSelected = isSelectedStart || isSelectedEnd || isInRange;

          return (
            <button
              key={i}
              type="button"
              disabled={!isClickable}
              onClick={isClickable ? () => onSelectDate(iso) : undefined}
              className={[
                "flex h-9 items-center justify-center rounded-full text-sm font-semibold transition",
                isClickable ? "cursor-pointer" : "cursor-default",
                isPast
                  ? "text-forest-300"
                  : isGreyedOut && !isSelectedStart
                    ? "text-forest-300 opacity-70"
                  : isSelected
                    ? "font-bold text-white shadow-md"
                    : isBooked
                      ? "bg-booked text-forest-700"
                      : isTurnover
                        ? "text-forest-700"
                        : isHigh
                          ? "text-forest-700"
                          : "bg-forest-200 text-forest-700",
                isSelectedStart || isSelectedEnd
                  ? "ring-2 ring-white ring-offset-2 ring-offset-forest-600"
                  : "",
              ].join(" ")}
              style={
                !isPast && isSelected
                  ? { background: selectedColor }
                  : isGreyedOut
                    ? undefined
                  : !isPast && isTurnover
                    ? { background: isCheckout ? checkoutGradient : checkinGradient }
                    : !isPast && !isBooked && isHigh
                      ? { background: highSeasonColor }
                      : undefined
              }
              title={
                !isPast && isCheckout
                  ? KALENDER[taal].vertrekTitel
                  : !isPast && isCheckin
                    ? KALENDER[taal].aankomstTitel
                    : undefined
              }
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const DEFAULT_MAX_MONTHS_AHEAD = 23;

export default function AvailabilityCalendar({
  taal = "nl",
  nights,
  showPrices = true,
  prijzen = STANDAARD_PRIJZEN,
  instruction = KALENDER.nl.instructie,
  isSelectable,
  maxMonthsAhead = DEFAULT_MAX_MONTHS_AHEAD,
  selectedCheckIn,
  selectedCheckOut,
  onSelectDate,
  onClearSelection,
}: AvailabilityCalendarProps) {
  const [monthOffset, setMonthOffset] = useState(0);
  const k = KALENDER[taal];
  const b = BOEKEN[taal];
  const heeftKeuze = !!selectedCheckIn;
  const wisRef = useRef(onClearSelection);
  useEffect(() => {
    wisRef.current = onClearSelection;
  });

  // Een korte tik (geen scrollen) buiten de kalender wist de keuze, zodat je opnieuw kunt beginnen.
  // Niet bij tikken in een formulier, op een knop, link of invulveld, of in iets met data-houd-datums.
  useEffect(() => {
    if (!heeftKeuze) return;
    let begin: { x: number; y: number; t: number; doel: EventTarget | null } | null = null;
    const neer = (e: PointerEvent) => {
      begin = { x: e.clientX, y: e.clientY, t: Date.now(), doel: e.target };
    };
    const op = (e: PointerEvent) => {
      const b = begin;
      begin = null;
      if (!b) return;
      if (Math.abs(e.clientX - b.x) > 10 || Math.abs(e.clientY - b.y) > 10 || Date.now() - b.t > 600) return;
      const doel = b.doel instanceof Element ? b.doel : null;
      if (!doel) return;
      // Alleen tikken óp een maandblok telt als 'in de kalender'; de lege ruimte ernaast wist juist.
      if (doel.closest("[data-kalender-maand], form, input, textarea, select, button, a, label, [data-houd-datums]")) return;
      wisRef.current?.();
    };
    const stop = () => {
      begin = null;
    };
    document.addEventListener("pointerdown", neer);
    document.addEventListener("pointerup", op);
    document.addEventListener("pointercancel", stop);
    return () => {
      document.removeEventListener("pointerdown", neer);
      document.removeEventListener("pointerup", op);
      document.removeEventListener("pointercancel", stop);
    };
  }, [heeftKeuze]);
  const now = new Date();
  const months = [0, 1].map((offset) => {
    const d = new Date(now.getFullYear(), now.getMonth() + monthOffset + offset, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  return (
    <div>
      {onSelectDate && (
        <p className="mb-4 text-center text-sm font-semibold text-forest-900">
          {instruction}
        </p>
      )}
      <div className="mb-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setMonthOffset((o) => Math.max(0, o - 1))}
          disabled={monthOffset === 0}
          className="rounded-full bg-forest-600 px-4 py-2 text-sm font-bold text-forest-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {k.vorige}
        </button>
        <span className="text-sm font-bold text-forest-900">
          {maandNaam(taal, months[0].month)} {months[0].year}
        </span>
        <button
          type="button"
          onClick={() =>
            setMonthOffset((o) => Math.min(maxMonthsAhead, o + 1))
          }
          disabled={monthOffset >= maxMonthsAhead}
          className="rounded-full bg-forest-600 px-4 py-2 text-sm font-bold text-forest-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {k.volgende}
        </button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {months.map(({ year, month }) => (
          <MonthGrid
            taal={taal}
            key={`${year}-${month}`}
            year={year}
            month={month}
            nights={nights}
            isSelectable={isSelectable}
            selectedCheckIn={selectedCheckIn}
            selectedCheckOut={selectedCheckOut}
            onSelectDate={onSelectDate}
          />
        ))}
      </div>
      {onSelectDate && onClearSelection && heeftKeuze && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => onClearSelection()}
            className="inline-flex items-center gap-2 rounded-full border-2 border-forest-600 bg-cream px-5 py-2 text-sm font-bold text-forest-900 shadow-sm hover:bg-forest-100 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
          >
            <span aria-hidden="true">✕</span> {k.wissen}
          </button>
        </div>
      )}
      {showPrices && (
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-2xl bg-forest-100 p-4 text-forest-900">
          <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full border border-forest-300 bg-forest-200" />
          <span>
            <span className="block font-bold">{b.laag(euroKort(prijzen.laagseizoen))}</span>
            <span className="text-sm">{b.overige}</span>
          </span>
        </div>
        <div
          className="flex items-start gap-3 rounded-2xl p-4 text-forest-900"
          style={{ background: "#fbecc4" }}
        >
          <span
            className="mt-0.5 h-6 w-6 shrink-0 rounded-full border border-[#d9b052]"
            style={{ background: highSeasonColor }}
          />
          <span>
            <span className="block font-bold">{b.hoog(euroKort(prijzen.hoogseizoen))}</span>
            <span className="text-sm">{b.hoogUitleg}</span>
          </span>
        </div>
      </div>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-forest-900">
        {onSelectDate && (
          <span className="flex items-center gap-2.5">
            <span
              className="h-5 w-5 rounded-full"
              style={{ background: selectedColor }}
            />
            {k.gekozen}
          </span>
        )}
        <span className="flex items-center gap-2.5">
          <span className="h-5 w-5 rounded-full bg-booked" /> {k.bezet}
        </span>
      </div>
    </div>
  );
}
