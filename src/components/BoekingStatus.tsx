"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Hier komt de gast terug na het betalen bij Mollie.
// We vragen een paar keer na of de betaling binnen is.

type Toestand = {
  status: "laden" | "wacht" | "betaald" | "mislukt" | "verlopen" | "geannuleerd" | "onbekend";
  aankomst?: string;
  vertrek?: string;
  email?: string;
  test?: boolean;
};

const maanden = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
const dagen = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];

function mooieDatum(iso?: string) {
  if (!iso) return "";
  const [j, m, d] = iso.split("-").map(Number);
  const datum = new Date(j, m - 1, d);
  return `${dagen[datum.getDay()]} ${d} ${maanden[m - 1]} ${j}`;
}

export default function BoekingStatus() {
  const [toestand, setToestand] = useState<Toestand>({ status: "laden" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") ?? "";
    const k = params.get("k") ?? "";
    let pogingen = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let actief = true;

    function vraag() {
      fetch(`/api/boeking-status.php?id=${encodeURIComponent(id)}&k=${encodeURIComponent(k)}`, {
        cache: "no-store",
      })
        .then((r) => r.json())
        .then((d: Toestand) => {
          if (!actief) return;
          setToestand(d);
          pogingen++;
          // Nog even blijven vragen zolang de betaling onderweg is (max. ongeveer 2 minuten)
          if (d.status === "wacht" && pogingen < 40) timer = setTimeout(vraag, 3000);
        })
        .catch(() => {
          if (!actief) return;
          pogingen++;
          if (pogingen < 40) timer = setTimeout(vraag, 3000);
          else setToestand({ status: "onbekend" });
        });
    }
    vraag();
    return () => {
      actief = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const { status } = toestand;

  return (
    <>
      <header className="px-4 pt-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between rounded-3xl border border-forest-700/60 bg-forest-600/95 px-5 py-4 text-cream shadow-sm shadow-forest-900/20">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/photos/logo.png" alt="Pleuntje" width={44} height={44} className="h-11 w-11 rounded-full" />
            <span className="font-bold">Pleuntje</span>
          </Link>
          <Link
            href="/"
            className="rounded-full bg-sunset-100 px-4 py-2 text-sm font-bold text-forest-900 transition hover:bg-sunset-200"
          >
            Terug naar de site
          </Link>
        </div>
      </header>
      <main className="flex-1 px-4 py-14">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-forest-200 bg-white/70 p-7 text-center shadow-sm">
          {toestand.test && (
            <p className="mb-4 rounded-2xl bg-yellow-100 p-3 text-sm font-semibold text-yellow-900">
              Testmodus: er is niet echt betaald.
            </p>
          )}
          {(status === "laden" || status === "wacht") && (
            <>
              <span
                aria-hidden
                className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-forest-600 border-t-transparent"
              />
              <h1 className="mt-5 text-3xl text-forest-900">Even geduld…</h1>
              <p className="mt-3 text-lg text-forest-900">
                We wachten op de bevestiging van je betaling. Dit duurt meestal
                maar een paar seconden.
              </p>
            </>
          )}
          {status === "betaald" && (
            <>
              <div className="text-5xl">🎉</div>
              <h1 className="mt-3 text-3xl text-forest-900">Je boeking is gelukt!</h1>
              <p className="mt-3 text-lg text-forest-900">
                Je komt van <strong>{mooieDatum(toestand.aankomst)}</strong> tot{" "}
                <strong>{mooieDatum(toestand.vertrek)}</strong> bij Pleuntje.
              </p>
              <p className="mt-3 text-lg text-forest-900">
                De bevestiging staat in je mail ({toestand.email}). Kijk ook even in
                je spam als je hem niet ziet.
              </p>
            </>
          )}
          {status === "verlopen" && (
            <>
              <h1 className="text-3xl text-forest-900">Je betaling is nog niet binnen</h1>
              <p className="mt-3 text-lg text-forest-900">
                Heb je wel betaald? Dan komt het vanzelf goed en krijg je een
                bevestiging per mail. Heb je het betalen afgebroken, dan is er
                niets geboekt en kun je het opnieuw proberen.
              </p>
              <Link
                href="/#boeken"
                className="mt-6 inline-block rounded-full bg-sunset-500 px-7 py-3 text-base font-bold text-orange-50"
              >
                Opnieuw boeken
              </Link>
            </>
          )}
          {(status === "mislukt" || status === "geannuleerd") && (
            <>
              <h1 className="text-3xl text-forest-900">Het betalen is niet gelukt</h1>
              <p className="mt-3 text-lg text-forest-900">
                Er is niets afgeschreven en er is niet geboekt. Wil je het nog
                een keer proberen?
              </p>
              <Link
                href="/#boeken"
                className="mt-6 inline-block rounded-full bg-sunset-500 px-7 py-3 text-base font-bold text-orange-50"
              >
                Opnieuw boeken
              </Link>
            </>
          )}
          {status === "onbekend" && (
            <>
              <h1 className="text-3xl text-forest-900">We konden je boeking niet vinden</h1>
              <p className="mt-3 text-lg text-forest-900">
                Heb je betaald? Dan krijg je zo een bevestiging per mail. Twijfel
                je, neem dan even contact met ons op.
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
