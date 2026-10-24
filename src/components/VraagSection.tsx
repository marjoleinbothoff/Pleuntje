"use client";

import { useState } from "react";
import { CONTACT_EMAIL } from "@/data/contact";
import type { Taal } from "@/i18n/talen";

const T: Record<
  Taal,
  {
    kop: string;
    intro: string;
    dank: string;
    verstuurd: string;
    nogEen: string;
    naam: string;
    naamPh: string;
    email: string;
    emailPh: string;
    vraag: string;
    vraagPh: string;
    bezig: string;
    knop: string;
    privacy: string;
    fout: (mail: string) => string;
  }
> = {
  nl: {
    kop: "Een vraag?",
    intro: "Wil je eerst iets weten over Pleuntje, de omgeving of je hond? Stuur ons gerust een berichtje, ook als je (nog) niet boekt.",
    dank: "Dank je wel!",
    verstuurd: "Je vraag is verstuurd. We antwoorden zo snel mogelijk per mail.",
    nogEen: "Nog een vraag stellen",
    naam: "Naam",
    naamPh: "Jouw naam",
    email: "E-mailadres",
    emailPh: "jij@voorbeeld.nl",
    vraag: "Je vraag",
    vraagPh: "Typ hier je vraag",
    bezig: "Bezig met versturen…",
    knop: "Verstuur je vraag",
    privacy: "We gebruiken je gegevens alleen om je vraag te beantwoorden.",
    fout: (m) => `Het versturen lukte niet. Probeer het nog eens, of mail ons op ${m}.`,
  },
  de: {
    kop: "Eine Frage?",
    intro: "Möchtest du vorab etwas über Pleuntje, die Umgebung oder deinen Hund wissen? Schreib uns gern eine Nachricht, auch wenn du (noch) nicht buchst.",
    dank: "Vielen Dank!",
    verstuurd: "Deine Frage wurde gesendet. Wir antworten so schnell wie möglich per E-Mail.",
    nogEen: "Noch eine Frage stellen",
    naam: "Name",
    naamPh: "Dein Name",
    email: "E-Mail-Adresse",
    emailPh: "du@beispiel.de",
    vraag: "Deine Frage",
    vraagPh: "Schreib hier deine Frage",
    bezig: "Wird gesendet…",
    knop: "Frage senden",
    privacy: "Wir verwenden deine Daten nur, um deine Frage zu beantworten.",
    fout: (m) => `Das Senden hat nicht geklappt. Versuche es noch einmal oder schreib uns an ${m}.`,
  },
  en: {
    kop: "Any questions?",
    intro: "Would you like to know something about Pleuntje, the area or your dog first? Feel free to send us a message, even if you're not booking (yet).",
    dank: "Thank you!",
    verstuurd: "Your question has been sent. We'll reply by email as soon as possible.",
    nogEen: "Ask another question",
    naam: "Name",
    naamPh: "Your name",
    email: "Email address",
    emailPh: "you@example.com",
    vraag: "Your question",
    vraagPh: "Type your question here",
    bezig: "Sending…",
    knop: "Send your question",
    privacy: "We only use your details to answer your question.",
    fout: (m) => `Sending didn't work. Please try again, or email us at ${m}.`,
  },
  fr: {
    kop: "Une question ?",
    intro: "Vous souhaitez en savoir plus sur Pleuntje, les environs ou votre chien ? N'hésitez pas à nous écrire, même si vous ne réservez pas (encore).",
    dank: "Merci !",
    verstuurd: "Votre question a bien été envoyée. Nous vous répondrons par e-mail dès que possible.",
    nogEen: "Poser une autre question",
    naam: "Nom",
    naamPh: "Votre nom",
    email: "Adresse e-mail",
    emailPh: "vous@exemple.fr",
    vraag: "Votre question",
    vraagPh: "Écrivez votre question ici",
    bezig: "Envoi en cours…",
    knop: "Envoyer votre question",
    privacy: "Nous utilisons vos données uniquement pour répondre à votre question.",
    fout: (m) => `L'envoi n'a pas fonctionné. Veuillez réessayer, ou écrivez-nous à ${m}.`,
  },
};

// "Een vraag?": gasten kunnen zonder te boeken een vraag stellen.
// Via een klein formulier; public/api/vraag.php mailt het naar info@boshuispleuntje.nl. Geen telefoon/WhatsApp op de site: dat is haar privénummer.
export default function VraagSection({ taal }: { taal: Taal }) {
  const t = T[taal];
  const [status, setStatus] = useState<"idle" | "bezig" | "klaar" | "fout">("idle");

  async function verstuur(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("botcheck")) return; // spam
    setStatus("bezig");
    try {
      const response = await fetch("/api/vraag.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Pleuntje": "1" },
        body: JSON.stringify({
          naam: data.get("naam"),
          email: data.get("email"),
          vraag: data.get("vraag"),
          botcheck: data.get("botcheck") ? "1" : "",
          taal,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error("mislukt");
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
          <h2 className="text-4xl text-roest-donker">{t.kop}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-forest-800">
            {t.intro}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          {status === "klaar" ? (
            <div className="rounded-sm border border-forest-200 bg-white/60 p-6 text-forest-900">
              <p className="font-wordmark text-2xl font-semibold">{t.dank}</p>
              <p className="mt-2 leading-relaxed">{t.verstuurd}</p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-4 text-sm text-forest-700 underline underline-offset-4"
              >
                {t.nogEen}
              </button>
            </div>
          ) : (
            <form onSubmit={verstuur} className="grid gap-4">
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-semibold text-forest-900">
                  {t.naam}
                  <input name="naam" required autoComplete="name" placeholder={t.naamPh} className={veld} />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold text-forest-900">
                  {t.email}
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={t.emailPh}
                    className={veld}
                  />
                </label>
              </div>
              <label className="grid gap-1.5 text-sm font-semibold text-forest-900">
                {t.vraag}
                <textarea name="vraag" required rows={4} placeholder={t.vraagPh} className={veld} />
              </label>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <button
                  type="submit"
                  disabled={status === "bezig"}
                  className="min-h-12 rounded-sm bg-forest-700 px-7 py-3 font-medium text-cream transition-colors hover:bg-forest-800 disabled:opacity-60"
                >
                  {status === "bezig" ? t.bezig : t.knop}
                </button>
                <span className="text-sm text-forest-700">{t.privacy}</span>
              </div>
              {status === "fout" && (
                <p className="text-sm font-semibold text-booked" role="alert">
                  {t.fout(CONTACT_EMAIL)}
                </p>
              )}
            </form>
          )}

        </div>
      </div>
    </section>
  );
}
