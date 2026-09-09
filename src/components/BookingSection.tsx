"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "success" | "error";

export default function BookingSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [summary, setSummary] = useState<{
    checkIn: string;
    checkOut: string;
    guests: string;
  } | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const checkIn = String(data.get("checkin") ?? "");
    const checkOut = String(data.get("checkout") ?? "");
    const guests = String(data.get("guests") ?? "");

    if (checkIn && checkOut && checkOut <= checkIn) {
      setStatus("error");
      setErrorMessage("De uitcheckdatum moet na de incheckdatum liggen.");
      return;
    }

    setStatus("success");
    setErrorMessage("");
    setSummary({ checkIn, checkOut, guests });
    form.reset();
  }

  return (
    <section
      id="boeken"
      className="scroll-offset relative overflow-hidden px-4 py-20"
    >
      <div
        aria-hidden
        className="blob absolute -bottom-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 bg-forest-100/70"
      />

      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-100 px-4 py-1.5 text-sm font-bold text-forest-700">
            Boeken
          </span>
          <h2 className="mt-4 text-4xl font-bold text-forest-900">
            Plan jouw verblijf bij{" "}
            <span className="glossy-text" data-text="Pleun">
              Pleun
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-forest-700">
            Vul het formulier in en we nemen binnen 24 uur contact met je op
            om je boeking te bevestigen. Plek voor maximaal 3 personen.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-5 rounded-[2.5rem] border border-forest-100 bg-white p-6 shadow-lg shadow-forest-900/5 sm:grid-cols-2 sm:p-10"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-bold text-forest-800">
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
            <label htmlFor="email" className="text-sm font-bold text-forest-800">
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
            <label htmlFor="checkin" className="text-sm font-bold text-forest-800">
              Inchecken
            </label>
            <input
              id="checkin"
              name="checkin"
              type="date"
              required
              className="rounded-2xl border border-forest-200 bg-forest-50/50 px-4 py-3 text-forest-900 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkout" className="text-sm font-bold text-forest-800">
              Uitchecken
            </label>
            <input
              id="checkout"
              name="checkout"
              type="date"
              required
              className="rounded-2xl border border-forest-200 bg-forest-50/50 px-4 py-3 text-forest-900 focus:border-sunset-400 focus:ring-2 focus:ring-sunset-200 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="guests" className="text-sm font-bold text-forest-800">
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
            <label htmlFor="phone" className="text-sm font-bold text-forest-800">
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
            <label htmlFor="message" className="text-sm font-bold text-forest-800">
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
              Bedankt voor je aanvraag! We nemen snel contact met je op om je
              verblijf van {summary.checkIn || "?"} tot {summary.checkOut || "?"}{" "}
              voor {summary.guests} persoon/personen te bevestigen.
            </p>
          )}

          <button
            type="submit"
            className="mt-2 rounded-full bg-sunset-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-sunset-500/30 transition hover:-translate-y-0.5 hover:bg-sunset-600 sm:col-span-2"
          >
            Boekingsaanvraag versturen
          </button>
        </form>
      </div>
    </section>
  );
}
