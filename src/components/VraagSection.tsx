"use client";

import { useState } from "react";
import { CONTACT_PHONE_HREF, WEB3FORMS_ACCESS_KEY } from "@/data/contact";

// "Een vraag?": gasten kunnen zonder te boeken een vraag stellen.
// Via een klein formulier (komt als mail bij Marjolein binnen, via Web3Forms, net als de
// boekingsaanvragen) of met één tik via WhatsApp.
const whatsappLink = `https://wa.me/${CONTACT_PHONE_HREF.replace("+", "")}?text=${encodeURIComponent(
  "Hallo Marjolein, ik heb een vraag over Pleuntje: ",
)}`;

export default function VraagSection() {
  const [status, setStatus] = useState<"idle" | "bezig" | "klaar" | "fout">("idle");

  async function verstuur(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("botcheck")) return; // spam
    setStatus("bezig");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Vraag over Pleuntje van ${data.get("naam")}`,
          from_name: "boshuispleuntje.nl",
          replyto: data.get("email"),
          Naam: data.get("naam"),
          "E-mail": data.get("email"),
          Vraag: data.get("vraag"),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error("mislukt");
      form.reset();
      setStatus("klaar");
    } catch {
      setStatus("fout");
    }
  }

  const veld =
    "w-full rounded-sm border border-forest-200 bg-white/70 px-4 py-3 text-forest-900 placeholder:text-forest-400 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 focus:outline-none";

  return (
    <section id="vraag" className="scroll-offset px-5 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-4xl text-forest-900">Een vraag?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-forest-800">
            Wil je eerst iets weten over Pleuntje, de omgeving of je hond? Stuur ons
            gerust een berichtje, ook als je (nog) niet boekt.
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-[1fr_auto_14rem] sm:items-start">
          {status === "klaar" ? (
            <div className="rounded-sm border border-forest-200 bg-white/60 p-6 text-forest-900">
              <p className="font-wordmark text-2xl font-semibold">Dank je wel!</p>
              <p className="mt-2 leading-relaxed">
                Je vraag is verstuurd. We antwoorden zo snel mogelijk per mail.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-4 text-sm text-forest-700 underline underline-offset-4"
              >
                Nog een vraag stellen
              </button>
            </div>
          ) : (
            <form onSubmit={verstuur} className="grid gap-4">
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-semibold text-forest-900">
                  Naam
                  <input name="naam" required autoComplete="name" placeholder="Jouw naam" className={veld} />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold text-forest-900">
                  E-mailadres
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="jij@voorbeeld.nl"
                    className={veld}
                  />
                </label>
              </div>
              <label className="grid gap-1.5 text-sm font-semibold text-forest-900">
                Je vraag
                <textarea name="vraag" required rows={4} placeholder="Typ hier je vraag" className={veld} />
              </label>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <button
                  type="submit"
                  disabled={status === "bezig"}
                  className="min-h-12 rounded-sm bg-forest-700 px-7 py-3 font-medium text-cream transition-colors hover:bg-forest-800 disabled:opacity-60"
                >
                  {status === "bezig" ? "Bezig met versturen…" : "Verstuur je vraag"}
                </button>
                <span className="text-sm text-forest-700">We gebruiken je gegevens alleen om je vraag te beantwoorden.</span>
              </div>
              {status === "fout" && (
                <p className="text-sm font-semibold text-booked" role="alert">
                  Het versturen lukte niet. Probeer het nog eens, of stuur ons een WhatsApp-bericht.
                </p>
              )}
            </form>
          )}

          <div className="hidden h-full items-center sm:flex" aria-hidden>
            <span className="h-full w-px bg-forest-200" />
          </div>

          <div className="text-center sm:pt-7 sm:text-left">
            <p className="text-sm font-semibold text-forest-900">Liever even appen?</p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-12 items-center gap-2.5 rounded-sm border border-forest-700 px-5 py-3 font-medium text-forest-800 transition-colors hover:bg-forest-700 hover:text-cream"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.6 18.7z" />
                <path d="M9 9.2c0 2.8 2.6 5.6 5.6 5.8l1-1.3-1.7-1-.9.8c-1-.4-1.9-1.3-2.4-2.3l.8-.9-1-1.7z" />
              </svg>
              Stuur een WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
