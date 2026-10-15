"use client";

import { useState } from "react";
import { WEB3FORMS_ACCESS_KEY } from "@/data/contact";

// "Een vraag?": gasten kunnen zonder te boeken een vraag stellen.
// Via een klein formulier (komt als mail bij Marjolein binnen, via Web3Forms, net als de
// boekingsaanvragen). Geen telefoon/WhatsApp op de site: dat is haar privénummer.
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

        <div className="mx-auto mt-10 max-w-2xl">
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
                  Het versturen lukte niet. Probeer het nog eens, of mail ons rechtstreeks.
                </p>
              )}
            </form>
          )}

        </div>
      </div>
    </section>
  );
}
