"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

// Pagina waar een gast via de persoonlijke link uit de vertrekmail een review schrijft.

type Uitnodiging =
  | { toestand: "laden" }
  | { toestand: "voorbeeld" }
  | { toestand: "ongeldig"; fout: string }
  | { toestand: "geldig"; voornaam: string };

const veld =
  "mt-1 w-full rounded-2xl border border-forest-300 bg-white px-4 py-3 text-lg text-forest-900 outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-300";

export default function ReviewFormulier() {
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
          setUitnodiging({ toestand: "ongeldig", fout: d.fout ?? "Deze link is niet geldig." });
        }
      })
      .catch(() => actief && setUitnodiging({ toestand: "ongeldig", fout: "De pagina kon niet worden geladen. Probeer het later nog eens." }));
    return () => {
      actief = false;
    };
  }, []);

  async function verstuur(e: FormEvent) {
    e.preventDefault();
    setFout("");
    if (sterren === 0) return setFout("Kies eerst hoeveel sterren je geeft.");
    if (uitnodiging.toestand === "voorbeeld") return setFout("Dit is een voorbeeld; hier kun je niets versturen.");
    setBezig(true);
    try {
      const r = await fetch("/api/review.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Pleuntje": "1" },
        body: JSON.stringify({ ...params, sterren, naam, tekst, toestemming }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) throw new Error(typeof d.fout === "string" ? d.fout : "Versturen lukte niet. Probeer het nog eens.");
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
          <Link href="/" className="flex items-center gap-3">
            <Image src="/photos/logo.png" alt="Pleuntje" width={44} height={44} className="h-11 w-11 rounded-full" />
            <span className="font-bold">Pleuntje</span>
          </Link>
          <Link href="/" className="rounded-full bg-sunset-100 px-4 py-2 text-sm font-bold text-forest-900 transition hover:bg-sunset-200">
            Naar de site
          </Link>
        </div>
      </header>
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-forest-200 bg-white/70 p-7 shadow-sm">
          {uitnodiging.toestand === "laden" && <p className="text-lg text-forest-900">Even geduld…</p>}

          {uitnodiging.toestand === "ongeldig" && (
            <>
              <h1 className="text-3xl text-forest-900">Review schrijven</h1>
              <p className="mt-3 text-lg text-forest-900">{uitnodiging.fout}</p>
            </>
          )}

          {klaar && (
            <div className="text-center">
              <div className="text-5xl">💛</div>
              <h1 className="mt-3 text-3xl text-forest-900">Dank je wel!</h1>
              <p className="mt-3 text-lg text-forest-900">
                Wat fijn dat je de tijd nam. We lezen je review en zetten hem daarna op de site.
              </p>
            </div>
          )}

          {formulier && !klaar && (
            <form onSubmit={verstuur}>
              {uitnodiging.toestand === "voorbeeld" && (
                <p className="mb-4 rounded-2xl bg-yellow-100 p-3 text-sm font-semibold text-yellow-900">
                  Dit is een voorbeeld van wat gasten zien. Versturen kan hier niet.
                </p>
              )}
              <h1 className="text-3xl text-forest-900">
                {uitnodiging.toestand === "geldig" && uitnodiging.voornaam
                  ? `Hoe vond je het, ${uitnodiging.voornaam}?`
                  : "Hoe vond je het?"}
              </h1>
              <p className="mt-2 text-lg text-forest-900">We horen graag hoe je verblijf bij Pleuntje was.</p>

              <fieldset className="mt-6">
                <legend className="text-lg font-semibold text-forest-900">Hoeveel sterren geef je?</legend>
                <div className="mt-2 flex gap-1" role="radiogroup">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={sterren === n}
                      aria-label={`${n} ${n === 1 ? "ster" : "sterren"}`}
                      onClick={() => setSterren(n)}
                      className={`cursor-pointer text-5xl leading-none transition ${n <= sterren ? "text-sunset-500" : "text-forest-200 hover:text-sunset-200"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="mt-6 block text-lg font-semibold text-forest-900">
                Je review
                <textarea
                  className={`${veld} min-h-40`}
                  value={tekst}
                  onChange={(e) => setTekst(e.target.value)}
                  maxLength={2000}
                  placeholder="Wat vond je van het huisje, de omgeving, je verblijf?"
                  required
                />
              </label>

              <label className="mt-5 block text-lg font-semibold text-forest-900">
                Naam bij je review
                <input className={veld} value={naam} onChange={(e) => setNaam(e.target.value)} maxLength={40} required />
                <span className="mt-1 block text-sm font-normal text-forest-800">
                  Bijvoorbeeld alleen je voornaam, of &ldquo;Familie Jansen&rdquo;.
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
                  Ik geef toestemming om mijn review, met de naam hierboven, op boshuispleuntje.nl te
                  plaatsen.
                </span>
              </label>

              {fout && <p role="alert" className="mt-4 rounded-2xl bg-red-100 p-4 font-semibold text-red-900">{fout}</p>}

              <button
                type="submit"
                disabled={bezig}
                className="mt-6 w-full cursor-pointer rounded-full bg-sunset-500 px-7 py-3.5 text-base font-bold text-orange-50 shadow-lg shadow-sunset-500/30 transition hover:bg-sunset-600 disabled:opacity-60"
              >
                {bezig ? "Bezig met versturen…" : "Review versturen"}
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
