"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { bookedDates } from "@/data/availability";
import { WEB3FORMS_ACCESS_KEY } from "@/data/contact";
import { calculateTotal, formatEuro } from "@/lib/pricing";

type Status = "idle" | "sending" | "success" | "error";

function formatDate(iso: string) {
  if (!iso) return "?";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

function overlapsBookedDates(checkIn: string, checkOut: string) {
  const booked = new Set(bookedDates);
  const cursor = new Date(checkIn);
  const end = new Date(checkOut);
  while (cursor < end) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    if (booked.has(`${y}-${m}-${d}`)) return true;
    cursor.setDate(cursor.getDate() + 1);
  }
  return false;
}

export default function BookingSection() {
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

  const pricing = calculateTotal(checkIn, checkOut, Number(dogs), Number(guests));

  useEffect(() => {
    function checkHash() {
      if (window.location.hash === "#boeken") setOpen(true);
    }
    function handleClick(event: MouseEvent) {
      const target = (event.target as HTMLElement)?.closest(
        'a[href="#boeken"]',
      );
      if (target) setOpen(true);
    }
    checkHash();
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

    if (!checkIn || checkOut || iso <= checkIn) {
      setCheckIn(iso);
      setCheckOut("");
      return;
    }

    if (overlapsBookedDates(checkIn, iso)) {
      setErrorMessage(
        "Daar zit een bezette dag tussen. Kies een andere periode.",
      );
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
      setErrorMessage("De uitcheckdatum moet na de incheckdatum liggen.");
      return;
    }

    if (checkIn && checkOut && overlapsBookedDates(checkIn, checkOut)) {
      setStatus("error");
      setErrorMessage(
        "Helaas, in die periode is Pleuntje al bezet. Kies een andere periode — check de kalender hierboven voor de vrije dagen.",
      );
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `Boekingsaanvraag Pleuntje: ${checkIn} t/m ${checkOut}`,
      Naam: name,
      "E-mail": email,
      Telefoon: phone || "-",
      Inchecken: checkIn,
      Uitchecken: checkOut,
      "Aantal personen": guests,
      "Aantal honden": dogs,
      Totaalbedrag: pricing
        ? `€${formatEuro(pricing.total)} (${pricing.nights} nachten, incl. €${formatEuro(pricing.touristTax)} toeristenbelasting)`
        : "-",
      Bericht: message || "-",
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.success) throw new Error("Versturen mislukt");

      setStatus("success");
      setSummary({
        checkIn,
        checkOut,
        guests,
        pricing,
      });
      form.reset();
      setCheckIn("");
      setCheckOut("");
      setDogs("0");
      setGuests("1");
    } catch {
      setStatus("error");
      setErrorMessage(
        "Er ging iets mis bij het versturen. Probeer het nog eens, of bel of mail ons rechtstreeks.",
      );
    }
  }

  return (
    <section
      id="boeken"
      className="scroll-offset relative overflow-hidden px-4 py-20"
    >
      <div className="relative mx-auto max-w-xl text-center">
        <h2 className="text-4xl font-bold text-forest-900">
          Plan jouw verblijf bij{" "}
          <span className="glossy-text" data-text="Pleuntje">
            Pleuntje
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-8 mb-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-sunset-100 px-4 py-1.5 text-sm font-bold text-forest-900"
        >
          Boeken
        </button>
        <p className="text-lg text-forest-900">
          Bekijk de tarieven, check de beschikbaarheid en vul het formulier
          in. Plek voor maximaal 3 volwassenen.
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
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2.5rem] bg-cream p-6 shadow-lg sm:p-10"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-forest-900">
                Plan jouw verblijf bij Pleuntje
              </h3>

              <div className="mt-6 rounded-[2rem] border border-forest-700 bg-forest-600 p-6 shadow-sm shadow-forest-900/20 sm:p-8">
                <h4 className="text-xl font-bold text-cream">Tarieven</h4>
                <ul className="mt-4 space-y-2 text-cream">
                  <li>Laagseizoen: €105 per nacht</li>
                  <li>Hoogseizoen: €115 per nacht</li>
                  <li>Eenmalig €50 schoonmaakkosten per verblijf</li>
                  <li>Honden: €18 per verblijf (maximaal 3 honden)</li>
                  <li>Toeristenbelasting: €1,79 per persoon per nacht</li>
                  <li>Minimaal 2 nachten boeken</li>
                  <li>Maximaal 3 volwassenen</li>
                  <li>Beddengoed is aanwezig, de bedden worden opgemaakt</li>
                  <li>Handdoeken aanwezig, ook theedoeken in de keuken</li>
                </ul>
              </div>

              <div className="mt-6">
                <AvailabilityCalendar
                  selectedCheckIn={checkIn}
                  selectedCheckOut={checkOut}
                  onSelectDate={handleSelectDate}
                />
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-5 rounded-[2.5rem] border border-forest-700 bg-forest-600 p-6 shadow-lg shadow-forest-900/20 sm:grid-cols-2 sm:p-10"
              >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-bold text-forest-50">
              Naam
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Jouw naam"
              className="rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 placeholder:text-forest-700 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-bold text-forest-50">
              E-mailadres
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="jij@voorbeeld.nl"
              className="rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 placeholder:text-forest-700 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkin" className="text-sm font-bold text-forest-50">
              Inchecken
            </label>
            <input
              id="checkin"
              name="checkin"
              type="date"
              required
              value={checkIn}
              onChange={(event) => setCheckIn(event.target.value)}
              className="rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkout" className="text-sm font-bold text-forest-50">
              Uitchecken
            </label>
            <input
              id="checkout"
              name="checkout"
              type="date"
              required
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
              className="rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="guests" className="text-sm font-bold text-forest-50">
              Aantal volwassenen
            </label>
            <select
              id="guests"
              name="guests"
              required
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
              className="rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            >
              <option value="1">1 volwassene</option>
              <option value="2">2 volwassenen</option>
              <option value="3">3 volwassenen</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="dogs" className="text-sm font-bold text-forest-50">
              Aantal honden
            </label>
            <select
              id="dogs"
              name="dogs"
              value={dogs}
              onChange={(event) => setDogs(event.target.value)}
              className="rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            >
              <option value="0">Geen hond</option>
              <option value="1">1 hond (+€18)</option>
              <option value="2">2 honden (+€18)</option>
              <option value="3">3 honden (+€18)</option>
            </select>
          </div>

          {pricing && (
            <div className="sm:col-span-2 rounded-[1.75rem] border border-sunset-200 bg-cream p-5">
              <h4 className="text-base font-bold text-forest-900">
                Prijsopbouw
              </h4>
              <ul className="mt-3 space-y-1.5 text-sm text-forest-700">
                {pricing.lowNights > 0 && (
                  <li className="flex justify-between gap-4">
                    <span>
                      {pricing.lowNights}{" "}
                      {pricing.lowNights === 1 ? "nacht" : "nachten"}{" "}
                      laagseizoen à €{pricing.lowRate}
                    </span>
                    <span>€{pricing.lowNights * pricing.lowRate}</span>
                  </li>
                )}
                {pricing.highNights > 0 && (
                  <li className="flex justify-between gap-4">
                    <span>
                      {pricing.highNights}{" "}
                      {pricing.highNights === 1 ? "nacht" : "nachten"}{" "}
                      hoogseizoen à €{pricing.highRate}
                    </span>
                    <span>€{pricing.highNights * pricing.highRate}</span>
                  </li>
                )}
                <li className="flex justify-between gap-4">
                  <span>Schoonmaakkosten</span>
                  <span>€{pricing.cleaningFee}</span>
                </li>
                {pricing.dogs > 0 && (
                  <li className="flex justify-between gap-4">
                    <span>Honden</span>
                    <span>€{pricing.dogFee}</span>
                  </li>
                )}
                <li className="flex justify-between gap-4">
                  <span>
                    Toeristenbelasting ({pricing.guests}{" "}
                    {pricing.guests === 1 ? "persoon" : "personen"} ×{" "}
                    {pricing.nights}{" "}
                    {pricing.nights === 1 ? "nacht" : "nachten"} à €
                    {formatEuro(pricing.touristTaxRate)})
                  </span>
                  <span>€{formatEuro(pricing.touristTax)}</span>
                </li>
              </ul>
              <div className="mt-3 flex justify-between border-t border-sunset-200 pt-3 text-base font-bold text-forest-900">
                <span>Totaal</span>
                <span>€{formatEuro(pricing.total)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-bold text-forest-50">
              Telefoonnummer (optioneel)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="06 12345678"
              className="rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 placeholder:text-forest-700 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="message" className="text-sm font-bold text-forest-50">
              Bericht (optioneel)
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Vertel ons iets over je verblijf..."
              className="resize-none rounded-2xl border border-forest-200 bg-cream/80 px-4 py-3 text-forest-900 placeholder:text-forest-700 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          {status === "error" && (
            <p className="sm:col-span-2 rounded-2xl bg-sunset-100 px-4 py-3 text-sm font-semibold text-sunset-700">
              {errorMessage}
            </p>
          )}

          {status === "success" && summary && (
            <div className="sm:col-span-2 rounded-[1.75rem] border border-sunset-200 bg-cream p-5">
              <h4 className="text-base font-bold text-forest-900">
                Boekingsaanvraag verstuurd!
              </h4>
              <p className="mt-1 text-sm text-forest-700">
                Verblijf van {formatDate(summary.checkIn)} tot{" "}
                {formatDate(summary.checkOut)} voor {summary.guests}{" "}
                persoon/personen.
              </p>

              {summary.pricing && (
                <>
                  <ul className="mt-3 space-y-1.5 text-sm text-forest-700">
                    {summary.pricing.lowNights > 0 && (
                      <li className="flex justify-between gap-4">
                        <span>
                          {summary.pricing.lowNights}{" "}
                          {summary.pricing.lowNights === 1
                            ? "nacht"
                            : "nachten"}{" "}
                          laagseizoen à €{summary.pricing.lowRate}
                        </span>
                        <span>
                          €{summary.pricing.lowNights * summary.pricing.lowRate}
                        </span>
                      </li>
                    )}
                    {summary.pricing.highNights > 0 && (
                      <li className="flex justify-between gap-4">
                        <span>
                          {summary.pricing.highNights}{" "}
                          {summary.pricing.highNights === 1
                            ? "nacht"
                            : "nachten"}{" "}
                          hoogseizoen à €{summary.pricing.highRate}
                        </span>
                        <span>
                          €
                          {summary.pricing.highNights *
                            summary.pricing.highRate}
                        </span>
                      </li>
                    )}
                    <li className="flex justify-between gap-4">
                      <span>Schoonmaakkosten</span>
                      <span>€{summary.pricing.cleaningFee}</span>
                    </li>
                    {summary.pricing.dogs > 0 && (
                      <li className="flex justify-between gap-4">
                        <span>Honden</span>
                        <span>€{summary.pricing.dogFee}</span>
                      </li>
                    )}
                    <li className="flex justify-between gap-4">
                      <span>
                        Toeristenbelasting ({summary.pricing.guests}{" "}
                        {summary.pricing.guests === 1 ? "persoon" : "personen"}{" "}
                        × {summary.pricing.nights}{" "}
                        {summary.pricing.nights === 1 ? "nacht" : "nachten"})
                      </span>
                      <span>€{formatEuro(summary.pricing.touristTax)}</span>
                    </li>
                  </ul>
                  <div className="mt-3 flex justify-between border-t border-sunset-200 pt-3 text-base font-bold text-forest-900">
                    <span>Totaal</span>
                    <span>€{formatEuro(summary.pricing.total)}</span>
                  </div>
                </>
              )}

              <p className="mt-4 text-sm text-forest-700">
                We nemen binnen 24 uur contact met je op en sturen je dan een
                betaallink om je boeking te bevestigen.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 rounded-full bg-sunset-500 px-7 py-3.5 text-base font-bold text-orange-50 shadow-lg shadow-sunset-500/30 transition hover:-translate-y-0.5 hover:bg-sunset-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:col-span-2"
          >
            {status === "sending"
              ? "Bezig met versturen..."
              : "Boekingsaanvraag versturen"}
          </button>
              </form>

              <p className="mt-4 text-center text-xs text-forest-700">
                Tot 4 weken voor aankomst gratis annuleren. Daarna geen
                terugbetaling.
              </p>
              <p className="mx-auto mt-2 max-w-xl text-center text-xs text-forest-700">
                Pleuntje is uitsluitend bedoeld voor recreatief verblijf.
                Verblijf voor woon- of werkdoeleinden is niet toegestaan.
                Blijkt dit toch het geval, dan dien je direct te vertrekken,
                zonder restitutie.
              </p>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
