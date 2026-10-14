"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { addDays, type Regels } from "@/lib/availability";

// Beheerpagina boshuispleuntje.nl/beheer.
// Praat met public/api/beheer.php op de server bij Vimexx.

type Blokkade = {
  id: string;
  aankomst: string;
  vertrek: string;
  omschrijving: string;
};

type AirbnbBoeking = {
  aankomst: string;
  vertrek: string;
  soort: "boeking" | "geblokkeerd";
};

type Overzicht = {
  blokkades: Blokkade[];
  airbnb: AirbnbBoeking[];
  airbnbGelukt: boolean;
  airbnbOpgehaald: string | null;
  nachten: string[];
  regels: Regels;
  regelGrenzen: Record<keyof Regels, [number, number]>;
  aanvragen: Aanvraag[];
};

type Aanvraag = {
  id: string;
  ontvangen: string;
  naam: string;
  email: string;
  telefoon: string;
  aankomst: string;
  vertrek: string;
  personen: number;
  honden: number;
  totaal: string;
  bericht: string;
};

type Scherm = "laden" | "opzetten" | "inloggen" | "beheer" | "storing";

const AGENDA_LINK = "https://boshuispleuntje.nl/api/agenda.php";

class ApiFout extends Error {
  uitgelogd: boolean;
  overlap: boolean;
  constructor(bericht: string, uitgelogd = false, overlap = false) {
    super(bericht);
    this.uitgelogd = uitgelogd;
    this.overlap = overlap;
  }
}

async function api<T>(actie: string, data: Record<string, unknown> = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch("/api/beheer.php", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Pleuntje": "1" },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify({ actie, ...data }),
    });
  } catch {
    throw new ApiFout("Geen verbinding. Controleer je internet en probeer het opnieuw.");
  }
  let json: Record<string, unknown> = {};
  try {
    json = await response.json();
  } catch {
    throw new ApiFout("De server gaf een onverwacht antwoord. Probeer het zo nog eens.");
  }
  if (!response.ok || json.fout) {
    throw new ApiFout(
      String(json.fout ?? "Er ging iets mis."),
      Boolean(json.uitgelogd),
      Boolean(json.overlap),
    );
  }
  return json as T;
}

const weekdagen = ["zo", "ma", "di", "wo", "do", "vr", "za"];
const maanden = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

function mooieDatum(iso: string) {
  const [j, m, d] = iso.split("-").map(Number);
  const datum = new Date(j, m - 1, d);
  return `${weekdagen[datum.getDay()]} ${d} ${maanden[m - 1]} ${j}`;
}

function aantalNachten(aankomst: string, vertrek: string) {
  let n = 0;
  for (let dag = aankomst; dag < vertrek && n < 1000; dag = addDays(dag, 1)) n++;
  return n;
}

function Periode({ aankomst, vertrek }: { aankomst: string; vertrek: string }) {
  const n = aantalNachten(aankomst, vertrek);
  return (
    <>
      <span className="font-bold">{mooieDatum(aankomst)}</span>
      {" → "}
      <span className="font-bold">{mooieDatum(vertrek)}</span>
      <span className="text-forest-700">
        {" "}
        ({n} {n === 1 ? "nacht" : "nachten"})
      </span>
    </>
  );
}

const knop =
  "inline-flex cursor-pointer items-center justify-center rounded-full px-6 py-3 text-base font-bold transition disabled:cursor-not-allowed disabled:opacity-50";
const hoofdknop = `${knop} bg-forest-600 text-cream hover:bg-forest-700`;
const tweedeKnop = `${knop} bg-sunset-100 text-forest-900 hover:bg-sunset-200`;
const veld =
  "mt-1 w-full rounded-2xl border border-forest-300 bg-white px-4 py-3 text-lg text-forest-900 outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-300";
const kaart =
  "rounded-[2rem] border border-forest-200 bg-white/70 p-5 shadow-sm shadow-forest-900/10 sm:p-7";

