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
  notitie?: string;
  weergavenaam?: string;
  boeking?: string;
  email?: string;
  mailplanning?: { naam: string; moment: string; status: "gepland" | "verstuurd" | "overgeslagen" }[];
};

type ReviewItem = {
  id: string;
  bron: "site" | "airbnb";
  status: "wacht" | "geplaatst" | "verborgen";
  naam: string;
  sterren: number;
  tekst: string;
  maand: string;
  ingediend: string | null;
};

type PrijsSleutel = "laagseizoen" | "hoogseizoen" | "schoonmaak" | "hond" | "toeristenbelasting";

type MailSoort = "bevestiging" | "aankomst" | "avond_voor_vertrek" | "vertrekdag";
type MailTaal = "nl" | "de" | "en" | "fr";
type MailVertaling = {
  uitchecken: string;
  teksten: Record<MailSoort, { onderwerp: string; tekst: string }>;
  // Is de Nederlandse tekst veranderd nadat deze vertaling is gemaakt?
  verouderd?: Partial<Record<MailSoort | "uitchecken", boolean>>;
};
type MailInstellingen = {
  sleutelcode: string;
  uitchecken: string;
  teksten: Record<MailSoort, { onderwerp: string; tekst: string }>;
  vertalingen: Record<Exclude<MailTaal, "nl">, MailVertaling>;
};

type WebsiteBoeking = {
  id: string;
  status: "betaald" | "wacht";
  naam: string;
  email: string;
  telefoon: string;
  aankomst: string;
  vertrek: string;
  personen: number;
  honden: number;
  bedrag: string;
  bericht: string;
  betaaldOp: string | null;
  test: boolean;
  conflict: boolean;
  taal?: string;
};

type AirbnbBoeking = {
  aankomst: string;
  vertrek: string;
  soort: "boeking" | "geblokkeerd";
  link?: string;
  sleutel: string;
  notitie: string;
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
  mollie: { modus: "live" | "test" | "uit"; sleutelEinde: string | null };
  boekingen: WebsiteBoeking[];
  mailinstellingen: MailInstellingen;
  reviews: ReviewItem[];
  toeristenbelasting: { jaar: string; boekingen: number; nachten: number; persoonsnachten: number; bedrag: string }[];
  prijzen: Record<PrijsSleutel, number>;
  prijsGrenzen: Record<PrijsSleutel, [number, number]>;
  reservekopie: string | null;
  priveAgendaLink: string;
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
  taal?: string;
};

// Gast die de Duitse, Engelse of Franse website gebruikte (dan gaan de mails ook in die taal)
const TAAL_VAN_GAST: Record<string, string> = { de: "Duits", en: "Engels", fr: "Frans" };

function GastTaal({ taal }: { taal?: string }) {
  if (!taal || !TAAL_VAN_GAST[taal]) return null;
  return <div className="mt-1 text-sm font-semibold text-forest-800">Taal van de gast: {TAAL_VAN_GAST[taal]}</div>;
}

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
const kaartBasis = "rounded-[2rem] border-2 p-5 shadow-sm shadow-forest-900/10 sm:p-7";
const kaart = `${kaartBasis} border-forest-200 bg-white`;
// Kaarten met een eigen kleurtje per onderwerp (23 okt 2026, wens Marjolein)
const kaartGroen = `${kaartBasis} border-green-300 bg-green-50`;
const kaartBlauw = `${kaartBasis} border-sky-300 bg-sky-100`;
const kaartOranje = `${kaartBasis} border-orange-300 bg-orange-100`;
const kaartGeel = `${kaartBasis} border-yellow-300 bg-yellow-100`;
const kaartPaars = `${kaartBasis} border-violet-300 bg-violet-100`;
const kaartTurquoise = `${kaartBasis} border-teal-300 bg-teal-100`;
const kaartIndigo = `${kaartBasis} border-indigo-300 bg-indigo-100`;

// Onderwerpen op /beheer, elk met een eigen kleur (23 okt 2026, wens Marjolein: "het is één grote brei")
type GroepKleur = "groen" | "blauw" | "oranje" | "grijs" | "roze";
const GROEP_KLEUR: Record<GroepKleur, { band: string; vlak: string; chip: string }> = {
  groen: { band: "bg-forest-600 text-cream", vlak: "border-green-300 bg-green-100", chip: "bg-forest-600 text-cream" },
  blauw: { band: "bg-sky-700 text-white", vlak: "border-sky-300 bg-sky-50", chip: "bg-sky-700 text-white" },
  oranje: { band: "bg-orange-700 text-white", vlak: "border-orange-200 bg-orange-50", chip: "bg-orange-700 text-white" },
  grijs: { band: "bg-indigo-700 text-white", vlak: "border-indigo-200 bg-indigo-50", chip: "bg-indigo-700 text-white" },
  roze: { band: "bg-rose-700 text-white", vlak: "border-rose-200 bg-rose-50", chip: "bg-rose-700 text-white" },
};
const GROEPEN: { id: string; titel: string; uitleg: string; kleur: GroepKleur }[] = [
  { id: "gasten", titel: "Gasten en datums", uitleg: "Wie er komt, aanvragen en datums dichtzetten", kleur: "groen" },
  { id: "mails", titel: "Mails aan gasten", uitleg: "De vier mails die gasten vanzelf krijgen", kleur: "blauw" },
  { id: "geld", titel: "Prijzen, regels en betalen", uitleg: "Wat een verblijf kost en hoe gasten boeken", kleur: "oranje" },
  { id: "instellingen", titel: "Instellingen en koppelingen", uitleg: "Agenda, reservekopie, Airbnb en wachtwoord", kleur: "grijs" },
  { id: "reviews-groep", titel: "Reviews", uitleg: "Reviews van gasten goedkeuren", kleur: "roze" },
];

function Groep({ id, children }: { id: string; children: React.ReactNode }) {
  const g = GROEPEN.find((x) => x.id === id)!;
  const k = GROEP_KLEUR[g.kleur];
  return (
    <div id={id} className={`scroll-mt-4 overflow-hidden rounded-[2.25rem] border-2 ${k.vlak}`}>
      <div className={`px-5 py-4 sm:px-7 ${k.band}`}>
        <h2 className="text-2xl font-bold sm:text-3xl">{g.titel}</h2>
        <p className="mt-0.5 text-base opacity-90">{g.uitleg}</p>
      </div>
      <div className="space-y-5 p-3 sm:p-5">{children}</div>
    </div>
  );
}

// Gekleurde knopjes bovenaan om snel naar een onderwerp te springen
function GroepKnoppen() {
  return (
    <nav aria-label="Onderwerpen" className="flex flex-wrap gap-2">
      {GROEPEN.map((g) => (
        <a
          key={g.id}
          href={`#${g.id}`}
          className={`rounded-full px-4 py-2 text-base font-semibold ${GROEP_KLEUR[g.kleur].chip}`}
        >
          {g.titel}
        </a>
      ))}
    </nav>
  );
}

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
      <GastTaal taal={aanvraag.taal} />
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
    <section className={kaartGeel}>
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

