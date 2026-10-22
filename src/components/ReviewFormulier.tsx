"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { pad, type Taal } from "@/i18n/talen";

const T = {
  nl: {
    naarSite: "Naar de site",
    laden: "Even geduld…",
    kop: "Review schrijven",
    ongeldig: "Deze link is niet geldig.",
    laadFout: "De pagina kon niet worden geladen. Probeer het later nog eens.",
    dank: "Dank je wel!",
    dankTekst: "Wat fijn dat je de tijd nam. We lezen je review en zetten hem daarna op de site.",
    voorbeeld: "Dit is een voorbeeld van wat gasten zien. Versturen kan hier niet.",
    hoeVond: (n?: string) => (n ? `Hoe vond je het, ${n}?` : "Hoe vond je het?"),
    intro: "We horen graag hoe je verblijf bij Pleuntje was.",
    sterrenVraag: "Hoeveel sterren geef je?",
    ster: (n: number) => `${n} ${n === 1 ? "ster" : "sterren"}`,
    review: "Je review",
    reviewPh: "Wat vond je van het huisje, de omgeving, je verblijf?",
    naam: "Naam bij je review",
    naamUitleg: "Bijvoorbeeld alleen je voornaam, of “Familie Jansen”.",
    toestemming: "Ik geef toestemming om mijn review, met de naam hierboven, op boshuispleuntje.nl te plaatsen.",
    eerstSterren: "Kies eerst hoeveel sterren je geeft.",
    voorbeeldNiet: "Dit is een voorbeeld; hier kun je niets versturen.",
    mislukt: "Versturen lukte niet. Probeer het nog eens.",
    alGedaan: "Je hebt al een review geschreven. Dank je wel!",
    bezig: "Bezig met versturen…",
    knop: "Review versturen",
  },
  de: {
    naarSite: "Zur Website",
    laden: "Einen Moment bitte…",
    kop: "Bewertung schreiben",
    ongeldig: "Dieser Link ist nicht (mehr) gültig.",
    laadFout: "Die Seite konnte nicht geladen werden. Bitte versuche es später noch einmal.",
    dank: "Vielen Dank!",
    dankTekst: "Schön, dass du dir die Zeit genommen hast. Wir lesen deine Bewertung und stellen sie danach auf die Website.",
    voorbeeld: "Dies ist ein Beispiel dessen, was Gäste sehen. Senden ist hier nicht möglich.",
    hoeVond: (n?: string) => (n ? `Wie hat es dir gefallen, ${n}?` : "Wie hat es dir gefallen?"),
    intro: "Wir würden gern hören, wie dein Aufenthalt bei Pleuntje war.",
    sterrenVraag: "Wie viele Sterne gibst du?",
    ster: (n: number) => `${n} ${n === 1 ? "Stern" : "Sterne"}`,
    review: "Deine Bewertung",
    reviewPh: "Wie fandest du das Haus, die Umgebung, deinen Aufenthalt?",
    naam: "Name unter deiner Bewertung",
    naamUitleg: "Zum Beispiel nur dein Vorname oder „Familie Müller“.",
    toestemming: "Ich bin damit einverstanden, dass meine Bewertung mit dem obigen Namen auf boshuispleuntje.nl veröffentlicht wird.",
    eerstSterren: "Wähle zuerst, wie viele Sterne du gibst.",
    voorbeeldNiet: "Dies ist ein Beispiel; hier kannst du nichts senden.",
    mislukt: "Das Senden hat nicht geklappt. Bitte versuche es noch einmal.",
    alGedaan: "Du hast bereits eine Bewertung geschrieben. Vielen Dank!",
    bezig: "Wird gesendet…",
    knop: "Bewertung senden",
  },
  en: {
    naarSite: "To the website",
    laden: "Just a moment…",
    kop: "Write a review",
    ongeldig: "This link is not (or no longer) valid.",
    laadFout: "The page could not be loaded. Please try again later.",
    dank: "Thank you!",
    dankTekst: "So kind of you to take the time. We'll read your review and then put it on the website.",
    voorbeeld: "This is an example of what guests see. You can't send anything from here.",
    hoeVond: (n?: string) => (n ? `How was your stay, ${n}?` : "How was your stay?"),
    intro: "We'd love to hear how your stay at Pleuntje was.",
    sterrenVraag: "How many stars would you give?",
    ster: (n: number) => `${n} ${n === 1 ? "star" : "stars"}`,
    review: "Your review",
    reviewPh: "What did you think of the cottage, the area, your stay?",
    naam: "Name shown with your review",
    naamUitleg: "For example just your first name, or “The Smith family”.",
    toestemming: "I agree to my review being published on boshuispleuntje.nl with the name above.",
    eerstSterren: "Please choose how many stars you'd like to give first.",
    voorbeeldNiet: "This is an example; you can't send anything here.",
    mislukt: "Sending didn't work. Please try again.",
    alGedaan: "You have already written a review. Thank you!",
    bezig: "Sending…",
    knop: "Send review",
  },
  fr: {
    naarSite: "Vers le site",
    laden: "Un instant…",
    kop: "Écrire un avis",
    ongeldig: "Ce lien n'est pas (ou plus) valide.",
    laadFout: "La page n'a pas pu être chargée. Veuillez réessayer plus tard.",
    dank: "Merci !",
    dankTekst: "Merci d'avoir pris le temps. Nous lirons votre avis puis le publierons sur le site.",
    voorbeeld: "Ceci est un exemple de ce que voient les hôtes. L'envoi n'est pas possible ici.",
    hoeVond: (n?: string) => (n ? `Comment s'est passé votre séjour, ${n} ?` : "Comment s'est passé votre séjour ?"),
    intro: "Nous aimerions savoir comment s'est passé votre séjour chez Pleuntje.",
    sterrenVraag: "Combien d'étoiles donnez-vous ?",
    ster: (n: number) => `${n} ${n === 1 ? "étoile" : "étoiles"}`,
    review: "Votre avis",
    reviewPh: "Qu'avez-vous pensé du chalet, des environs, de votre séjour ?",
    naam: "Nom affiché avec votre avis",
    naamUitleg: "Par exemple uniquement votre prénom, ou « Famille Dupont ».",
    toestemming: "J'accepte que mon avis soit publié sur boshuispleuntje.nl avec le nom ci-dessus.",
    eerstSterren: "Choisissez d'abord combien d'étoiles vous donnez.",
    voorbeeldNiet: "Ceci est un exemple ; vous ne pouvez rien envoyer ici.",
    mislukt: "L'envoi n'a pas fonctionné. Veuillez réessayer.",
    alGedaan: "Vous avez déjà écrit un avis. Merci !",
    bezig: "Envoi en cours…",
    knop: "Envoyer l'avis",
  },
} satisfies Record<Taal, unknown>;

