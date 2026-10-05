"use client";

import { useState, type FormEvent } from "react";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { bookedDates } from "@/data/availability";
import { WEB3FORMS_ACCESS_KEY } from "@/data/contact";

type Status = "idle" | "sending" | "success" | "error";

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
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [summary, setSummary] = useState<{
    checkIn: string;
    checkOut: string;
    guests: string;
  } | null>(null);

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
      setSummary({ checkIn, checkOut, guests });
      form.reset();
      setCheckIn("");
      setCheckOut("");
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
      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sunset-100 px-4 py-1.5 text-sm font-bold text-sunset-700">
            Boeken
          </span>
          <h2 className="mt-8 text-4xl font-bold text-forest-900">
            Plan jouw verblijf bij{" "}
            <span className="glossy-text" data-text="Pleuntje">
              Pleuntje
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-forest-900">
            Vul het formulier in en we nemen binnen 24 uur contact met je op
            om je boeking te bevestigen. Plek voor maximaal 3 personen.
          </p>
        </div>

        <div className="mt-10">
          <AvailabilityCalendar
            selectedCheckIn={checkIn}
            selectedCheckOut={checkOut}
            onSelectDate={handleSelectDate}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-5 rounded-[2.5rem] border border-forest-100 bg-white p-6 shadow-lg shadow-forest-900/5 sm:grid-cols-2 sm:p-10"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-bold text-forest-900">
              Naam
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Jouw naam"
              className="rounded-2xl border border-forest-200 bg-forest-50/50 px-4 py-3 text-forest-900 placeholder:text-forest-400 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-bold text-forest-900">
              E-mailadres
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="jij@voorbeeld.nl"
              className="rounded-2xl border border-forest-200 bg-forest-50/50 px-4 py-3 text-forest-900 placeholder:text-forest-400 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkin" className="text-sm font-bold text-forest-900">
              Inchecken
            </label>
            <input
              id="checkin"
              name="checkin"
              type="date"
              required
              value={checkIn}
              onChange={(event) => setCheckIn(event.target.value)}
              className="rounded-2xl border border-forest-200 bg-forest-50/50 px-4 py-3 text-forest-900 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkout" className="text-sm font-bold text-forest-900">
              Uitchecken
            </label>
            <input
              id="checkout"
              name="checkout"
              type="date"
              required
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
              className="rounded-2xl border border-forest-200 bg-forest-50/50 px-4 py-3 text-forest-900 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="guests" className="text-sm font-bold text-forest-900">
              Aantal personen
            </label>
            <select
              id="guests"
              name="guests"
              required
              defaultValue="1"
              className="rounded-2xl border border-forest-200 bg-forest-50/50 px-4 py-3 text-forest-900 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            >
              <option value="1">1 persoon</option>
              <option value="2">2 personen</option>
              <option value="3">3 personen</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-bold text-forest-900">
              Telefoonnummer (optioneel)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="06 12345678"
              className="rounded-2xl border border-forest-200 bg-forest-50/50 px-4 py-3 text-forest-900 placeholder:text-forest-400 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="message" className="text-sm font-bold text-forest-900">
              Bericht (optioneel)
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Vertel ons iets over je verblijf..."
              className="resize-none rounded-2xl border border-forest-200 bg-forest-50/50 px-4 py-3 text-forest-900 placeholder:text-forest-400 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          {status === "error" && (
            <p className="sm:col-span-2 rounded-2xl bg-sunset-100 px-4 py-3 text-sm font-semibold text-sunset-700">
              {errorMessage}
            </p>
          )}

          {status === "success" && summary && (
            <p className="sm:col-span-2 rounded-2xl bg-forest-100 px-4 py-3 text-sm font-semibold text-forest-700">
              Gelukt! Je boekingsaanvraag voor het verblijf van{" "}
              {summary.checkIn || "?"} tot {summary.checkOut || "?"} voor{" "}
              {summary.guests} persoon/personen is verstuurd. We nemen binnen
              24 uur contact met je op.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 rounded-full bg-sunset-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-sunset-500/30 transition hover:-translate-y-0.5 hover:bg-sunset-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:col-span-2"
          >
            {status === "sending"
              ? "Bezig met versturen..."
              : "Boekingsaanvraag versturen"}
          </button>
        </form>
      </div>
    </section>
  );
}
