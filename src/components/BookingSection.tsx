"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { tel } from "@/components/Teller";
import Huisregels from "@/components/Huisregels";
import {
  addDays,
  arrivalRange,
  isValidArrival,
  overlapsNights,
  ruleProblem,
  useAvailability,
} from "@/lib/availability";
import { CONTACT_EMAIL } from "@/data/contact";
import { calculateTotal, euroKort, formatEuro } from "@/lib/pricing";
import { HIGH_SEASON_COLOR } from "@/data/highSeason";
import { BOEKEN, KALENDER } from "@/i18n/boeken";
import { pad, type Taal } from "@/i18n/talen";

type Status = "idle" | "sending" | "success" | "error";

function formatDate(iso: string) {
  if (!iso) return "?";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

export default function BookingSection({ taal }: { taal: Taal }) {
  const t = BOEKEN[taal];
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [dogs, setDogs] = useState("0");
  const [guests, setGuests] = useState("1");
  const [summary, setSummary] = useState<{
    checkIn: string;
    checkOut: string;
    guests: string;
    pricing: ReturnType<typeof calculateTotal>;
  } | null>(null);

  // Haal de actuele beschikbaarheid op zodra het boekingsvenster opengaat
  const availability = useAvailability(open);

  // Kan er direct geboekt en betaald worden (Mollie)? Anders: aanvraag zoals voorheen.
  // "test" krijgt alleen Marjolein te zien als ze is ingelogd op /beheer.
  const [boekModus, setBoekModus] = useState<"laden" | "live" | "test" | "uit">("laden");
  const [akkoord, setAkkoord] = useState(false);
  // Voor het ochtendoverzicht: iemand heeft het boekingsvenster geopend
  useEffect(() => {
    if (open) tel("boekvenster");
  }, [open]);
  useEffect(() => {
    if (!open) return;
    let actief = true;
    fetch("/api/boek.php?modus=1", { cache: "no-store", credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : { modus: "uit" }))
      .then((d: { modus?: string }) => {
        if (!actief) return;
        setBoekModus(d.modus === "live" || d.modus === "test" ? d.modus : "uit");
      })
      .catch(() => {
        if (actief) setBoekModus("uit");
      });
    return () => {
      actief = false;
    };
  }, [open]);
  const directBoeken = boekModus === "live" || boekModus === "test";
  const nights = availability.nights;
  const { regels, today, prijzen } = availability;
  const { earliest, latest } = arrivalRange(regels, today);

  // Na het kiezen van een aankomstdag: de vertrekdag moet binnen min/max nachten vallen
  const choosingCheckout = !!checkIn && !checkOut;
  function isInCheckoutWindow(iso: string) {
    return (
      choosingCheckout &&
      iso >= addDays(checkIn, regels.minNachten) &&
      iso <= addDays(checkIn, regels.maxNachten)
    );
  }
  function isSelectable(iso: string) {
    return isInCheckoutWindow(iso) || isValidArrival(nights, regels, today, iso);
  }

  const pricing = calculateTotal(checkIn, checkOut, Number(dogs), Number(guests), prijzen);

  useEffect(() => {
    // Haalt "#boeken" weer uit het adres, zodat de pagina bij vernieuwen
    // (of via een opgeslagen tabblad) gewoon bovenaan begint, zonder agenda.
    function clearHash() {
      setTimeout(() => {
        const h = window.location.hash;
        if (h === "#boeken" || h === "#boeken-opnieuw") {
          history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search,
          );
        }
      }, 0);
    }
    function checkHash() {
      const h = window.location.hash;
      if (h === "#boeken" || h === "#boeken-opnieuw") {
        setOpen(true);
        clearHash();
      }
    }
    function handleClick(event: MouseEvent) {
      const target = (event.target as HTMLElement)?.closest(
        'a[href="#boeken"]',
      );
      if (target) {
        setOpen(true);
        clearHash();
      }
    }
    // Bij het openen van de pagina gaat de agenda alleen vanzelf open als de
    // gast terugkomt van een mislukte betaling (#boeken-opnieuw). Een oud
    // adres met #boeken begint gewoon bovenaan de voorkant.
    function checkStart() {
      if (window.location.hash === "#boeken-opnieuw") {
        setOpen(true);
        clearHash();
      } else if (window.location.hash === "#boeken") {
        clearHash();
        setTimeout(() => window.scrollTo(0, 0), 0);
      }
    }
    checkStart();
    window.addEventListener("hashchange", checkHash);
    document.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("hashchange", checkHash);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  function handleSelectDate(iso: string) {
    setStatus("idle");
    setErrorMessage("");

    if (!isInCheckoutWindow(iso)) {
      setCheckIn(iso);
      setCheckOut("");
      return;
    }

    if (overlapsNights(nights, checkIn, iso)) {
      setErrorMessage(t.bezetTussen);
      setStatus("error");
      return;
    }

    setCheckOut(iso);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const guests = String(data.get("guests") ?? "");
    const phone = String(data.get("phone") ?? "");
    const message = String(data.get("message") ?? "");

    if (checkIn && checkOut && checkOut <= checkIn) {
      setStatus("error");
      setErrorMessage(t.uitcheckNa);
      return;
    }

    if (checkIn && checkOut && overlapsNights(nights, checkIn, checkOut)) {
      setStatus("error");
      setErrorMessage(t.bezet);
      return;
    }

    const problem = checkIn && checkOut ? ruleProblem(regels, today, checkIn, checkOut, taal) : null;
    if (problem) {
      setStatus("error");
      setErrorMessage(problem);
      return;
    }

    if (!akkoord) {
      setStatus("error");
      setErrorMessage(t.akkoordEerst);
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    // Direct boeken: de server houdt de datums vast en stuurt de gast door naar Mollie
    if (directBoeken) {
      try {
        const response = await fetch("/api/boek.php", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Pleuntje": "1" },
          credentials: "same-origin",
          body: JSON.stringify({
            naam: name,
            email,
            telefoon: phone,
            aankomst: checkIn,
            vertrek: checkOut,
            personen: Number(guests),
            honden: Number(dogs),
            bericht: message,
            akkoord: true,
            taal,
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || typeof result.betaallink !== "string") {
          setStatus("error");
          setErrorMessage(serverFout(response.status, result.fout, t.boekenMislukt));
          return;
        }
        window.location.assign(result.betaallink);
      } catch {
        setStatus("error");
        setErrorMessage(t.netwerk);
      }
      return;
    }

    const totaal = pricing
      ? `€${formatEuro(pricing.total)} (${pricing.nights} nachten, incl. €${formatEuro(pricing.touristTax)} toeristenbelasting)`
      : "-";

    // De aanvraag gaat naar de server van boshuispleuntje.nl: die zet hem op /beheer
    // (bevestigen met één knop) en mailt hem naar info@boshuispleuntje.nl.
    try {
      const response = await fetch("/api/aanvraag.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Pleuntje": "1" },
        body: JSON.stringify({
          naam: name,
          email,
          telefoon: phone,
          aankomst: checkIn,
          vertrek: checkOut,
          personen: Number(guests),
          honden: Number(dogs),
          totaal,
          bericht: message,
          taal,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        setStatus("error");
        setErrorMessage(serverFout(response.status, result.fout, t.versturenMislukt(CONTACT_EMAIL)));
        return;
      }

      setStatus("success");
      setSummary({
        checkIn,
        checkOut,
        guests,
        pricing,
      });
      form.reset();
      setAkkoord(false);
      setCheckIn("");
      setCheckOut("");
      setDogs("0");
      setGuests("1");
    } catch {
      setStatus("error");
      setErrorMessage(t.netwerkMail(CONTACT_EMAIL));
    }
  }

  // Foutmelding van de server: in het Nederlands zoals de server hem geeft; in de
  // andere talen een vertaalde melding (de server spreekt alleen Nederlands).
  function serverFout(httpStatus: number, fout: unknown, standaard: string) {
    if (taal === "nl") return typeof fout === "string" ? fout : standaard;
    if (httpStatus === 409) return t.netBezet;
    if (httpStatus === 429) return t.teVeel;
    return standaard;
  }

  return (
    <section
      id="boeken"
      className="scroll-offset relative overflow-hidden overloop-boeken px-4 py-20"
    >
      <div className="relative mx-auto max-w-xl text-center">
        <h2 className="text-4xl font-bold text-white">
          {t.kop}{" "}
          <span className="glossy-text" style={{ color: "var(--photo-ink)" }} data-text="Pleuntje">
            Pleuntje
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-8 mb-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-cream px-6 py-2.5 text-base font-bold text-forest-900 shadow-md shadow-black/20 transition hover:bg-zand"
        >
          {t.knop}
        </button>
        <p className="text-lg text-white">
          {t.uitleg}
        </p>
        {/* Alleen het venster; geen knop op de voorkant (wens Marjolein 25 okt): openen kan alleen via het linkje bij het vinkje. */}
        <Huisregels taal={taal} metKnop={false} />
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
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2.5rem] bg-cream p-6 shadow-lg sm:p-10"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-forest-900">
                {t.kop} Pleuntje
              </h3>

              <div className="mt-6 rounded-[2rem] border border-forest-700 bg-forest-600 p-6 shadow-sm shadow-forest-900/20 sm:p-8">
                <h4 className="text-xl font-bold text-cream">{t.tarieven}</h4>
                <ul className="mt-4 space-y-2 text-cream">
                  <li className="flex items-start gap-2.5">
                    <span
                      className="mt-1 h-4 w-4 shrink-0 rounded-full"
                      style={{ background: HIGH_SEASON_COLOR }}
                    />
                    <span>
                      <strong>{t.hoog(euroKort(prijzen.hoogseizoen))}</strong>
                      <span className="block text-sm opacity-90">{t.hoogUitleg}</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 h-4 w-4 shrink-0 rounded-full bg-forest-200" />
                    <span>
                      <strong>{t.laag(euroKort(prijzen.laagseizoen))}</strong>
                      <span className="block text-sm opacity-90">{t.overige}</span>
                    </span>
                  </li>
                  <li>{t.schoonmaak(euroKort(prijzen.schoonmaak))}</li>
                  <li>{t.hondenTarief(euroKort(prijzen.hond))}</li>
                  <li>{t.belastingTarief(formatEuro(prijzen.toeristenbelasting))}</li>
                  <li>{t.minMax(regels.minNachten, regels.maxNachten)}</li>
                  <li>{t.max3}</li>
                  <li>{t.bedden}</li>
                  <li>{t.handdoeken}</li>
                </ul>
              </div>

              <div className="mt-6">
                {availability.status === "loading" && (
                  <p className="mb-4 text-center text-sm font-semibold text-forest-900">
                    {t.laden}
                  </p>
                )}
                {availability.status === "error" && (
                  <p className="mb-4 rounded-2xl bg-sunset-100 p-4 text-center text-sm font-semibold text-forest-900">
                    {t.laadFout}
                  </p>
                )}
                <p className="mb-4 text-center text-sm text-forest-900">
                  {t.regels(regels.minNachten, regels.maxNachten, regels.dagenVooraf, regels.maandenVooruit)}
                </p>
                <AvailabilityCalendar
                  taal={taal}
                  instruction={KALENDER[taal].instructie}
                  nights={nights}
                  prijzen={prijzen}
                  isSelectable={isSelectable}
                  maxMonthsAhead={Math.max(0, regels.maandenVooruit - 1)}
                  selectedCheckIn={checkIn}
                  selectedCheckOut={checkOut}
                  onSelectDate={handleSelectDate}
                  onClearSelection={() => {
                    setCheckIn("");
                    setCheckOut("");
                  }}
                />
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-5 rounded-[2.5rem] border border-forest-700 bg-forest-600 p-6 shadow-lg shadow-forest-900/20 sm:grid-cols-2 sm:p-10"
              >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-bold text-forest-50">
              {t.naam}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder={t.naamPh}
              className="rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 placeholder:text-forest-700 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-bold text-forest-50">
              {t.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder={t.emailPh}
              className="rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 placeholder:text-forest-700 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkin" className="text-sm font-bold text-forest-50">
              {t.inchecken}
            </label>
            <input
              id="checkin"
              name="checkin"
              type="date"
              required
              min={earliest}
              max={latest}
              value={checkIn}
              onChange={(event) => setCheckIn(event.target.value)}
              className="rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkout" className="text-sm font-bold text-forest-50">
              {t.uitchecken}
            </label>
            <input
              id="checkout"
              name="checkout"
              type="date"
              required
              min={checkIn ? addDays(checkIn, regels.minNachten) : earliest}
              max={checkIn ? addDays(checkIn, regels.maxNachten) : undefined}
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
              className="rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="guests" className="text-sm font-bold text-forest-50">
              {t.personen}
            </label>
            <select
              id="guests"
              name="guests"
              required
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
              className="rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            >
              {[1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  {t.persoonOptie(n)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="dogs" className="text-sm font-bold text-forest-50">
              {t.honden}
            </label>
            <select
              id="dogs"
              name="dogs"
              value={dogs}
              onChange={(event) => setDogs(event.target.value)}
              className="rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            >
              <option value="0">{t.geenHond}</option>
              {[1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  {t.hondOptie(n, euroKort(prijzen.hond))}
                </option>
              ))}
            </select>
          </div>

          {pricing && (
            <div className="sm:col-span-2 rounded-[1.75rem] border border-sunset-200 bg-cream p-5">
              <h4 className="text-base font-bold text-forest-900">
                {t.prijsopbouw}
              </h4>
              {pricing.highNights > 0 && (
                <p
                  className="mt-3 flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-forest-900"
                  style={{ background: "#fbecc4" }}
                >
                  <span
                    className="mt-0.5 h-4 w-4 shrink-0 rounded-full"
                    style={{ background: HIGH_SEASON_COLOR }}
                  />
                  <span>{t.letOp(pricing.highNights, pricing.nights, euroKort(pricing.highRate))}</span>
                </p>
              )}
              <ul className="mt-3 space-y-1.5 text-sm text-forest-700">
                {pricing.lowNights > 0 && (
                  <li className="flex justify-between gap-4">
                    <span>{t.regelLaag(pricing.lowNights, euroKort(pricing.lowRate))}</span>
                    <span>€{euroKort(pricing.lowNights * pricing.lowRate)}</span>
                  </li>
                )}
                {pricing.highNights > 0 && (
                  <li className="-mx-2 flex justify-between gap-4 rounded-lg px-2 py-0.5 font-semibold text-forest-900" style={{ background: "#fbecc4" }}>
                    <span>{t.regelHoog(pricing.highNights, euroKort(pricing.highRate))}</span>
                    <span>€{euroKort(pricing.highNights * pricing.highRate)}</span>
                  </li>
                )}
                <li className="flex justify-between gap-4">
                  <span>{t.schoonmaakkosten}</span>
                  <span>€{euroKort(pricing.cleaningFee)}</span>
                </li>
                {pricing.dogs > 0 && (
                  <li className="flex justify-between gap-4">
                    <span>{t.hondenRegel}</span>
                    <span>€{euroKort(pricing.dogFee)}</span>
                  </li>
                )}
                <li className="flex justify-between gap-4">
                  <span>
                    {t.belastingRegel(pricing.guests, pricing.nights, formatEuro(pricing.touristTaxRate))}
                  </span>
                  <span>€{formatEuro(pricing.touristTax)}</span>
                </li>
              </ul>
              <div className="mt-3 flex justify-between border-t border-sunset-200 pt-3 text-base font-bold text-forest-900">
                <span>{t.totaal}</span>
                <span>€{formatEuro(pricing.total)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-bold text-forest-50">
              {t.telefoon}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder={t.telefoonPh}
              className="rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 placeholder:text-forest-700 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="message" className="text-sm font-bold text-forest-50">
              {t.bericht}
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder={t.berichtPh}
              className="resize-none rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 placeholder:text-forest-700 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <label className="flex items-start gap-3 text-sm font-semibold text-forest-50 sm:col-span-2">
            <input
              type="checkbox"
              checked={akkoord}
              onChange={(e) => setAkkoord(e.target.checked)}
              required
              className="mt-0.5 h-5 w-5 shrink-0 accent-sunset-500"
            />
            <span>
              {t.akkoordVoor}{" "}
              <a
                href={pad(taal, "algemene-voorwaarden/")}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {t.voorwaarden}
              </a>{" "}
              {t.enDe}{" "}
              <a href="#huisregels" className="underline">
                {t.huisregels}
              </a>
              .
            </span>
          </label>

          {boekModus === "test" && (
            <p className="sm:col-span-2 rounded-2xl bg-yellow-100 px-4 py-3 text-sm font-semibold text-yellow-900">
              {t.testmodus}
            </p>
          )}

          {status === "error" && (
            <p className="sm:col-span-2 rounded-2xl bg-sunset-100 px-4 py-3 text-sm font-semibold text-sunset-700">
              {errorMessage}
            </p>
          )}

          {status === "success" && summary && (
            <div className="sm:col-span-2 rounded-[1.75rem] border border-sunset-200 bg-cream p-5">
              <h4 className="text-base font-bold text-forest-900">
                {t.verzonden}
              </h4>
              <p className="mt-1 text-sm text-forest-700">
                {t.verblijf(formatDate(summary.checkIn), formatDate(summary.checkOut), summary.guests)}
              </p>

              {summary.pricing && (
                <>
                  <ul className="mt-3 space-y-1.5 text-sm text-forest-700">
                    {summary.pricing.lowNights > 0 && (
                      <li className="flex justify-between gap-4">
                        <span>{t.regelLaag(summary.pricing.lowNights, euroKort(summary.pricing.lowRate))}</span>
                        <span>
                          €{euroKort(summary.pricing.lowNights * summary.pricing.lowRate)}
                        </span>
                      </li>
                    )}
                    {summary.pricing.highNights > 0 && (
                      <li className="flex justify-between gap-4">
                        <span>{t.regelHoog(summary.pricing.highNights, euroKort(summary.pricing.highRate))}</span>
                        <span>
                          €
                          {euroKort(summary.pricing.highNights * summary.pricing.highRate)}
                        </span>
                      </li>
                    )}
                    <li className="flex justify-between gap-4">
                      <span>{t.schoonmaakkosten}</span>
                      <span>€{euroKort(summary.pricing.cleaningFee)}</span>
                    </li>
                    {summary.pricing.dogs > 0 && (
                      <li className="flex justify-between gap-4">
                        <span>{t.hondenRegel}</span>
                        <span>€{euroKort(summary.pricing.dogFee)}</span>
                      </li>
                    )}
                    <li className="flex justify-between gap-4">
                      <span>{t.belastingRegel(summary.pricing.guests, summary.pricing.nights)}</span>
                      <span>€{formatEuro(summary.pricing.touristTax)}</span>
                    </li>
                  </ul>
                  <div className="mt-3 flex justify-between border-t border-sunset-200 pt-3 text-base font-bold text-forest-900">
                    <span>{t.totaal}</span>
                    <span>€{formatEuro(summary.pricing.total)}</span>
                  </div>
                </>
              )}

              <p className="mt-4 text-sm text-forest-700">
                {t.binnen24}
              </p>
              <p className="mt-2 text-sm text-forest-700">
                {t.geenMailVoor} <strong>{CONTACT_EMAIL}</strong> {t.geenMailNa}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 rounded-full bg-sunset-500 px-7 py-3.5 text-base font-bold text-orange-50 shadow-lg shadow-sunset-500/30 transition hover:-translate-y-0.5 hover:bg-sunset-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:col-span-2"
          >
            {status === "sending"
              ? directBoeken
                ? t.bezigBetalen
                : t.bezig
              : directBoeken
                ? `${t.boekenBetalen}${pricing ? ` (€${formatEuro(pricing.total)})` : ""}`
                : t.aanvraagKnop}
          </button>
              </form>

            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
