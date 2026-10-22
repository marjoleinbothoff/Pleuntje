"use client";

import { CONTACT_EMAIL } from "@/data/contact";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LOCALE, pad, type Taal } from "@/i18n/talen";

// Hier komt de gast terug na het betalen bij Mollie.
// We vragen een paar keer na of de betaling binnen is.

type Toestand = {
  status: "laden" | "wacht" | "betaald" | "mislukt" | "verlopen" | "geannuleerd" | "onbekend";
  aankomst?: string;
  vertrek?: string;
  email?: string;
  test?: boolean;
};

function mooieDatum(iso: string | undefined, taal: Taal) {
  if (!iso) return "";
  const [j, m, d] = iso.split("-").map(Number);
  return new Date(j, m - 1, d).toLocaleDateString(LOCALE[taal], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const T = {
  nl: {
    terug: "Terug naar de site",
    test: "Testmodus: er is niet echt betaald.",
    geduld: "Even geduld…",
    wacht: "We wachten op de bevestiging van je betaling. Dit duurt meestal maar een paar seconden.",
    gelukt: "Je boeking is gelukt!",
    jeKomt: (a: React.ReactNode, v: React.ReactNode) => <>Je komt van {a} tot {v} bij Pleuntje.</>,
    mail: (e?: string) => `De bevestiging staat in je mail (${e}).`,
    spam: (m: string) => (
      <>
        Geen mail van ons gezien? Kijk even in je map <strong>Ongewenste e-mail</strong> of{" "}
        <strong>Spam</strong>, en zet <strong>{m}</strong> in je contacten. Dan mis je straks ook de
        mail met de aankomstinformatie niet.
      </>
    ),
    verlopenKop: "Je betaling is nog niet binnen",
    verlopen:
      "Heb je wel betaald? Dan komt het vanzelf goed en krijg je een bevestiging per mail. Heb je het betalen afgebroken, dan is er niets geboekt en kun je het opnieuw proberen.",
    opnieuw: "Opnieuw boeken",
    misluktKop: "Het betalen is niet gelukt",
    mislukt: "Er is niets afgeschreven en er is niet geboekt. Wil je het nog een keer proberen?",
    onbekendKop: "We konden je boeking niet vinden",
    onbekend:
      "Heb je betaald? Dan krijg je zo een bevestiging per mail. Twijfel je, neem dan even contact met ons op.",
  },
  de: {
    terug: "Zurück zur Website",
    test: "Testmodus: Es wurde nicht wirklich bezahlt.",
    geduld: "Einen Moment bitte…",
    wacht: "Wir warten auf die Bestätigung deiner Zahlung. Das dauert meist nur ein paar Sekunden.",
    gelukt: "Deine Buchung war erfolgreich!",
    jeKomt: (a: React.ReactNode, v: React.ReactNode) => <>Du bist von {a} bis {v} bei Pleuntje.</>,
    mail: (e?: string) => `Die Bestätigung findest du in deinem Postfach (${e}).`,
    spam: (m: string) => (
      <>
        Keine E-Mail von uns gesehen? Schau bitte in deinem <strong>Spam</strong>-Ordner nach und
        füge <strong>{m}</strong> zu deinen Kontakten hinzu. Dann verpasst du auch die E-Mail mit den
        Anreiseinformationen nicht.
      </>
    ),
    verlopenKop: "Deine Zahlung ist noch nicht eingegangen",
    verlopen:
      "Hast du bezahlt? Dann wird alles von selbst gut und du bekommst eine Bestätigung per E-Mail. Hast du die Zahlung abgebrochen, wurde nichts gebucht und du kannst es noch einmal versuchen.",
    opnieuw: "Erneut buchen",
    misluktKop: "Die Zahlung hat nicht geklappt",
    mislukt: "Es wurde nichts abgebucht und nichts gebucht. Möchtest du es noch einmal versuchen?",
    onbekendKop: "Wir konnten deine Buchung nicht finden",
    onbekend:
      "Hast du bezahlt? Dann bekommst du gleich eine Bestätigung per E-Mail. Bist du unsicher, melde dich bitte bei uns.",
  },
  en: {
    terug: "Back to the website",
    test: "Test mode: no real payment was made.",
    geduld: "Just a moment…",
    wacht: "We're waiting for confirmation of your payment. This usually only takes a few seconds.",
    gelukt: "Your booking is confirmed!",
    jeKomt: (a: React.ReactNode, v: React.ReactNode) => <>You&apos;re staying at Pleuntje from {a} to {v}.</>,
    mail: (e?: string) => `The confirmation is in your inbox (${e}).`,
    spam: (m: string) => (
      <>
        Haven&apos;t seen our email? Please check your <strong>junk</strong> or <strong>spam</strong>{" "}
        folder, and add <strong>{m}</strong> to your contacts. That way you won&apos;t miss the email
        with your arrival information either.
      </>
    ),
    verlopenKop: "Your payment hasn't come through yet",
    verlopen:
      "Did you pay? Then everything will be fine and you'll receive a confirmation by email. If you cancelled the payment, nothing has been booked and you can try again.",
    opnieuw: "Book again",
    misluktKop: "The payment didn't go through",
    mislukt: "Nothing has been charged and nothing has been booked. Would you like to try again?",
    onbekendKop: "We couldn't find your booking",
    onbekend:
      "Did you pay? Then you'll receive a confirmation by email shortly. If in doubt, please get in touch with us.",
  },
  fr: {
    terug: "Retour au site",
    test: "Mode test : aucun paiement réel n'a été effectué.",
    geduld: "Un instant…",
    wacht: "Nous attendons la confirmation de votre paiement. Cela ne prend généralement que quelques secondes.",
    gelukt: "Votre réservation est confirmée !",
    jeKomt: (a: React.ReactNode, v: React.ReactNode) => <>Vous séjournez chez Pleuntje du {a} au {v}.</>,
    mail: (e?: string) => `La confirmation se trouve dans votre boîte mail (${e}).`,
    spam: (m: string) => (
      <>
        Vous ne voyez pas notre e-mail ? Vérifiez votre dossier <strong>courrier indésirable</strong>{" "}
        ou <strong>spam</strong>, et ajoutez <strong>{m}</strong> à vos contacts. Ainsi, vous ne
        manquerez pas non plus l&apos;e-mail avec les informations d&apos;arrivée.
      </>
    ),
    verlopenKop: "Votre paiement n'est pas encore arrivé",
    verlopen:
      "Vous avez payé ? Tout va s'arranger et vous recevrez une confirmation par e-mail. Si vous avez interrompu le paiement, rien n'a été réservé et vous pouvez réessayer.",
    opnieuw: "Réserver à nouveau",
    misluktKop: "Le paiement n'a pas abouti",
    mislukt: "Rien n'a été débité et rien n'a été réservé. Voulez-vous réessayer ?",
    onbekendKop: "Nous n'avons pas trouvé votre réservation",
    onbekend:
      "Vous avez payé ? Vous recevrez bientôt une confirmation par e-mail. En cas de doute, contactez-nous.",
  },
} satisfies Record<Taal, unknown>;

export default function BoekingStatus({ taal }: { taal: Taal }) {
  const t = T[taal];
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
          <Link href={pad(taal)} className="flex items-center gap-3">
            <Image src="/photos/logo.png" alt="Pleuntje" width={44} height={44} className="h-11 w-11 rounded-full" />
            <span className="font-bold">Pleuntje</span>
          </Link>
          <Link
            href={pad(taal)}
            className="rounded-full bg-sunset-100 px-4 py-2 text-center text-sm font-bold text-forest-900 transition hover:bg-sunset-200"
          >
            {t.terug}
          </Link>
        </div>
      </header>
      <main className="flex-1 px-4 py-14">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-forest-200 bg-white/70 p-7 text-center shadow-sm">
          {toestand.test && (
            <p className="mb-4 rounded-2xl bg-yellow-100 p-3 text-sm font-semibold text-yellow-900">
              {t.test}
            </p>
          )}
          {(status === "laden" || status === "wacht") && (
            <>
              <span
                aria-hidden
                className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-forest-600 border-t-transparent"
              />
              <h1 className="mt-5 text-3xl text-forest-900">{t.geduld}</h1>
              <p className="mt-3 text-lg text-forest-900">{t.wacht}</p>
            </>
          )}
          {status === "betaald" && (
            <>
              <div className="text-5xl">🎉</div>
              <h1 className="mt-3 text-3xl text-forest-900">{t.gelukt}</h1>
              <p className="mt-3 text-lg text-forest-900">
                {t.jeKomt(
                  <strong>{mooieDatum(toestand.aankomst, taal)}</strong>,
                  <strong>{mooieDatum(toestand.vertrek, taal)}</strong>,
                )}
              </p>
              <p className="mt-3 text-lg text-forest-900">{t.mail(toestand.email)}</p>
              <p className="mt-3 rounded-2xl bg-forest-100 px-4 py-3 text-base text-forest-900">{t.spam(CONTACT_EMAIL)}</p>
            </>
          )}
          {status === "verlopen" && (
            <>
              <h1 className="text-3xl text-forest-900">{t.verlopenKop}</h1>
              <p className="mt-3 text-lg text-forest-900">{t.verlopen}</p>
              <Link
                href={`${pad(taal)}#boeken-opnieuw`}
                className="mt-6 inline-block rounded-full bg-sunset-500 px-7 py-3 text-base font-bold text-orange-50"
              >
                {t.opnieuw}
              </Link>
            </>
          )}
          {(status === "mislukt" || status === "geannuleerd") && (
            <>
              <h1 className="text-3xl text-forest-900">{t.misluktKop}</h1>
              <p className="mt-3 text-lg text-forest-900">{t.mislukt}</p>
              <Link
                href={`${pad(taal)}#boeken-opnieuw`}
                className="mt-6 inline-block rounded-full bg-sunset-500 px-7 py-3 text-base font-bold text-orange-50"
              >
                {t.opnieuw}
              </Link>
            </>
          )}
          {status === "onbekend" && (
            <>
              <h1 className="text-3xl text-forest-900">{t.onbekendKop}</h1>
              <p className="mt-3 text-lg text-forest-900">{t.onbekend}</p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