function Melding({ tekst, soort = "fout" }: { tekst: string; soort?: "fout" | "goed" }) {
  if (!tekst) return null;
  return (
    <p
      role={soort === "fout" ? "alert" : "status"}
      className={`mt-4 rounded-2xl p-4 text-base font-semibold ${
        soort === "fout" ? "bg-red-100 text-red-900" : "bg-green-100 text-green-900"
      }`}
    >
      {tekst}
    </p>
  );
}

// ---------- Opzetten (eenmalig) ----------

function OpzetScherm({ klaar }: { klaar: () => void }) {
  const [code, setCode] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [herhaal, setHerhaal] = useState("");
  const [fout, setFout] = useState("");
  const [bezig, setBezig] = useState(false);

  async function verstuur(e: FormEvent) {
    e.preventDefault();
    setFout("");
    if (wachtwoord.length < 8) return setFout("Kies een wachtwoord van minstens 8 tekens.");
    if (wachtwoord !== herhaal) return setFout("De twee wachtwoorden zijn niet hetzelfde.");
    setBezig(true);
    try {
      await api("opzetten", { code, wachtwoord });
      klaar();
    } catch (err) {
      setFout((err as Error).message);
    } finally {
      setBezig(false);
    }
  }

  return (
    <form onSubmit={verstuur} className={kaart}>
      <h1 className="text-3xl text-forest-900">Welkom bij je beheerpagina</h1>
      <p className="mt-3 text-lg text-forest-900">
        Dit doe je maar één keer. Vul de opstartcode in die je van Claude hebt
        gekregen, en kies daarna zelf een wachtwoord.
      </p>
      <label className="mt-6 block text-lg font-semibold text-forest-900">
        Opstartcode
        <input
          className={`${veld} font-mono tracking-widest uppercase`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          required
        />
      </label>
      <label className="mt-5 block text-lg font-semibold text-forest-900">
        Kies een wachtwoord (minstens 8 tekens)
        <input
          className={veld}
          type="password"
          value={wachtwoord}
          onChange={(e) => setWachtwoord(e.target.value)}
          autoComplete="new-password"
          required
        />
      </label>
      <label className="mt-5 block text-lg font-semibold text-forest-900">
        Typ het wachtwoord nog een keer
        <input
          className={veld}
          type="password"
          value={herhaal}
          onChange={(e) => setHerhaal(e.target.value)}
          autoComplete="new-password"
          required
        />
      </label>
      <Melding tekst={fout} />
      <button type="submit" className={`${hoofdknop} mt-6 w-full`} disabled={bezig}>
        {bezig ? "Bezig…" : "Opslaan en beginnen"}
      </button>
    </form>
  );
}

// ---------- Inloggen ----------

function InlogScherm({ klaar }: { klaar: () => void }) {
  const [wachtwoord, setWachtwoord] = useState("");
  const [fout, setFout] = useState("");
  const [bezig, setBezig] = useState(false);

  async function verstuur(e: FormEvent) {
    e.preventDefault();
    setFout("");
    setBezig(true);
    try {
      await api("inloggen", { wachtwoord });
      klaar();
    } catch (err) {
      setFout((err as Error).message);
    } finally {
      setBezig(false);
    }
  }

  return (
    <form onSubmit={verstuur} className={kaart}>
      <h1 className="text-3xl text-forest-900">Inloggen</h1>
      <p className="mt-3 text-lg text-forest-900">
        Je blijft op dit apparaat 90 dagen ingelogd.
      </p>
      <label className="mt-6 block text-lg font-semibold text-forest-900">
        Wachtwoord
        <input
          className={veld}
          type="password"
          value={wachtwoord}
          onChange={(e) => setWachtwoord(e.target.value)}
          autoComplete="current-password"
          autoFocus
          required
        />
      </label>
      <Melding tekst={fout} />
      <button type="submit" className={`${hoofdknop} mt-6 w-full`} disabled={bezig}>
        {bezig ? "Bezig…" : "Inloggen"}
      </button>
      <p className="mt-5 text-base text-forest-700">
        Wachtwoord vergeten? Vraag Claude om een nieuwe opstartcode. Je
        blokkades blijven dan gewoon bewaard.
      </p>
    </form>
  );
}

// ---------- Beheren ----------

function BlokkadeRegel({
  blokkade,
  verwijder,
}: {
  blokkade: Blokkade;
  verwijder: (id: string) => Promise<void>;
}) {
  const [zeker, setZeker] = useState(false);
  const [bezig, setBezig] = useState(false);

  return (
    <li className="rounded-2xl bg-forest-50 p-4">
      <div className="text-base text-forest-900">
        <Periode aankomst={blokkade.aankomst} vertrek={blokkade.vertrek} />
      </div>
      <div className="mt-1 text-base text-forest-800">{blokkade.omschrijving}</div>
      {!zeker ? (
        <button type="button" className={`${tweedeKnop} mt-3 py-2`} onClick={() => setZeker(true)}>
          Vrijgeven
        </button>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="font-semibold text-forest-900">Deze datums weer vrijgeven?</span>
          <button
            type="button"
            className={`${hoofdknop} py-2`}
            disabled={bezig}
            onClick={async () => {
              setBezig(true);
              await verwijder(blokkade.id);
              setBezig(false);
              setZeker(false);
            }}
          >
            {bezig ? "Bezig…" : "Ja, vrijgeven"}
          </button>
          <button type="button" className={`${tweedeKnop} py-2`} onClick={() => setZeker(false)}>
            Nee
          </button>
        </div>
      )}
    </li>
  );
}

function AanvraagKaart({
  aanvraag,
  bevestig,
  wijsAf,
}: {
  aanvraag: Aanvraag;
  bevestig: (id: string, toch: boolean) => Promise<string | null>;
  wijsAf: (id: string) => Promise<void>;
}) {
  const [stap, setStap] = useState<"" | "afwijzen" | "overlap">("");
  const [melding, setMelding] = useState("");
  const [bezig, setBezig] = useState(false);

  async function doeBevestigen(toch: boolean) {
    setBezig(true);
    const fout = await bevestig(aanvraag.id, toch);
    setBezig(false);
    if (fout) {
      setMelding(fout);
      setStap("overlap");
    }
  }

  return (
    <li className="rounded-2xl border border-sunset-200 bg-sunset-50 p-4 text-base text-forest-900">
      <div className="text-lg font-bold">{aanvraag.naam}</div>
      <div className="mt-1">
        <Periode aankomst={aanvraag.aankomst} vertrek={aanvraag.vertrek} />
      </div>
      <div className="mt-1">
        {aanvraag.personen} {aanvraag.personen === 1 ? "persoon" : "personen"}
        {aanvraag.honden > 0 &&
          `, ${aanvraag.honden} ${aanvraag.honden === 1 ? "hond" : "honden"}`}
        {aanvraag.totaal && aanvraag.totaal !== "-" && <> · {aanvraag.totaal}</>}
      </div>
      <div className="mt-1 break-all">
        <a className="underline" href={`mailto:${aanvraag.email}`}>{aanvraag.email}</a>
        {aanvraag.telefoon && (
          <>
            {" · "}
            <a className="underline" href={`tel:${aanvraag.telefoon.replace(/[^+\d]/g, "")}`}>
              {aanvraag.telefoon}
            </a>
          </>
        )}
      </div>
      {aanvraag.bericht && (
        <p className="mt-2 rounded-xl bg-white/70 p-3 whitespace-pre-line">{aanvraag.bericht}</p>
      )}
      <div className="mt-1 text-sm text-forest-700">Ontvangen: {aanvraag.ontvangen}</div>

      {stap === "" && (
        <div className="mt-3 flex flex-wrap gap-3">
          <button type="button" className={`${hoofdknop} py-2`} disabled={bezig} onClick={() => doeBevestigen(false)}>
            {bezig ? "Bezig…" : "Bevestigen"}
          </button>
          <button type="button" className={`${tweedeKnop} py-2`} onClick={() => setStap("afwijzen")}>
            Afwijzen
          </button>
        </div>
      )}
      {stap === "afwijzen" && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="font-semibold">Aanvraag afwijzen en weghalen?</span>
          <button
            type="button"
            className={`${hoofdknop} py-2`}
            disabled={bezig}
            onClick={async () => {
              setBezig(true);
              await wijsAf(aanvraag.id);
              setBezig(false);
            }}
          >
            Ja, afwijzen
          </button>
          <button type="button" className={`${tweedeKnop} py-2`} onClick={() => setStap("")}>
            Nee
          </button>
        </div>
      )}
      {stap === "overlap" && (
        <div className="mt-3">
          <Melding tekst={melding} />
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" className={`${hoofdknop} py-2`} disabled={bezig} onClick={() => doeBevestigen(true)}>
              Toch bevestigen
            </button>
            <button type="button" className={`${tweedeKnop} py-2`} onClick={() => setStap("")}>
              Terug
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

const REGEL_UITLEG: Record<keyof Regels, { label: string; eenheid: string }> = {
  minNachten: { label: "Minimaal aantal nachten", eenheid: "nachten" },
  maxNachten: { label: "Maximaal aantal nachten", eenheid: "nachten" },
  dagenVooraf: { label: "Minstens zoveel dagen van tevoren boeken", eenheid: "dagen" },
  maandenVooruit: { label: "Hoe ver vooruit gasten kunnen boeken", eenheid: "maanden" },
};

function RegelsBeheer({
  regels,
  grenzen,
  opslaan,
}: {
  regels: Regels;
  grenzen: Record<keyof Regels, [number, number]>;
  opslaan: (regels: Regels) => Promise<boolean>;
}) {
  const [waarden, setWaarden] = useState<Record<keyof Regels, string>>({
    minNachten: String(regels.minNachten),
    maxNachten: String(regels.maxNachten),
    dagenVooraf: String(regels.dagenVooraf),
    maandenVooruit: String(regels.maandenVooruit),
  });
  const [bezig, setBezig] = useState(false);
  const [opgeslagen, setOpgeslagen] = useState(false);
  const sleutels = Object.keys(REGEL_UITLEG) as (keyof Regels)[];

  return (
    <section className={kaart}>
      <h2 className="text-2xl text-forest-900">Regels voor boekingen</h2>
      <p className="mt-2 text-base text-forest-800">
        Deze regels gelden voor aanvragen via boshuispleuntje.nl. Voor Airbnb stel je
        ze in Airbnb zelf in. Jij kunt hier op de beheerpagina altijd alles blokkeren,
        ook buiten deze regels.
      </p>
      <form
        className="mt-4 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBezig(true);
          setOpgeslagen(false);
          const gelukt = await opslaan({
            minNachten: Number(waarden.minNachten),
            maxNachten: Number(waarden.maxNachten),
            dagenVooraf: Number(waarden.dagenVooraf),
            maandenVooruit: Number(waarden.maandenVooruit),
          });
          setBezig(false);
          setOpgeslagen(gelukt);
        }}
      >
        {sleutels.map((sleutel) => (
          <label key={sleutel} className="block text-lg font-semibold text-forest-900">
            {REGEL_UITLEG[sleutel].label}
            <span className="mt-1 flex items-center gap-3">
              <input
                className={`${veld} mt-0 w-28`}
                type="number"
                inputMode="numeric"
                min={grenzen[sleutel][0]}
                max={grenzen[sleutel][1]}
                value={waarden[sleutel]}
                onChange={(e) => {
                  setOpgeslagen(false);
                  setWaarden((w) => ({ ...w, [sleutel]: e.target.value }));
                }}
                required
              />
              <span className="font-normal">{REGEL_UITLEG[sleutel].eenheid}</span>
            </span>
          </label>
        ))}
        <button type="submit" className={hoofdknop} disabled={bezig}>
          {bezig ? "Bezig…" : "Regels opslaan"}
        </button>
        {opgeslagen && <Melding soort="goed" tekst="Opgeslagen. De nieuwe regels gelden meteen op boshuispleuntje.nl." />}
      </form>
    </section>
  );
}

function BeheerScherm({ uitgelogd }: { uitgelogd: () => void }) {
  const [overzicht, setOverzicht] = useState<Overzicht | null>(null);
  const [aankomst, setAankomst] = useState("");
  const [vertrek, setVertrek] = useState("");
  const [omschrijving, setOmschrijving] = useState("");
  const [fout, setFout] = useState("");
  const [goed, setGoed] = useState("");
  const [bezig, setBezig] = useState(false);
  const [gekopieerd, setGekopieerd] = useState(false);

  const behandelFout = useCallback(
    (err: unknown) => {
      if (err instanceof ApiFout && err.uitgelogd) return uitgelogd();
      setGoed("");
      setFout((err as Error).message);
    },
    [uitgelogd],
  );

  const laad = useCallback(
    async (ververs = false) => {
      try {
        setOverzicht(await api<Overzicht>("overzicht", { ververs }));
      } catch (err) {
        behandelFout(err);
      }
    },
    [behandelFout],
  );

  useEffect(() => {
    let actief = true;
    api<Overzicht>("overzicht")
      .then((data) => {
        if (actief) setOverzicht(data);
      })
      .catch((err) => {
        if (actief) behandelFout(err);
      });
    return () => {
      actief = false;
    };
  }, [behandelFout]);

  function kiesDag(iso: string) {
    setFout("");
    setGoed("");
    if (!aankomst || vertrek || iso <= aankomst) {
      setAankomst(iso);
      setVertrek("");
      return;
    }
    setVertrek(iso);
  }

  async function blokkeer() {
    setBezig(true);
    setFout("");
    try {
      setOverzicht(await api<Overzicht>("blokkeer", { aankomst, vertrek, omschrijving }));
      setGoed(
        `Geblokkeerd: ${mooieDatum(aankomst)} tot ${mooieDatum(vertrek)}. Dit staat nu ook op boshuispleuntje.nl.`,
      );
      setAankomst("");
      setVertrek("");
      setOmschrijving("");
    } catch (err) {
      behandelFout(err);
    } finally {
      setBezig(false);
    }
  }

  async function verwijder(id: string) {
    setFout("");
    try {
      setOverzicht(await api<Overzicht>("verwijder", { id }));
      setGoed("Vrijgegeven. Die datums zijn nu weer beschikbaar op boshuispleuntje.nl.");
    } catch (err) {
      behandelFout(err);
    }
  }

  async function bevestig(id: string, toch: boolean): Promise<string | null> {
    setFout("");
    try {
      setOverzicht(await api<Overzicht>("bevestig", { id, toch }));
      setGoed(
        "Bevestigd. De datums zijn nu geblokkeerd op boshuispleuntje.nl en gaan ook naar Airbnb. Vergeet niet de gast zelf even te laten weten dat het doorgaat.",
      );
      return null;
    } catch (err) {
      if (err instanceof ApiFout && err.overlap) return err.message;
      behandelFout(err);
      return null;
    }
  }

  async function wijsAf(id: string) {
    setFout("");
    try {
      setOverzicht(await api<Overzicht>("wijsaf", { id }));
      setGoed("De aanvraag is weggehaald. Laat de gast zelf even weten dat het niet doorgaat.");
    } catch (err) {
      behandelFout(err);
    }
  }

  async function regelsOpslaan(regels: Regels): Promise<boolean> {
    setFout("");
    try {
      setOverzicht(await api<Overzicht>("regels", { regels }));
      return true;
    } catch (err) {
      behandelFout(err);
      return false;
    }
  }

  async function uitloggen() {
    try {
      await api("uitloggen");
    } finally {
      uitgelogd();
    }
  }

  if (!overzicht) {
    return (
      <div className={kaart}>
        <p className="text-lg text-forest-900">Gegevens worden geladen…</p>
        <Melding tekst={fout} />
      </div>
    );
  }

  const nachten = new Set(overzicht.nachten);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl text-forest-900 sm:text-4xl">Agenda van Pleuntje</h1>
        <button type="button" className={`${tweedeKnop} py-2`} onClick={uitloggen}>
          Uitloggen
        </button>
      </div>

      {/* Aanvragen */}
      <section className={kaart}>
        <h2 className="text-2xl text-forest-900">
          Aanvragen via boshuispleuntje.nl
          {overzicht.aanvragen.length > 0 && (
            <span className="ml-2 rounded-full bg-sunset-500 px-3 py-0.5 align-middle text-base text-white">
              {overzicht.aanvragen.length}
            </span>
          )}
        </h2>
        {overzicht.aanvragen.length === 0 ? (
          <p className="mt-3 text-lg text-forest-900">Er zijn geen openstaande aanvragen.</p>
        ) : (
          <>
            <p className="mt-2 text-base text-forest-800">
              Met <strong>Bevestigen</strong> worden de datums meteen geblokkeerd, ook
              voor Airbnb. De gast krijgt geen automatisch bericht; dat stuur je zelf.
            </p>
            <ul className="mt-4 space-y-3">
              {overzicht.aanvragen.map((a) => (
                <AanvraagKaart key={a.id} aanvraag={a} bevestig={bevestig} wijsAf={wijsAf} />
              ))}
            </ul>
          </>
        )}
      </section>

      {/* Blokkeren */}
      <section className={kaart}>
        <h2 className="text-2xl text-forest-900">Datums blokkeren</h2>
        <div className="mt-4">
          <AvailabilityCalendar
            nights={nachten}
            showPrices={false}
            instruction="Tik op de aankomstdag, en daarna op de vertrekdag."
            selectedCheckIn={aankomst}
            selectedCheckOut={vertrek}
            onSelectDate={kiesDag}
          />
        </div>

        {aankomst && (
          <div className="mt-6 rounded-2xl bg-forest-50 p-5">
            {!vertrek ? (
              <p className="text-lg text-forest-900">
                Aankomst: <span className="font-bold">{mooieDatum(aankomst)}</span>. Tik nu op de
                vertrekdag.
              </p>
            ) : (
              <>
                <p className="text-lg text-forest-900">
                  <Periode aankomst={aankomst} vertrek={vertrek} />
                </p>
                <label className="mt-4 block text-lg font-semibold text-forest-900">
                  Omschrijving (alleen voor jou, bijvoorbeeld een naam)
                  <input
                    className={veld}
                    value={omschrijving}
                    onChange={(e) => setOmschrijving(e.target.value)}
                    maxLength={80}
                    placeholder="Bijvoorbeeld: familie Jansen"
                  />
                </label>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button type="button" className={hoofdknop} onClick={blokkeer} disabled={bezig}>
                    {bezig ? "Bezig…" : "Blokkeren"}
                  </button>
                  <button
                    type="button"
                    className={tweedeKnop}
                    onClick={() => {
                      setAankomst("");
                      setVertrek("");
                    }}
                  >
                    Annuleren
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* Eigen blokkades */}
      <section className={kaart}>
        <h2 className="text-2xl text-forest-900">Geblokkeerd door jou</h2>
        {overzicht.blokkades.length === 0 ? (
          <p className="mt-3 text-lg text-forest-900">Er staat nu niets geblokkeerd.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {overzicht.blokkades.map((b) => (
              <BlokkadeRegel key={b.id} blokkade={b} verwijder={verwijder} />
            ))}
          </ul>
        )}
      </section>

      {/* Airbnb */}
      <section className={kaart}>
        <h2 className="text-2xl text-forest-900">Boekingen uit Airbnb</h2>
        <p className="mt-2 text-base text-forest-800">
          Deze komen er vanzelf bij, en staan ook op boshuispleuntje.nl. Wijzigen of
          annuleren doe je in Airbnb.
        </p>
        {!overzicht.airbnbGelukt && (
          <Melding tekst="Het ophalen van de Airbnb-agenda lukte de laatste keer niet. De site gebruikt zolang de vorige versie en probeert het elk kwartier opnieuw." />
        )}
        {overzicht.airbnb.length === 0 ? (
          <p className="mt-3 text-lg text-forest-900">Geen komende Airbnb-boekingen.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {overzicht.airbnb.map((b) => (
              <li key={`${b.aankomst}-${b.vertrek}`} className="rounded-2xl bg-sunset-50 p-4 text-base text-forest-900">
                <Periode aankomst={b.aankomst} vertrek={b.vertrek} />
                <div className="mt-1 text-forest-800">
                  {b.soort === "boeking" ? "Boeking via Airbnb" : "Geblokkeerd in Airbnb"}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className={`${tweedeKnop} py-2`} onClick={() => laad(true)}>
            Nu verversen
          </button>
          {overzicht.airbnbOpgehaald && (
            <span className="text-sm text-forest-700">
              Laatst opgehaald: {overzicht.airbnbOpgehaald}
            </span>
          )}
        </div>
      </section>

      <RegelsBeheer
        key={JSON.stringify(overzicht.regels)}
        regels={overzicht.regels}
        grenzen={overzicht.regelGrenzen}
        opslaan={regelsOpslaan}
      />

      {/* Link voor Airbnb */}
      <section className={kaart}>
        <h2 className="text-2xl text-forest-900">Agendalink voor Airbnb</h2>
        <p className="mt-2 text-base text-forest-800">
          Deze link vul je één keer in bij Airbnb. Dan gaan de datums die jij hier
          blokkeert ook op Airbnb dicht. Claude helpt je daarbij.
        </p>
        <div className="mt-3 rounded-2xl bg-forest-50 p-4 font-mono text-sm break-all text-forest-900">
          {AGENDA_LINK}
        </div>
        <button
          type="button"
          className={`${tweedeKnop} mt-3 py-2`}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(AGENDA_LINK);
              setGekopieerd(true);
              setTimeout(() => setGekopieerd(false), 3000);
            } catch {
              /* kopiëren niet toegestaan: link staat erboven */
            }
          }}
        >
          {gekopieerd ? "Gekopieerd ✓" : "Kopieer link"}
        </button>
      </section>

      <WachtwoordWijzigen uitgelogd={uitgelogd} />

      {/* Meldingen onderin beeld, zodat je ze altijd ziet */}
      {(fout || goed) && (
        <div className="fixed inset-x-0 bottom-4 z-50 px-4">
          <div
            role={fout ? "alert" : "status"}
            className={`mx-auto flex max-w-xl items-start gap-3 rounded-2xl p-4 text-base font-semibold shadow-lg ${
              fout ? "bg-red-100 text-red-900" : "bg-green-100 text-green-900"
            }`}
          >
            <span className="flex-1">{fout || goed}</span>
            <button
              type="button"
              aria-label="Sluiten"
              className="cursor-pointer text-xl leading-none"
              onClick={() => {
                setFout("");
                setGoed("");
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function WachtwoordWijzigen({ uitgelogd }: { uitgelogd: () => void }) {
  const [open, setOpen] = useState(false);
  const [oud, setOud] = useState("");
  const [nieuw, setNieuw] = useState("");
  const [fout, setFout] = useState("");
  const [goed, setGoed] = useState("");

  async function verstuur(e: FormEvent) {
    e.preventDefault();
    setFout("");
    setGoed("");
    try {
      await api("wachtwoord", { oud, nieuw });
      setGoed("Je wachtwoord is gewijzigd.");
      setOud("");
      setNieuw("");
    } catch (err) {
      if (err instanceof ApiFout && err.uitgelogd) return uitgelogd();
      setFout((err as Error).message);
    }
  }

  if (!open) {
    return (
      <button type="button" className="text-base font-semibold text-forest-700 underline" onClick={() => setOpen(true)}>
        Wachtwoord wijzigen
      </button>
    );
  }

  return (
    <form onSubmit={verstuur} className={kaart}>
      <h2 className="text-2xl text-forest-900">Wachtwoord wijzigen</h2>
      <label className="mt-4 block text-lg font-semibold text-forest-900">
        Huidig wachtwoord
        <input className={veld} type="password" value={oud} onChange={(e) => setOud(e.target.value)} autoComplete="current-password" required />
      </label>
      <label className="mt-4 block text-lg font-semibold text-forest-900">
        Nieuw wachtwoord (minstens 8 tekens)
        <input className={veld} type="password" value={nieuw} onChange={(e) => setNieuw(e.target.value)} autoComplete="new-password" required />
      </label>
      <Melding tekst={fout} />
      <Melding tekst={goed} soort="goed" />
      <div className="mt-4 flex gap-3">
        <button type="submit" className={hoofdknop}>Opslaan</button>
        <button type="button" className={tweedeKnop} onClick={() => setOpen(false)}>Sluiten</button>
      </div>
    </form>
  );
}

// ---------- Hoofdonderdeel ----------

export default function BeheerApp() {
  const [scherm, setScherm] = useState<Scherm>("laden");
  const [storing, setStoring] = useState("");

  const verwerkStatus = useCallback(
    (resultaat: Promise<{ opzetNodig: boolean; ingelogd: boolean }>) =>
      resultaat
        .then((s) => setScherm(s.opzetNodig ? "opzetten" : s.ingelogd ? "beheer" : "inloggen"))
        .catch((err) => {
          setStoring((err as Error).message);
          setScherm("storing");
        }),
    [],
  );

  const controleer = useCallback(() => {
    setScherm("laden");
    verwerkStatus(api("status"));
  }, [verwerkStatus]);

  useEffect(() => {
    verwerkStatus(api("status"));
  }, [verwerkStatus]);

  return (
    <>
      <header className="px-4 pt-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between rounded-3xl border border-forest-700/60 bg-forest-600/95 px-5 py-4 text-cream shadow-sm shadow-forest-900/20">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/photos/logo.png" alt="Pleuntje" width={44} height={44} className="h-11 w-11 rounded-full" />
            <span className="font-bold">Pleuntje · beheer</span>
          </Link>
          <Link
            href="/"
            className="rounded-full bg-sunset-100 px-4 py-2 text-sm font-bold text-forest-900 transition hover:bg-sunset-200"
          >
            Naar de site
          </Link>
        </div>
      </header>
      <main className="flex-1 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          {scherm === "laden" && <p className="text-lg text-forest-900">Even geduld…</p>}
          {scherm === "storing" && (
            <div className={kaart}>
              <h1 className="text-3xl text-forest-900">Beheerpagina niet bereikbaar</h1>
              <Melding tekst={storing} />
              <button type="button" className={`${hoofdknop} mt-5`} onClick={controleer}>
                Opnieuw proberen
              </button>
            </div>
          )}
          {scherm === "opzetten" && <OpzetScherm klaar={() => setScherm("beheer")} />}
          {scherm === "inloggen" && <InlogScherm klaar={() => setScherm("beheer")} />}
          {scherm === "beheer" && <BeheerScherm uitgelogd={() => setScherm("inloggen")} />}
        </div>
      </main>
    </>
  );
}