function MollieBeheer({
  mollie,
  opslaan,
  verwijder,
}: {
  mollie: Overzicht["mollie"];
  opslaan: (sleutel: string) => Promise<boolean>;
  verwijder: () => Promise<void>;
}) {
  const [sleutel, setSleutel] = useState("");
  const [bezig, setBezig] = useState(false);
  const [wijzigen, setWijzigen] = useState(false);

  return (
    <section className={kaartPaars}>
      <h2 className="text-2xl text-forest-900">Online betalen (Mollie)</h2>
      {mollie.modus === "live" && (
        <p className="mt-3 rounded-2xl bg-green-100 p-4 text-base font-semibold text-green-900">
          ✓ Aan. Gasten boeken en betalen direct op boshuispleuntje.nl.
        </p>
      )}
      {mollie.modus === "test" && (
        <p className="mt-3 rounded-2xl bg-yellow-100 p-4 text-base font-semibold text-yellow-900">
          Testmodus. Alleen jij ziet op boshuispleuntje.nl de knop &ldquo;Boeken en
          betalen&rdquo;, met nep-betalingen. Gewone bezoekers sturen nog een aanvraag.
        </p>
      )}
      {mollie.modus === "uit" && (
        <p className="mt-3 rounded-2xl bg-forest-50 p-4 text-base text-forest-900">
          Nog niet ingesteld. Gasten sturen nu een aanvraag, zoals voorheen.
        </p>
      )}
      {mollie.sleutelEinde && !wijzigen && (
        <p className="mt-2 text-sm text-forest-700">Sleutel eindigt op …{mollie.sleutelEinde}</p>
      )}

      {mollie.modus !== "uit" && !wijzigen ? (
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className={`${tweedeKnop} py-2`} onClick={() => setWijzigen(true)}>
            Andere sleutel invullen
          </button>
          <button
            type="button"
            className={`${tweedeKnop} py-2`}
            onClick={async () => {
              if (window.confirm("Online betalen uitzetten? Gasten sturen dan weer een aanvraag.")) await verwijder();
            }}
          >
            Uitzetten
          </button>
        </div>
      ) : (
        <form
          className="mt-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBezig(true);
            const gelukt = await opslaan(sleutel);
            setBezig(false);
            if (gelukt) {
              setSleutel("");
              setWijzigen(false);
            }
          }}
        >
          <label className="block text-lg font-semibold text-forest-900">
            Plak hier je Mollie-sleutel
            <input
              className={`${veld} font-mono text-base`}
              value={sleutel}
              onChange={(e) => setSleutel(e.target.value)}
              placeholder="test_… of live_…"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              required
            />
          </label>
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="submit" className={hoofdknop} disabled={bezig}>
              {bezig ? "Bezig met controleren…" : "Opslaan"}
            </button>
            {wijzigen && (
              <button type="button" className={tweedeKnop} onClick={() => setWijzigen(false)}>
                Annuleren
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}

function ReviewRegel({
  r,
  zetStatus,
}: {
  r: ReviewItem;
  zetStatus: (id: string, status: "geplaatst" | "verborgen" | "verwijderd") => Promise<void>;
}) {
  const [zeker, setZeker] = useState(false);
  const maand = (() => {
    const [j, m] = r.maand.split("-").map(Number);
    return `${["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"][m - 1]} ${j}`;
  })();
  return (
    <li
      className={`rounded-2xl border p-4 text-base text-forest-900 ${
        r.status === "wacht" ? "border-sunset-300 bg-sunset-50" : "border-forest-200 bg-forest-50"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-lg tracking-wider">
          <span className="text-sunset-500">{"★".repeat(r.sterren)}</span>
          <span className="text-forest-200">{"★".repeat(5 - r.sterren)}</span>
        </span>
        <span className="font-bold">{r.naam}</span>
        <span className="text-sm text-forest-800">
          · {maand} · {r.bron === "airbnb" ? "via Airbnb" : "via boshuispleuntje.nl"}
        </span>
        {r.status === "wacht" && (
          <span className="rounded-full bg-sunset-500 px-3 py-0.5 text-sm font-bold text-white">Nieuw</span>
        )}
        {r.status === "verborgen" && (
          <span className="rounded-full bg-forest-200 px-3 py-0.5 text-sm font-bold text-forest-900">Niet op de site</span>
        )}
      </div>
      <p className="mt-2 whitespace-pre-line">{r.tekst}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {r.status !== "geplaatst" && (
          <button type="button" className={`${hoofdknop} py-2`} onClick={() => zetStatus(r.id, "geplaatst")}>
            Plaatsen
          </button>
        )}
        {r.status !== "verborgen" && (
          <button type="button" className={`${tweedeKnop} py-2`} onClick={() => zetStatus(r.id, "verborgen")}>
            {r.status === "wacht" ? "Niet plaatsen" : "Van de site halen"}
          </button>
        )}
        {!zeker ? (
          <button type="button" className={`${tweedeKnop} py-2`} onClick={() => setZeker(true)}>
            Verwijderen
          </button>
        ) : (
          <>
            <button type="button" className={`${hoofdknop} py-2`} onClick={() => zetStatus(r.id, "verwijderd")}>
              Ja, verwijderen
            </button>
            <button type="button" className={`${tweedeKnop} py-2`} onClick={() => setZeker(false)}>
              Nee
            </button>
          </>
        )}
      </div>
    </li>
  );
}

function ReviewsBeheer({
  reviews,
  zetStatus,
  toevoegen,
  zichtbaar,
  zetZichtbaar,
}: {
  zichtbaar: boolean;
  zetZichtbaar: (z: boolean) => void;
  reviews: ReviewItem[];
  zetStatus: (id: string, status: "geplaatst" | "verborgen" | "verwijderd") => Promise<void>;
  toevoegen: (r: { naam: string; sterren: number; tekst: string; maand: string }) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [naam, setNaam] = useState("");
  const [sterren, setSterren] = useState(5);
  const [maand, setMaand] = useState("");
  const [tekst, setTekst] = useState("");
  const [bezig, setBezig] = useState(false);
  const nieuw = reviews.filter((r) => r.status === "wacht").length;

  return (
    <section id="reviews" className={`${kaart} scroll-mt-4`}>
      <h2 className="text-2xl text-forest-900">
        Reviews
        {nieuw > 0 && (
          <span className="ml-2 rounded-full bg-sunset-500 px-3 py-0.5 align-middle text-base text-white">{nieuw} nieuw</span>
        )}
      </h2>
      <button
        type="button"
        className={`${tweedeKnop} mt-3 py-2`}
        onClick={() => zetZichtbaar(!zichtbaar)}
        aria-expanded={zichtbaar}
      >
        {zichtbaar ? "Reviews verbergen" : "Reviews tonen"}
      </button>
      {zichtbaar && (
      <>
      <p className="mt-4 text-base text-forest-800">
        Gasten van boshuispleuntje.nl krijgen in de vertrekmail een link om een review te schrijven.
        Een nieuwe review komt pas op de site als jij op <strong>Plaatsen</strong> tikt.
      </p>
      {reviews.length === 0 ? (
        <p className="mt-3 text-lg text-forest-900">Nog geen reviews.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {reviews.map((r) => (
            <ReviewRegel key={r.id} r={r} zetStatus={zetStatus} />
          ))}
        </ul>
      )}

      {!open ? (
        <button type="button" className={`${tweedeKnop} mt-4 py-2`} onClick={() => setOpen(true)}>
          Airbnb-review toevoegen
        </button>
      ) : (
        <form
          className="mt-5 rounded-2xl bg-forest-50 p-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBezig(true);
            const gelukt = await toevoegen({ naam, sterren, tekst, maand });
            setBezig(false);
            if (gelukt) {
              setNaam("");
              setTekst("");
              setMaand("");
              setSterren(5);
              setOpen(false);
            }
          }}
        >
          <h3 className="text-xl text-forest-900">Airbnb-review toevoegen</h3>
          <label className="mt-3 block text-lg font-semibold text-forest-900">
            Naam (zoals op Airbnb)
            <input className={veld} value={naam} onChange={(e) => setNaam(e.target.value)} maxLength={40} required />
          </label>
          <label className="mt-3 block text-lg font-semibold text-forest-900">
            Sterren
            <select className={veld} value={sterren} onChange={(e) => setSterren(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)} ({n})
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-lg font-semibold text-forest-900">
            Maand van het verblijf
            <input className={veld} type="month" value={maand} onChange={(e) => setMaand(e.target.value)} required />
          </label>
          <label className="mt-3 block text-lg font-semibold text-forest-900">
            Tekst van de review
            <textarea className={`${veld} min-h-32 text-base`} value={tekst} onChange={(e) => setTekst(e.target.value)} maxLength={2000} required />
          </label>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" className={hoofdknop} disabled={bezig}>
              {bezig ? "Bezig…" : "Toevoegen en plaatsen"}
            </button>
            <button type="button" className={tweedeKnop} onClick={() => setOpen(false)}>
              Annuleren
            </button>
          </div>
        </form>
      )}
      </>
      )}
    </section>
  );
}

// Gasten die via de Duitse, Engelse of Franse website boeken, krijgen de mails in die taal (22 okt 2026)
const MAIL_TALEN: { taal: MailTaal; naam: string }[] = [
  { taal: "nl", naam: "Nederlands" },
  { taal: "de", naam: "Duits" },
  { taal: "en", naam: "Engels" },
  { taal: "fr", naam: "Frans" },
];

const MAIL_NAMEN: Record<MailSoort, { titel: string; wanneer: string }> = {
  bevestiging: { titel: "Bevestiging", wanneer: "Direct na het betalen" },
  aankomst: { titel: "Dag voor aankomst", wanneer: "De dag vóór aankomst om 9:00" },
  avond_voor_vertrek: { titel: "Avond voor vertrek", wanneer: "De avond vóór vertrek om 18:00" },
  vertrekdag: { titel: "Vertrekdag", wanneer: "De ochtend van vertrek om 9:00" },
};

// Melding bij een vertaling waarvan de Nederlandse tekst sindsdien is veranderd, met een knop
// "Vertaling is goed zo" (geldt voor Duits, Engels en Frans tegelijk; Marjolein spreekt die talen niet)
function Verouderd({ goedZo, uit }: { goedZo: () => void; uit: boolean }) {
  return (
    <span className="mt-1 mb-2 block rounded-xl bg-sunset-100 px-3 py-2 text-sm font-normal text-forest-900">
      De Nederlandse tekst is anders dan de tekst waar deze vertaling van gemaakt is. De vertaling is wel compleet.
      Vind je het goed zo, tik dan op de knop; dan verdwijnt het bolletje bij Duits, Engels en Frans. Je kunt het
      ook aan Claude vragen.
      <button
        type="button"
        onClick={goedZo}
        disabled={uit}
        title={uit ? "Sla eerst je wijzigingen op" : undefined}
        className="mt-2 block rounded-full bg-forest-700 px-4 py-2 text-sm font-semibold text-cream disabled:opacity-50"
      >
        Vertaling is goed zo
      </button>
    </span>
  );
}

// taal/setTaal komen van buiten: na opslaan wordt dit blok opnieuw opgebouwd en dan blijft de gekozen taal staan
function MailsBeheer({
  instellingen,
  opslaan,
  taal,
  setTaal,
  vertalingGoed,
}: {
  instellingen: MailInstellingen;
  opslaan: (m: MailInstellingen) => Promise<boolean>;
  taal: MailTaal;
  setTaal: (t: MailTaal) => void;
  vertalingGoed: (soort: MailSoort | "uitchecken") => void;
}) {
  const [waarden, setWaarden] = useState<MailInstellingen>(instellingen);
  const [open, setOpen] = useState<MailSoort | null>(null);
  const [bezig, setBezig] = useState(false);
  const [opgeslagen, setOpgeslagen] = useState(false);
  const [voorbeeld, setVoorbeeld] = useState("");

  const gewijzigd = JSON.stringify(waarden) !== JSON.stringify(instellingen);
  const soorten = Object.keys(MAIL_NAMEN) as MailSoort[];
  const taalNaam = MAIL_TALEN.find((t) => t.taal === taal)?.naam ?? "";

  // De teksten in de gekozen taal (Nederlands, of een vertaling)
  const huidig = taal === "nl" ? { uitchecken: waarden.uitchecken, teksten: waarden.teksten } : waarden.vertalingen[taal];
  // Waarschuwingen komen van de opgeslagen versie
  const verouderd = taal === "nl" ? {} : (instellingen.vertalingen[taal]?.verouderd ?? {});
  function taalVerouderd(t: MailTaal) {
    if (t === "nl") return false;
    return Object.values(instellingen.vertalingen[t]?.verouderd ?? {}).some(Boolean);
  }

  function zetHuidig(nieuw: { uitchecken: string; teksten: MailInstellingen["teksten"] }) {
    setOpgeslagen(false);
    setWaarden((w) =>
      taal === "nl"
        ? { ...w, uitchecken: nieuw.uitchecken, teksten: nieuw.teksten }
        : { ...w, vertalingen: { ...w.vertalingen, [taal]: { ...w.vertalingen[taal], ...nieuw } } },
    );
  }

  function zetTekst(soort: MailSoort, veldnaam: "onderwerp" | "tekst", waarde: string) {
    zetHuidig({ ...huidig, teksten: { ...huidig.teksten, [soort]: { ...huidig.teksten[soort], [veldnaam]: waarde } } });
  }

  return (
    <section className={kaartBlauw}>
      <h3 className="text-2xl text-forest-900">Zo werken de mails</h3>
      <p className="mt-2 text-base text-forest-800">
        Gasten die via boshuispleuntje.nl boeken, krijgen deze vier mails vanzelf, in deze volgorde. Jij krijgt
        steeds een kopie. Airbnb-gasten krijgen ze niet; die krijgen jouw berichten in Airbnb.
      </p>

      <div className="mt-5 rounded-2xl bg-sky-50 p-4">
        <div className="text-lg font-semibold text-forest-900">Taal van de mails</div>
        <p className="mt-1 text-sm text-forest-800">
          Gasten die via de Duitse, Engelse of Franse website boeken, krijgen de mails in die taal.
          Kies hier welke versie je wilt bekijken of aanpassen.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {MAIL_TALEN.map((t) => (
            <button
              key={t.taal}
              type="button"
              onClick={() => setTaal(t.taal)}
              aria-pressed={taal === t.taal}
              className={`rounded-full border px-4 py-2 text-base font-semibold ${
                taal === t.taal
                  ? "border-sky-700 bg-sky-700 text-white"
                  : "border-stone-300 bg-white text-forest-900"
              }`}
            >
              {t.naam}
              {taalVerouderd(t.taal) && <span className="ml-1.5 text-booked" aria-label="(controleren)">●</span>}
            </button>
          ))}
        </div>
        {taal !== "nl" && (
          <p className="mt-3 text-sm text-forest-800">
            Pas je later de Nederlandse tekst aan, dan zie je hier een rood bolletje bij de vertaling die je even moet
            nakijken. Je kunt de vertaling dan zelf aanpassen, of Claude vragen om het te doen.
          </p>
        )}
      </div>

      <ol className="mt-5 space-y-4">
        {soorten.map((soort, nr) => (
          <li key={soort} className="rounded-2xl border-2 border-sky-300 bg-sky-50 p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-sky-700 text-lg font-bold text-white"
                >
                  {nr + 1}
                </span>
                <div>
                  <div className="text-lg font-bold text-forest-900">
                    Mail {nr + 1}: {MAIL_NAMEN[soort].titel}
                    {(verouderd[soort] || (soort === "avond_voor_vertrek" && verouderd.uitchecken)) && (
                      <span className="ml-1.5 text-booked" aria-label="(controleren)">●</span>
                    )}
                  </div>
                  <div className="text-sm text-forest-800">{MAIL_NAMEN[soort].wanneer}</div>
                  {soort === "avond_voor_vertrek" && (
                    <div className="text-sm text-forest-800">Met de check-out lijst</div>
                  )}
                </div>
              </div>
              <button
                type="button"
                className={`${tweedeKnop} py-2`}
                onClick={() => setOpen(open === soort ? null : soort)}
              >
                {open === soort ? "Sluiten" : "Tekst bekijken"}
              </button>
            </div>
            {open === soort && (
              <div className="mt-3">
                {verouderd[soort] && <Verouderd goedZo={() => vertalingGoed(soort)} uit={gewijzigd} />}
                {soort === "aankomst" && (
                  <label className="mb-4 block rounded-2xl border-2 border-sky-200 bg-sky-50 p-4 text-base font-semibold text-forest-900">
                    Code sleutelkluisje
                    <input
                      className={`${veld} w-40 font-mono`}
                      value={waarden.sleutelcode}
                      onChange={(e) => {
                        setOpgeslagen(false);
                        setWaarden((w) => ({ ...w, sleutelcode: e.target.value }));
                      }}
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={40}
                    />
                    <span className="mt-1 block text-sm font-normal text-forest-800">
                      Komt in deze mail. Staat alleen veilig op de server.
                    </span>
                  </label>
                )}
                {soort === "avond_voor_vertrek" && (
                  <div className="mb-4 rounded-2xl border-2 border-sky-200 bg-sky-50 p-4">
                    <label className="block text-base font-semibold text-forest-900">
                      Check-out lijst: wat gasten doen voor vertrek{taal !== "nl" && ` (${taalNaam})`}
                      {verouderd.uitchecken && <Verouderd goedZo={() => vertalingGoed("uitchecken")} uit={gewijzigd} />}
                      <textarea
                        className={`${veld} min-h-48 text-base`}
                        value={huidig.uitchecken}
                        onChange={(e) => zetHuidig({ ...huidig, uitchecken: e.target.value })}
                        maxLength={4000}
                      />
                    </label>
                    <span className="mt-1 block text-sm text-forest-800">
                      Dit lijstje komt in deze mail op de plek van {"{uitchecken}"}. Het staat er dus maar één keer in.
                    </span>
                  </div>
                )}
                <label className="block text-base font-semibold text-forest-900">
                  Onderwerp
                  <input
                    className={`${veld} text-base`}
                    value={huidig.teksten[soort].onderwerp}
                    onChange={(e) => zetTekst(soort, "onderwerp", e.target.value)}
                    maxLength={150}
                  />
                </label>
                <label className="mt-3 block text-base font-semibold text-forest-900">
                  Tekst
                  <textarea
                    className={`${veld} min-h-80 text-base`}
                    value={huidig.teksten[soort].tekst}
                    onChange={(e) => zetTekst(soort, "tekst", e.target.value)}
                    maxLength={8000}
                  />
                </label>
                <p className="mt-2 text-sm text-forest-800">
                  Woorden tussen {"{ }"} worden vanzelf ingevuld, zoals {"{voornaam}"},{" "}
                  {"{aankomst}"}, {"{vertrek}"}, {"{nachten}"}, {"{personen}"}, {"{bedrag}"},{" "}
                  {"{sleutelcode}"}, {"{uitchecken}"} en {"{reviewlink}"} (de persoonlijke link om een review te schrijven). Laat ze staan zoals ze zijn. Haal je de reviewlink per ongeluk uit de vertrekmail, dan wordt hij er vanzelf onderaan bij gezet.
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className={`${tweedeKnop} py-2`}
                    disabled={gewijzigd}
                    title={gewijzigd ? "Sla eerst je wijzigingen op" : undefined}
                    onClick={async () => {
                      setVoorbeeld("");
                      try {
                        await api("voorbeeldmail", { soort, taal });
                        setVoorbeeld(
                          `Voorbeeld van "${MAIL_NAMEN[soort].titel}"${taal !== "nl" ? ` (${taalNaam})` : ""} is naar je mail gestuurd.`,
                        );
                      } catch (err) {
                        setVoorbeeld((err as Error).message);
                      }
                    }}
                  >
                    Stuur mij een voorbeeld
                  </button>
                  <button
                    type="button"
                    className={`${tweedeKnop} py-2`}
                    onClick={async () => {
                      if (!window.confirm("De oorspronkelijke tekst terugzetten? Daarna nog op Opslaan tikken.")) return;
                      try {
                        const r = await api<{ standaard: { onderwerp: string; tekst: string } }>("mailstandaard", { soort, taal });
                        zetHuidig({ ...huidig, teksten: { ...huidig.teksten, [soort]: r.standaard } });
                      } catch (err) {
                        setVoorbeeld((err as Error).message);
                      }
                    }}
                  >
                    Oorspronkelijke tekst
                  </button>
                </div>
                {gewijzigd && (
                  <p className="mt-2 text-sm text-forest-800">Sla eerst op om een voorbeeld te sturen.</p>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
      {voorbeeld && <Melding soort="goed" tekst={voorbeeld} />}

      <button
        type="button"
        className={`${hoofdknop} mt-5`}
        disabled={bezig || !gewijzigd}
        onClick={async () => {
          setBezig(true);
          const gelukt = await opslaan(waarden);
          setBezig(false);
          setOpgeslagen(gelukt);
        }}
      >
        {bezig ? "Bezig…" : gewijzigd ? "Opslaan" : "Opgeslagen"}
      </button>
      {opgeslagen && <Melding soort="goed" tekst="De mails zijn opgeslagen." />}
    </section>
  );
}

const PRIJS_UITLEG: Record<PrijsSleutel, { label: string; eenheid: string }> = {
  laagseizoen: { label: "Laagseizoen", eenheid: "per nacht" },
  hoogseizoen: { label: "Hoogseizoen", eenheid: "per nacht" },
  schoonmaak: { label: "Schoonmaakkosten", eenheid: "per verblijf" },
  hond: { label: "Honden", eenheid: "per verblijf" },
  toeristenbelasting: { label: "Toeristenbelasting", eenheid: "per persoon per nacht" },
};

function bedragTekst(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ",");
}

function PrijzenBeheer({
  prijzen,
  opslaan,
}: {
  prijzen: Record<PrijsSleutel, number>;
  opslaan: (p: Record<PrijsSleutel, string>) => Promise<boolean>;
}) {
  const begin = Object.fromEntries(
    Object.entries(prijzen).map(([k, v]) => [k, bedragTekst(v)]),
  ) as Record<PrijsSleutel, string>;
  const [waarden, setWaarden] = useState(begin);
  const [bezig, setBezig] = useState(false);
  const [opgeslagen, setOpgeslagen] = useState(false);
  const gewijzigd = JSON.stringify(waarden) !== JSON.stringify(begin);
  const sleutels = Object.keys(PRIJS_UITLEG) as PrijsSleutel[];

  return (
    <section className={kaartOranje}>
      <h2 className="text-2xl text-forest-900">Prijzen</h2>
      <p className="mt-2 text-base text-forest-800">
        Deze prijzen gelden voor boekingen via boshuispleuntje.nl. Wat je hier opslaat, staat
        meteen overal op de site en geldt ook bij het betalen. Boekingen die al betaald zijn,
        veranderen niet. Welke dagen hoogseizoen zijn (zomer, schoolvakanties, feestdagen),
        regelt Claude. Je prijzen op Airbnb pas je in Airbnb zelf aan.
      </p>
      <form
        className="mt-4 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBezig(true);
          setOpgeslagen(false);
          const gelukt = await opslaan(waarden);
          setBezig(false);
          setOpgeslagen(gelukt);
        }}
      >
        {sleutels.map((k) => (
          <label key={k} className="block text-lg font-semibold text-forest-900">
            {PRIJS_UITLEG[k].label}
            <span className="mt-1 flex items-center gap-3">
              <span className="text-lg">€</span>
              <input
                className={`${veld} mt-0 w-32`}
                inputMode="decimal"
                value={waarden[k]}
                onChange={(e) => {
                  setOpgeslagen(false);
                  setWaarden((w) => ({ ...w, [k]: e.target.value }));
                }}
                required
              />
              <span className="font-normal">{PRIJS_UITLEG[k].eenheid}</span>
            </span>
          </label>
        ))}
        <button type="submit" className={hoofdknop} disabled={bezig || !gewijzigd}>
          {bezig ? "Bezig…" : gewijzigd ? "Prijzen opslaan" : "Opgeslagen"}
        </button>
        {opgeslagen && <Melding soort="goed" tekst="De nieuwe prijzen staan nu op boshuispleuntje.nl." />}
      </form>
    </section>
  );
}

function ReservekopieKaart({
  laatst,
  stuurNu,
}: {
  laatst: string | null;
  stuurNu: () => Promise<boolean>;
}) {
  const [bezig, setBezig] = useState(false);
  const [klaar, setKlaar] = useState(false);
  return (
    <section className={kaartIndigo}>
      <h2 className="text-2xl text-forest-900">Reservekopie</h2>
      <p className="mt-2 text-base text-forest-800">
        Elke week krijg je automatisch een reservekopie in je Gmail, met je agenda, boekingen en
        reviews. Bewaar die mails gewoon; je hoeft er verder niets mee te doen.
      </p>
      <p className="mt-2 text-base text-forest-900">
        Laatste reservekopie: <strong>{laatst ?? "nog niet verstuurd"}</strong>
      </p>
      <button
        type="button"
        className={`${tweedeKnop} mt-3 py-2`}
        disabled={bezig}
        onClick={async () => {
          setBezig(true);
          setKlaar(await stuurNu());
          setBezig(false);
        }}
      >
        {bezig ? "Bezig…" : "Stuur nu een reservekopie"}
      </button>
      {klaar && <Melding soort="goed" tekst="Verstuurd. Kijk over een minuutje in je Gmail." />}
    </section>
  );
}

function GoogleAgendaKaart({
  link,
  nieuweLink,
}: {
  link: string;
  nieuweLink: () => Promise<boolean>;
}) {
  const [gekopieerd, setGekopieerd] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [vernieuwd, setVernieuwd] = useState(false);
  return (
    <section className={kaartIndigo}>
      <h2 className="text-2xl text-forest-900">Je boekingen in je Google Agenda</h2>
      <p className="mt-2 text-base text-forest-800">
        Met deze geheime link komen <strong>alle</strong> boekingen vanzelf in je eigen Google Agenda:
        van je site, van Airbnb en je eigen blokkades. Met namen, aantal gasten, honden en je
        notities. Google kijkt zelf een paar keer per dag of er iets nieuws is, dus een nieuwe boeking
        kan een paar uur later in je agenda verschijnen.
      </p>
      <div className="mt-3 rounded-2xl bg-forest-50 p-4 font-mono text-sm break-all text-forest-900">{link}</div>
      <button
        type="button"
        className={`${tweedeKnop} mt-3 py-2`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(link);
            setGekopieerd(true);
            setTimeout(() => setGekopieerd(false), 3000);
          } catch {
            /* kopiëren niet toegestaan: link staat erboven */
          }
        }}
      >
        {gekopieerd ? "Gekopieerd!" : "Kopieer de link"}
      </button>
      <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-base text-forest-800">
        <li>Tik hierboven op <strong>Kopieer de link</strong>.</li>
        <li>
          Open <strong>calendar.google.com</strong> in Safari, het liefst op je iPad of computer. Op de
          iPhone: tik in Safari op <strong>aA</strong> en kies <strong>Vraag desktopwebsite aan</strong>.
        </li>
        <li>
          Tik links naast <strong>Andere agenda&apos;s</strong> op het <strong>+</strong> en kies{" "}
          <strong>Via URL</strong>.
        </li>
        <li>Plak de link en tik op <strong>Agenda toevoegen</strong>. De agenda heet &quot;Pleuntje&quot;.</li>
        <li>
          Kleur kiezen: tik bij &quot;Pleuntje&quot; op de drie puntjes en kies <strong>Kobalt</strong>.
        </li>
      </ol>
      <p className="mt-3 text-sm text-forest-700">
        Deze link is geheim: wie hem heeft, kan je boekingen zien. Deel hem dus met niemand. Denk je dat
        iemand anders hem heeft? Maak dan een nieuwe link; de oude werkt dan niet meer en je voegt de
        nieuwe opnieuw toe in Google.
      </p>
      <button
        type="button"
        className={`${tweedeKnop} mt-3 py-2`}
        disabled={bezig}
        onClick={async () => {
          if (!window.confirm("Weet je het zeker? De oude link werkt dan niet meer in je Google Agenda.")) return;
          setBezig(true);
          setVernieuwd(await nieuweLink());
          setBezig(false);
        }}
      >
        {bezig ? "Bezig…" : "Maak een nieuwe link"}
      </button>
      {vernieuwd && <Melding soort="goed" tekst="Nieuwe link gemaakt. Voeg hem opnieuw toe in Google en verwijder daar de oude agenda." />}
    </section>
  );
}

function ToeristenbelastingKaart({ jaren }: { jaren: Overzicht["toeristenbelasting"] }) {
  return (
    <section className={kaartTurquoise}>
      <h2 className="text-2xl text-forest-900">Toeristenbelasting</h2>
      <p className="mt-2 text-base text-forest-800">
        Wat je via boshuispleuntje.nl hebt ontvangen aan toeristenbelasting, per jaar. Dit draag
        je zelf af aan de gemeente Putten. Boekingen via Airbnb en boekingen die je zelf hebt
        ingevoerd (bijvoorbeeld na een telefoontje) staan hier niet in.
      </p>
      {jaren.length === 0 ? (
        <p className="mt-3 text-lg text-forest-900">Nog geen betaalde boekingen via de site.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-base text-forest-900">
            <thead>
              <tr className="border-b border-forest-200 text-sm text-forest-800">
                <th className="py-2 pr-3 font-semibold">Jaar</th>
                <th className="py-2 pr-3 font-semibold">Boekingen</th>
                <th className="py-2 pr-3 font-semibold">Nachten</th>
                <th className="py-2 pr-3 font-semibold">Personen × nachten</th>
                <th className="py-2 font-semibold">Bedrag</th>
              </tr>
            </thead>
            <tbody>
              {jaren.map((j) => (
                <tr key={j.jaar} className="border-b border-forest-100">
                  <td className="py-2 pr-3 font-bold">{j.jaar}</td>
                  <td className="py-2 pr-3">{j.boekingen}</td>
                  <td className="py-2 pr-3">{j.nachten}</td>
                  <td className="py-2 pr-3">{j.persoonsnachten}</td>
                  <td className="py-2 font-bold">{j.bedrag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function TestmailKaart() {
  const [status, setStatus] = useState<"" | "bezig" | "verstuurd">("");
  const [tijd, setTijd] = useState("");
  const [fout, setFout] = useState("");

  return (
    <section className={kaartIndigo}>
      <h2 className="text-2xl text-forest-900">E-mail testen</h2>
      <p className="mt-2 text-base text-forest-800">
        Stuur een testmail naar je eigen Gmail. Zo zie je of mails van
        boshuispleuntje.nl in de inbox aankomen, en niet in de spam.
      </p>
      <button
        type="button"
        className={`${hoofdknop} mt-4`}
        disabled={status === "bezig"}
        onClick={async () => {
          setStatus("bezig");
          setFout("");
          try {
            const r = await api<{ tijd: string }>("testmail");
            setTijd(r.tijd);
            setStatus("verstuurd");
          } catch (err) {
            setStatus("");
            setFout((err as Error).message);
          }
        }}
      >
        {status === "bezig" ? "Bezig met versturen…" : "Stuur testmail"}
      </button>
      {status === "verstuurd" && (
        <Melding
          soort="goed"
          tekst={`Verstuurd om ${tijd}. Kijk over een minuutje in je Gmail, ook even in de map Spam.`}
        />
      )}
      <Melding tekst={fout} />
    </section>
  );
}

// ---------- Komende verblijven: één lijst voor Airbnb, website en eigen blokkades ----------

// Omschrijvingen die geen echte naam zijn (oude handmatige invoer)
const ALGEMENE_NAMEN = ["gasten", "geblokkeerd", "bezet"];
function echteNaam(tekst: string | undefined) {
  const t = (tekst ?? "").trim();
  return t && !ALGEMENE_NAMEN.includes(t.toLowerCase()) ? t : "";
}

type Verblijf =
  | { soort: "airbnb"; aankomst: string; vertrek: string; a: AirbnbBoeking; eigen: Blokkade[] }
  | { soort: "airbnb-dicht"; aankomst: string; vertrek: string; a: AirbnbBoeking }
  | { soort: "website"; aankomst: string; vertrek: string; b: WebsiteBoeking; blokkade?: Blokkade; dicht: AirbnbBoeking[] }
  | { soort: "eigen"; aankomst: string; vertrek: string; blokkade: Blokkade; dicht: AirbnbBoeking[] };

function overlapt(a1: string, v1: string, a2: string, v2: string) {
  return a1 < v2 && v1 > a2;
}

// Voegt alles samen tot één lijst op datum, zonder dubbelingen:
// - een eigen blokkade die samenvalt met een Airbnb-boeking is dezelfde gast (vroeger met de hand ingevuld);
// - "dichtgezet in Airbnb" dat overlapt met een eigen blokkade is dezelfde periode (Airbnb stuurt onze blokkade
//   terug, of Marjolein zette hem daar met de hand dicht, soms een dag verschoven): dan één kaartje;
// - een betaalde websiteboeking heeft ook een blokkade: die tonen we één keer, als websiteboeking.
function maakVerblijven(o: Overzicht): Verblijf[] {
  const uit: Verblijf[] = [];
  const samengevoegd = new Set<string>();
  for (const a of o.airbnb) {
    if (a.soort !== "boeking") continue;
    const eigen = o.blokkades.filter(
      (bl) => !bl.boeking && !bl.email && overlapt(bl.aankomst, bl.vertrek, a.aankomst, a.vertrek),
    );
    eigen.forEach((bl) => samengevoegd.add(bl.id));
    uit.push({ soort: "airbnb", aankomst: a.aankomst, vertrek: a.vertrek, a, eigen });
  }
  const opBlokkade = new Map<string, Extract<Verblijf, { dicht: AirbnbBoeking[] }>>();
  const websiteIds = new Set(o.boekingen.map((b) => b.id));
  for (const b of o.boekingen) {
    const blokkade = o.blokkades.find((bl) => bl.boeking === b.id);
    const v: Verblijf = { soort: "website", aankomst: b.aankomst, vertrek: b.vertrek, b, blokkade, dicht: [] };
    if (blokkade) opBlokkade.set(blokkade.id, v);
    uit.push(v);
  }
  for (const bl of o.blokkades) {
    if (samengevoegd.has(bl.id)) continue;
    if (bl.boeking && websiteIds.has(bl.boeking)) continue;
    const v: Verblijf = { soort: "eigen", aankomst: bl.aankomst, vertrek: bl.vertrek, blokkade: bl, dicht: [] };
    opBlokkade.set(bl.id, v);
    uit.push(v);
  }
  for (const a of o.airbnb) {
    if (a.soort !== "geblokkeerd") continue;
    const overlappend = o.blokkades.filter((bl) => overlapt(bl.aankomst, bl.vertrek, a.aankomst, a.vertrek));
    if (overlappend.length > 0) {
      // Valt het precies binnen onze eigen blokkades, dan is het gewoon onze eigen blokkade terug van Airbnb
      const binnen = overlappend.some((bl) => bl.aankomst <= a.aankomst && bl.vertrek >= a.vertrek);
      const v = overlappend.map((bl) => opBlokkade.get(bl.id)).find(Boolean);
      if (v && !binnen) v.dicht.push(a);
      if (v || binnen) continue;
    }
    uit.push({ soort: "airbnb-dicht", aankomst: a.aankomst, vertrek: a.vertrek, a });
  }
  return uit.sort((x, y) => x.aankomst.localeCompare(y.aankomst) || x.vertrek.localeCompare(y.vertrek));
}

function BronLabel({ soort }: { soort: Verblijf["soort"] }) {
  const stijl: Record<Verblijf["soort"], [string, string]> = {
    airbnb: ["Geboekt via Airbnb", "bg-rose-100 text-rose-900"],
    "airbnb-dicht": ["Dichtgezet in Airbnb", "bg-stone-200 text-stone-800"],
    website: ["Geboekt via je website", "bg-green-100 text-green-900"],
    eigen: ["Door jou ingevuld", "bg-sunset-100 text-forest-900"],
  };
  const [tekst, kleur] = stijl[soort];
  return <span className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${kleur}`}>{tekst}</span>;
}

// Knop + invulvakjes om de naam (of reden) en een notitie aan te passen
function Aanpassen({
  naam,
  notitie,
  naamLabel,
  naamVoorbeeld,
  opvallend,
  opslaan,
}: {
  naam: string;
  notitie: string;
  naamLabel: string;
  naamVoorbeeld: string;
  opvallend: boolean;
  opslaan: (naam: string, notitie: string) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [n, setN] = useState(naam);
  const [t, setT] = useState(notitie);
  const [bezig, setBezig] = useState(false);
  if (!open) {
    return (
      <button
        type="button"
        className={`${opvallend ? hoofdknop : tweedeKnop} py-2`}
        onClick={() => {
          setN(naam);
          setT(notitie);
          setOpen(true);
        }}
      >
        {naam ? "Naam en notitie aanpassen" : "Naam invullen"}
      </button>
    );
  }
  return (
    <div className="w-full rounded-2xl bg-forest-50 p-4">
      <label className="block text-base font-semibold text-forest-900">
        {naamLabel}
        <input
          className={`${veld} text-base`}
          value={n}
          maxLength={80}
          placeholder={naamVoorbeeld}
          autoFocus
          onChange={(e) => setN(e.target.value)}
        />
      </label>
      <label className="mt-3 block text-base font-semibold text-forest-900">
        Notitie (niet verplicht)
        <textarea
          className={`${veld} min-h-20 text-base`}
          value={t}
          maxLength={220}
          placeholder="Bijvoorbeeld: 2 personen + hond, mogen later uitchecken (13:00)"
          onChange={(e) => setT(e.target.value)}
        />
      </label>
      <p className="mt-1 text-sm text-forest-700">Alleen voor jou: gasten zien dit niet.</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          className={`${hoofdknop} py-2`}
          disabled={bezig}
          onClick={async () => {
            setBezig(true);
            const gelukt = await opslaan(n.trim(), t.trim());
            setBezig(false);
            if (gelukt) setOpen(false);
          }}
        >
          {bezig ? "Bezig…" : "Opslaan"}
        </button>
        <button type="button" className={`${tweedeKnop} py-2`} onClick={() => setOpen(false)}>
          Annuleren
        </button>
      </div>
    </div>
  );
}

// Airbnb bewaart één tekst per boeking: eerste regel = naam, de rest = notitie
function splitsNotitie(tekst: string): [string, string] {
  const [eerste, ...rest] = tekst.trim().split("\n");
  return [eerste.trim(), rest.join("\n").trim()];
}
function plakNotitie(naam: string, notitie: string) {
  return naam && notitie ? `${naam}\n${notitie}` : naam || notitie;
}

function VrijgevenKnop({
  blokkade,
  verwijder,
}: {
  blokkade: Blokkade;
  verwijder: (id: string) => Promise<void>;
}) {
  const [zeker, setZeker] = useState(false);
  const [bezig, setBezig] = useState(false);
  if (!zeker) {
    return (
      <button type="button" className={`${tweedeKnop} py-2`} onClick={() => setZeker(true)}>
        {blokkade.boeking ? "Annuleren" : "Vrijgeven"}
      </button>
    );
  }
  return (
    <div className="flex w-full flex-wrap items-center gap-3">
      <span className="font-semibold text-forest-900">
        {blokkade.boeking
          ? "Dit is een betaalde boeking. Annuleren geeft de datums vrij; terugbetalen doe je zelf in Mollie. Doorgaan?"
          : "Deze datums weer vrijgeven?"}
      </span>
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
        {bezig ? "Bezig…" : "Ja"}
      </button>
      <button type="button" className={`${tweedeKnop} py-2`} onClick={() => setZeker(false)}>
        Nee
      </button>
    </div>
  );
}

// Naam groot (bij gasten in een donkergroen geschulpt kadertje)
function Naam({ tekst, leeg, versierd }: { tekst: string; leeg: string; versierd: boolean }) {
  if (!tekst) return <div className="mt-2 text-xl font-bold italic text-sunset-700">{leeg}</div>;
  return versierd ? (
    <div>
      <span className="gastnaam">
        <span className="gastnaam-binnen">{tekst}</span>
      </span>
    </div>
  ) : (
    <div className="mt-2 text-xl font-bold text-forest-900">{tekst}</div>
  );
}

function Notitie({ tekst }: { tekst: string }) {
  if (!tekst) return null;
  return (
    <div className="mt-2 rounded-xl bg-sunset-50 px-3 py-2 text-base whitespace-pre-line text-forest-900">
      <span className="font-semibold">Notitie:</span> {tekst}
    </div>
  );
}

// Airbnb heeft (een deel van) deze periode ook dichtgezet, met andere datums
function OokDichtInAirbnb({ dicht }: { dicht: AirbnbBoeking[] }) {
  if (dicht.length === 0) return null;
  return (
    <div className="mt-2 rounded-xl bg-stone-100 px-3 py-2 text-base text-forest-900">
      {dicht.map((a) => (
        <p key={a.sleutel}>
          In Airbnb staat <Periode aankomst={a.aankomst} vertrek={a.vertrek} /> dicht. Klopt dat niet? Pas het dan aan
          in Airbnb.
        </p>
      ))}
    </div>
  );
}

function VerblijfKaart({
  v,
  airbnbNotitie,
  blokkadeNaam,
  verwijder,
}: {
  v: Verblijf;
  airbnbNotitie: (sleutel: string, tekst: string) => Promise<boolean>;
  blokkadeNaam: (id: string, naam: string, notitie: string) => Promise<boolean>;
  verwijder: (id: string) => Promise<void>;
}) {
  const rand =
    v.soort === "website" && v.b.conflict ? "border-red-300 bg-red-50" : "border-green-300 bg-white";
  let naam = "";
  let notitie = "";
  let leeg = "Naam nog invullen";
  let inhoud: React.ReactNode = null;
  let knoppen: React.ReactNode = null;
  const airbnbLink = (link?: string) =>
    link ? (
      <a href={link} target="_blank" rel="noopener noreferrer" className={`${tweedeKnop} py-2`}>
        Bekijk in Airbnb
      </a>
    ) : null;

  if (v.soort === "airbnb" || v.soort === "airbnb-dicht") {
    const gast = v.soort === "airbnb";
    [naam, notitie] = splitsNotitie(v.a.notitie);
    if (gast && !naam && !notitie) {
      // Nog niets ingevuld: gebruik wat er vroeger met de hand bij een blokkade stond
      const bl = v.eigen.find((x) => echteNaam(x.omschrijving));
      if (bl) {
        naam = echteNaam(bl.omschrijving);
        notitie = (bl.notitie ?? "").trim();
      }
    }
    if (!gast) leeg = "Geen reden ingevuld";
    knoppen = (
      <>
        <Aanpassen
          naam={naam}
          notitie={notitie}
          naamLabel={gast ? "Naam van de gasten" : "Reden"}
          naamVoorbeeld={gast ? "Bijvoorbeeld: Anna en Peter de Vries" : "Bijvoorbeeld: zelf in Pleuntje, of onderhoud"}
          opvallend={gast && !naam}
          opslaan={(n, t) => airbnbNotitie(v.a.sleutel, plakNotitie(n, t))}
        />
        {airbnbLink(v.a.link)}
      </>
    );
  } else if (v.soort === "website") {
    const b = v.b;
    naam = (v.blokkade?.weergavenaam ?? "").trim() || b.naam;
    notitie = (v.blokkade?.notitie ?? "").trim();
    inhoud = (
      <>
        <div className="mt-2 flex flex-wrap gap-2">
          {b.status === "betaald" ? (
            <span className="rounded-full bg-green-100 px-3 py-0.5 text-sm font-bold text-green-900">
              ✓ Betaald {b.bedrag}
            </span>
          ) : (
            <span className="rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-bold text-yellow-900">
              Is aan het betalen…
            </span>
          )}
          {b.test && (
            <span className="rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-bold text-yellow-900">test</span>
          )}
        </div>
        {b.conflict && (
          <p className="mt-2 font-bold text-red-900">
            Let op: dubbel geboekt. Deze datums waren al bezet. Neem contact op met de gast en betaal terug via
            Mollie.
          </p>
        )}
        <div className="mt-2">
          {b.personen} {b.personen === 1 ? "persoon" : "personen"}
          {b.honden > 0 && `, ${b.honden} ${b.honden === 1 ? "hond" : "honden"}`}
        </div>
        <div className="mt-1 break-all">
          <a className="underline" href={`mailto:${b.email}`}>{b.email}</a>
          {b.telefoon && (
            <>
              {" · "}
              <a className="underline" href={`tel:${b.telefoon.replace(/[^+\d]/g, "")}`}>{b.telefoon}</a>
            </>
          )}
        </div>
        <GastTaal taal={b.taal} />
        {b.bericht && (
          <p className="mt-2 rounded-xl bg-forest-50 p-3 whitespace-pre-line">
            <span className="font-semibold">Bericht van de gast:</span> {b.bericht}
          </p>
        )}
        <OokDichtInAirbnb dicht={v.dicht} />
      </>
    );
    const bl = v.blokkade;
    knoppen = bl ? (
      <>
        <Aanpassen
          naam={naam}
          notitie={notitie}
          naamLabel="Naam van de gasten (in de mails blijft de naam die de gast zelf invulde)"
          naamVoorbeeld="Bijvoorbeeld: Anna en Peter de Vries"
          opvallend={false}
          opslaan={(n, t) => blokkadeNaam(bl.id, n, t)}
        />
        <VrijgevenKnop blokkade={bl} verwijder={verwijder} />
      </>
    ) : null;
  } else {
    const bl = v.blokkade;
    naam = echteNaam(bl.omschrijving);
    notitie = (bl.notitie ?? "").trim();
    leeg = "Geen naam of reden ingevuld";
    inhoud = (
      <>
        {bl.email && (
          <div className="mt-1 break-all text-base text-forest-800">
            <a className="underline" href={`mailto:${bl.email}`}>{bl.email}</a>
          </div>
        )}
        {bl.mailplanning && bl.mailplanning.length > 0 && (
          <ul className="mt-2 space-y-0.5 text-sm text-forest-800">
            {bl.mailplanning.map((m) => (
              <li key={m.naam}>
                {m.status === "verstuurd" ? "✓" : m.status === "overgeslagen" ? "–" : "✉︎"} {m.naam}:{" "}
                {m.status === "verstuurd"
                  ? "verstuurd"
                  : m.status === "overgeslagen"
                    ? "niet verstuurd (was al voorbij)"
                    : `${mooieDatum(m.moment.slice(0, 10))} om ${m.moment.slice(11)}`}
              </li>
            ))}
          </ul>
        )}
        <OokDichtInAirbnb dicht={v.dicht} />
      </>
    );
    knoppen = (
      <>
        <Aanpassen
          naam={naam}
          notitie={notitie}
          naamLabel={bl.email ? "Naam van de gasten (staat ook in hun mails)" : "Naam van de gasten, of de reden"}
          naamVoorbeeld="Bijvoorbeeld: Maarten, of: zelf in Pleuntje"
          opvallend={false}
          opslaan={(n, t) => blokkadeNaam(bl.id, n, t)}
        />
        <VrijgevenKnop blokkade={bl} verwijder={verwijder} />
      </>
    );
  }

  return (
    <li className={`rounded-2xl border p-4 text-base text-forest-900 ${rand}`}>
      <div className="text-lg text-forest-900">
        <Periode aankomst={v.aankomst} vertrek={v.vertrek} />
      </div>
      <div className="mt-2">
        <BronLabel soort={v.soort} />
      </div>
      <Naam tekst={naam} leeg={leeg} versierd={v.soort !== "airbnb-dicht"} />
      <Notitie tekst={notitie} />
      {inhoud}
      {knoppen && <div className="mt-3 flex flex-wrap items-center gap-3">{knoppen}</div>}
    </li>
  );
}

function BeheerScherm({ uitgelogd }: { uitgelogd: () => void }) {
  const [overzicht, setOverzicht] = useState<Overzicht | null>(null);
  const [mailTaal, setMailTaal] = useState<MailTaal>("nl");
  const [aankomst, setAankomst] = useState("");
  const [vertrek, setVertrek] = useState("");
  const [omschrijving, setOmschrijving] = useState("");
  const [gastEmail, setGastEmail] = useState("");
  const [gastTaal, setGastTaal] = useState<MailTaal>("nl");
  const [fout, setFout] = useState("");
  const [goed, setGoed] = useState("");
  const [reviewsZichtbaar, setReviewsZichtbaar] = useState(false);
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

  const [verversen, setVerversen] = useState<"" | "bezig" | "klaar" | "mislukt">("");

  // Haalt de Airbnb-agenda direct opnieuw op, en laat zien dat er iets gebeurt
  async function ververs() {
    setVerversen("bezig");
    const start = Date.now();
    try {
      const data = await api<Overzicht>("overzicht", { ververs: true });
      // Even laten zien dat er gewerkt wordt, ook als het heel snel gaat
      await new Promise((r) => setTimeout(r, Math.max(0, 800 - (Date.now() - start))));
      setOverzicht(data);
      setVerversen(data.airbnbGelukt ? "klaar" : "mislukt");
      setTimeout(() => setVerversen((v) => (v === "klaar" ? "" : v)), 5000);
    } catch (err) {
      setVerversen("");
      behandelFout(err);
    }
  }

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
      setOverzicht(await api<Overzicht>("blokkeer", { aankomst, vertrek, omschrijving, email: gastEmail, taal: gastTaal }));
      setGoed(
        `Geblokkeerd: ${mooieDatum(aankomst)} tot ${mooieDatum(vertrek)}. Dit staat nu ook op boshuispleuntje.nl.`,
      );
      setAankomst("");
      setVertrek("");
      setOmschrijving("");
      setGastEmail("");
      setGastTaal("nl");
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

  async function mollieOpslaan(sleutel: string): Promise<boolean> {
    setFout("");
    try {
      setOverzicht(await api<Overzicht>("mollie_sleutel", { sleutel }));
      setGoed("De Mollie-sleutel is opgeslagen en werkt.");
      return true;
    } catch (err) {
      behandelFout(err);
      return false;
    }
  }

  async function mollieVerwijder() {
    setFout("");
    try {
      setOverzicht(await api<Overzicht>("mollie_verwijder"));
      setGoed("Online betalen staat uit. Gasten sturen weer een aanvraag.");
    } catch (err) {
      behandelFout(err);
    }
  }

  async function reviewStatus(id: string, status: "geplaatst" | "verborgen" | "verwijderd") {
    setFout("");
    try {
      setOverzicht(await api<Overzicht>("review_status", { id, status }));
      setGoed(
        status === "geplaatst"
          ? "De review staat nu op boshuispleuntje.nl."
          : status === "verborgen"
            ? "De review staat niet (meer) op de site."
            : "De review is verwijderd.",
      );
    } catch (err) {
      behandelFout(err);
    }
  }

  async function reviewToevoegen(r: { naam: string; sterren: number; tekst: string; maand: string }) {
    setFout("");
    try {
      setOverzicht(await api<Overzicht>("review_toevoegen", r));
      setGoed("De review is toegevoegd en staat op boshuispleuntje.nl.");
      return true;
    } catch (err) {
      behandelFout(err);
      return false;
    }
  }

  async function prijzenOpslaan(prijzen: Record<PrijsSleutel, string>): Promise<boolean> {
    setFout("");
    try {
      setOverzicht(await api<Overzicht>("prijzen", { prijzen }));
      return true;
    } catch (err) {
      behandelFout(err);
      return false;
    }
  }

  async function priveAgendaNieuw(): Promise<boolean> {
    setFout("");
    try {
      setOverzicht(await api<Overzicht>("prive_agenda_nieuw"));
      return true;
    } catch (err) {
      behandelFout(err);
      return false;
    }
  }

  async function reservekopieNu(): Promise<boolean> {
    setFout("");
    try {
      setOverzicht(await api<Overzicht>("reservekopie"));
      return true;
    } catch (err) {
      behandelFout(err);
      return false;
    }
  }

  async function mailsOpslaan(mails: MailInstellingen): Promise<boolean> {
    setFout("");
    try {
      setOverzicht(await api<Overzicht>("mailinstellingen", { mails }));
      return true;
    } catch (err) {
      behandelFout(err);
      return false;
    }
  }

  async function airbnbNotitie(sleutel: string, tekst: string): Promise<boolean> {
    setFout("");
    try {
      setOverzicht(await api<Overzicht>("airbnb_notitie", { sleutel, tekst }));
      return true;
    } catch (err) {
      behandelFout(err);
      return false;
    }
  }
  async function blokkadeNaam(id: string, naam: string, notitie: string): Promise<boolean> {
    setFout("");
    try {
      setOverzicht(await api<Overzicht>("blokkade_naam", { id, naam, notitie }));
      return true;
    } catch (err) {
      behandelFout(err);
      return false;
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
  const verblijven = maakVerblijven(overzicht);
  const nieuweReviews = overzicht.reviews.filter((r) => r.status === "wacht").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl text-forest-900 sm:text-4xl">Agenda van Pleuntje</h1>
        <button type="button" className={`${tweedeKnop} py-2`} onClick={uitloggen}>
          Uitloggen
        </button>
      </div>

      {nieuweReviews > 0 && (
        <button
          type="button"
          className="w-full cursor-pointer rounded-2xl bg-sunset-50 p-4 text-left text-base text-forest-900"
          onClick={() => {
            setReviewsZichtbaar(true);
            setTimeout(() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" }), 50);
          }}
        >
          {nieuweReviews === 1 ? "Er wacht 1 nieuwe review" : `Er wachten ${nieuweReviews} nieuwe reviews`} op
          je goedkeuring. <span className="font-semibold underline">Bekijken</span>
        </button>
      )}

      <GroepKnoppen />

      <Groep id="gasten">
      {/* Komende verblijven: Airbnb, website en eigen blokkades in één lijst */}
      <section className={kaartGroen}>
        <h2 className="text-2xl text-forest-900">Komende verblijven</h2>
        <p className="mt-2 text-base text-forest-800">
          Alles op datum, met bij elk verblijf waar het vandaan komt. Airbnb geeft geen namen door: met{" "}
          <strong>Naam invullen</strong> zet je die er zelf bij (alleen voor jou).
        </p>
        {!overzicht.airbnbGelukt && (
          <Melding tekst="Het ophalen van de Airbnb-agenda lukte de laatste keer niet. De site gebruikt zolang de vorige versie en probeert het elk kwartier opnieuw." />
        )}
        {verblijven.length === 0 ? (
          <p className="mt-3 text-lg text-forest-900">Er staan geen komende verblijven.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {verblijven.map((v) => (
              <VerblijfKaart
                key={`${v.soort}-${v.soort === "eigen" ? v.blokkade.id : v.soort === "website" ? v.b.id : v.a.sleutel}`}
                v={v}
                airbnbNotitie={airbnbNotitie}
                blokkadeNaam={blokkadeNaam}
                verwijder={verwijder}
              />
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={`${tweedeKnop} py-2`}
            onClick={ververs}
            disabled={verversen === "bezig"}
          >
            {verversen === "bezig" ? (
              <>
                <span
                  aria-hidden
                  className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-forest-900 border-t-transparent"
                />
                Bezig met ophalen…
              </>
            ) : (
              "Nu verversen"
            )}
          </button>
          {verversen === "klaar" && (
            <span role="status" className="rounded-full bg-green-100 px-3 py-1 text-base font-semibold text-green-900">
              ✓ Bijgewerkt
            </span>
          )}
          {verversen === "mislukt" && (
            <span role="status" className="rounded-full bg-red-100 px-3 py-1 text-base font-semibold text-red-900">
              Airbnb gaf geen antwoord, probeer het zo nog eens
            </span>
          )}
        </div>
        {overzicht.airbnbOpgehaald && (
          <p className="mt-2 text-sm text-forest-700">
            Airbnb laatst opgehaald: {overzicht.airbnbOpgehaald}
          </p>
        )}
      </section>

      {/* Aanvragen (zolang online betalen niet aanstaat, of als er nog open aanvragen zijn) */}
      {(overzicht.mollie.modus !== "live" || overzicht.aanvragen.length > 0) && (
      <section className={kaartGroen}>
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
      )}

      {/* Blokkeren */}
      <section className={kaartGroen}>
        <h2 className="text-2xl text-forest-900">Datums blokkeren</h2>
        <div className="mt-4">
          <AvailabilityCalendar
            nights={nachten}
            showPrices={false}
            instruction="Tik op de aankomstdag, en daarna op de vertrekdag."
            selectedCheckIn={aankomst}
            selectedCheckOut={vertrek}
            onSelectDate={kiesDag}
            onClearSelection={() => {
              setAankomst("");
              setVertrek("");
            }}
          />
        </div>

        {aankomst && (
          <div className="mt-6 rounded-2xl bg-forest-50 p-5" data-houd-datums>
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
                <label className="mt-4 block text-lg font-semibold text-forest-900">
                  E-mailadres van de gast (niet verplicht)
                  <input
                    className={veld}
                    type="email"
                    inputMode="email"
                    autoCapitalize="none"
                    value={gastEmail}
                    onChange={(e) => setGastEmail(e.target.value)}
                    maxLength={150}
                    placeholder="Alleen voor gasten die jou zelf benaderen"
                  />
                  <span className="mt-1 block text-sm font-normal text-forest-800">
                    Vul je dit in, dan krijgt de gast vanzelf de mails voor aankomst en vertrek.
                    Laat het leeg voor Airbnb-gasten en als je zelf in Pleuntje bent.
                  </span>
                </label>
                {gastEmail.trim() !== "" && (
                  <label className="mt-4 block text-lg font-semibold text-forest-900">
                    Taal van de mails aan deze gast
                    <select className={veld} value={gastTaal} onChange={(e) => setGastTaal(e.target.value as MailTaal)}>
                      {MAIL_TALEN.map((t) => (
                        <option key={t.taal} value={t.taal}>
                          {t.naam}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
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

      </Groep>

      <Groep id="mails">
      <MailsBeheer
        key={JSON.stringify(overzicht.mailinstellingen)}
        instellingen={overzicht.mailinstellingen}
        opslaan={mailsOpslaan}
        taal={mailTaal}
        setTaal={setMailTaal}
        vertalingGoed={async (soort) => {
          try {
            setOverzicht(await api<Overzicht>("vertaling_akkoord", { soort }));
          } catch (err) {
            behandelFout(err);
          }
        }}
      />
      </Groep>

      <Groep id="geld">
      <PrijzenBeheer
        key={JSON.stringify(overzicht.prijzen)}
        prijzen={overzicht.prijzen}
        opslaan={prijzenOpslaan}
      />

      <RegelsBeheer
        key={JSON.stringify(overzicht.regels)}
        regels={overzicht.regels}
        grenzen={overzicht.regelGrenzen}
        opslaan={regelsOpslaan}
      />

      <MollieBeheer mollie={overzicht.mollie} opslaan={mollieOpslaan} verwijder={mollieVerwijder} />

      <ToeristenbelastingKaart jaren={overzicht.toeristenbelasting} />
      </Groep>

      <Groep id="instellingen">
      <TestmailKaart />

      <GoogleAgendaKaart link={overzicht.priveAgendaLink} nieuweLink={priveAgendaNieuw} />

      <ReservekopieKaart laatst={overzicht.reservekopie} stuurNu={reservekopieNu} />

      {/* Link voor Airbnb */}
      <section className={kaartIndigo}>
        <h2 className="text-2xl text-forest-900">Agendalink voor Airbnb</h2>
        <p className="mt-2 text-base text-forest-800">
          Deze link staat al in Airbnb (bij Kalenders koppelen), dus hier hoef je
          niets meer mee te doen. Je hebt hem alleen nodig als je de koppeling ooit
          opnieuw moet maken.
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
      </Groep>

      <Groep id="reviews-groep">
      <ReviewsBeheer
        reviews={overzicht.reviews}
        zetStatus={reviewStatus}
        toevoegen={reviewToevoegen}
        zichtbaar={reviewsZichtbaar}
        zetZichtbaar={setReviewsZichtbaar}
      />
      </Groep>

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
    <form onSubmit={verstuur} className={kaartIndigo}>
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