// Pagina waar een gast via de persoonlijke link uit de vertrekmail een review schrijft.

type Uitnodiging =
  | { toestand: "laden" }
  | { toestand: "voorbeeld" }
  | { toestand: "ongeldig"; fout: string }
  | { toestand: "geldig"; voornaam: string };

const veld =
  "mt-1 w-full rounded-2xl border border-forest-300 bg-white px-4 py-3 text-lg text-forest-900 outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-300";

export default function ReviewFormulier({ taal }: { taal: Taal }) {
  const t = T[taal];
  const [uitnodiging, setUitnodiging] = useState<Uitnodiging>({ toestand: "laden" });
  const [params, setParams] = useState({ b: "", t: "" });
  const [sterren, setSterren] = useState(0);
  const [naam, setNaam] = useState("");
  const [tekst, setTekst] = useState("");
  const [toestemming, setToestemming] = useState(false);
  const [fout, setFout] = useState("");
  const [bezig, setBezig] = useState(false);
  const [klaar, setKlaar] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const b = p.get("b") ?? "";
    const t = p.get("t") ?? "";
    let actief = true;
    if (p.get("voorbeeld")) {
      Promise.resolve().then(() => actief && setUitnodiging({ toestand: "voorbeeld" }));
      return () => {
        actief = false;
      };
    }
    fetch(`/api/review.php?b=${encodeURIComponent(b)}&t=${encodeURIComponent(t)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!actief) return;
        setParams({ b, t });
        if (d.geldig) {
          setUitnodiging({ toestand: "geldig", voornaam: d.voornaam });
          setNaam(d.voornaam ?? "");
        } else {
          // De server spreekt Nederlands; in de andere talen een eigen vertaalde melding
          const melding = taal === "nl" ? d.fout ?? t.ongeldig : d.alGedaan ? t.alGedaan : t.ongeldig;
          setUitnodiging({ toestand: "ongeldig", fout: melding });
        }
      })
      .catch(() => actief && setUitnodiging({ toestand: "ongeldig", fout: t.laadFout }));
    return () => {
      actief = false;
    };
  }, [t, taal]);

  async function verstuur(e: FormEvent) {
    e.preventDefault();
    setFout("");
    if (sterren === 0) return setFout(t.eerstSterren);
    if (uitnodiging.toestand === "voorbeeld") return setFout(t.voorbeeldNiet);
    setBezig(true);
    try {
      const r = await fetch("/api/review.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Pleuntje": "1" },
        body: JSON.stringify({ ...params, sterren, naam, tekst, toestemming }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) {
        const melding =
          taal === "nl" && typeof d.fout === "string" ? d.fout : r.status === 409 ? t.alGedaan : t.mislukt;
        throw new Error(melding);
      }
      setKlaar(true);
    } catch (err) {
      setFout((err as Error).message);
    } finally {
      setBezig(false);
    }
  }

  const formulier = uitnodiging.toestand === "geldig" || uitnodiging.toestand === "voorbeeld";

  return (
    <>
      <header className="px-4 pt-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between rounded-3xl border border-forest-700/60 bg-forest-600/95 px-5 py-4 text-cream shadow-sm shadow-forest-900/20">
          <Link href={pad(taal)} className="flex items-center gap-3">
            <Image src="/photos/logo.png" alt="Pleuntje" width={44} height={44} className="h-11 w-11 rounded-full" />
            <span className="font-bold">Pleuntje</span>
          </Link>
          <Link href={pad(taal)} className="rounded-full bg-sunset-100 px-4 py-2 text-sm font-bold text-forest-900 transition hover:bg-sunset-200">
            {t.naarSite}
          </Link>
        </div>
      </header>
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-forest-200 bg-white/70 p-7 shadow-sm">
          {uitnodiging.toestand === "laden" && <p className="text-lg text-forest-900">{t.laden}</p>}

          {uitnodiging.toestand === "ongeldig" && (
            <>
              <h1 className="text-3xl text-forest-900">{t.kop}</h1>
              <p className="mt-3 text-lg text-forest-900">{uitnodiging.fout}</p>
            </>
          )}

          {klaar && (
            <div className="text-center">
              <div className="text-5xl">💛</div>
              <h1 className="mt-3 text-3xl text-forest-900">{t.dank}</h1>
              <p className="mt-3 text-lg text-forest-900">{t.dankTekst}</p>
            </div>
          )}

          {formulier && !klaar && (
            <form onSubmit={verstuur}>
              {uitnodiging.toestand === "voorbeeld" && (
                <p className="mb-4 rounded-2xl bg-yellow-100 p-3 text-sm font-semibold text-yellow-900">
                  {t.voorbeeld}
                </p>
              )}
              <h1 className="text-3xl text-forest-900">
                {t.hoeVond(uitnodiging.toestand === "geldig" ? uitnodiging.voornaam : undefined)}
              </h1>
              <p className="mt-2 text-lg text-forest-900">{t.intro}</p>

              <fieldset className="mt-6">
                <legend className="text-lg font-semibold text-forest-900">{t.sterrenVraag}</legend>
                <div className="mt-2 flex gap-1" role="radiogroup">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={sterren === n}
                      aria-label={t.ster(n)}
                      onClick={() => setSterren(n)}
                      className={`cursor-pointer text-5xl leading-none transition ${n <= sterren ? "text-sunset-500" : "text-forest-200 hover:text-sunset-200"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="mt-6 block text-lg font-semibold text-forest-900">
                {t.review}
                <textarea
                  className={`${veld} min-h-40`}
                  value={tekst}
                  onChange={(e) => setTekst(e.target.value)}
                  maxLength={2000}
                  placeholder={t.reviewPh}
                  required
                />
              </label>

              <label className="mt-5 block text-lg font-semibold text-forest-900">
                {t.naam}
                <input className={veld} value={naam} onChange={(e) => setNaam(e.target.value)} maxLength={40} required />
                <span className="mt-1 block text-sm font-normal text-forest-800">
                  {t.naamUitleg}
                </span>
              </label>

              <label className="mt-5 flex items-start gap-3 text-base text-forest-900">
                <input
                  type="checkbox"
                  checked={toestemming}
                  onChange={(e) => setToestemming(e.target.checked)}
                  required
                  className="mt-1 h-5 w-5 shrink-0 accent-sunset-500"
                />
                <span>
                  {t.toestemming}
                </span>
              </label>

              {fout && <p role="alert" className="mt-4 rounded-2xl bg-red-100 p-4 font-semibold text-red-900">{fout}</p>}

              <button
                type="submit"
                disabled={bezig}
                className="mt-6 w-full cursor-pointer rounded-full bg-sunset-500 px-7 py-3.5 text-base font-bold text-orange-50 shadow-lg shadow-sunset-500/30 transition hover:bg-sunset-600 disabled:opacity-60"
              >
                {bezig ? t.bezig : t.knop}
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
