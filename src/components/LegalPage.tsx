import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import TaalKiezer from "@/components/TaalKiezer";
import { pad, type Taal } from "@/i18n/talen";

const T: Record<Taal, { terug: string; bijgewerkt: string; nlGeldt?: string }> = {
  nl: { terug: "Terug naar de site", bijgewerkt: "Laatst bijgewerkt" },
  de: {
    terug: "Zurück zur Website",
    bijgewerkt: "Zuletzt aktualisiert",
    nlGeldt:
      "Dies ist eine Übersetzung. Bei Unterschieden gilt die niederländische Fassung.",
  },
  en: {
    terug: "Back to the website",
    bijgewerkt: "Last updated",
    nlGeldt: "This is a translation. In case of any differences, the Dutch version prevails.",
  },
  fr: {
    terug: "Retour au site",
    bijgewerkt: "Dernière mise à jour",
    nlGeldt: "Ceci est une traduction. En cas de divergence, la version néerlandaise fait foi.",
  },
};

export default function LegalPage({
  taal,
  pagina,
  title,
  updated,
  children,
}: {
  taal: Taal;
  pagina: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  const t = T[taal];
  return (
    <>
      <header className="px-4 pt-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-3xl border border-forest-700/60 bg-forest-600/95 px-5 py-4 text-cream shadow-sm shadow-forest-900/20">
          <Link href={pad(taal)} className="flex items-center gap-3">
            <Image
              src="/photos/logo.png"
              alt="Pleuntje"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full"
            />
            <span className="font-bold">Pleuntje</span>
          </Link>
          <Link
            href={pad(taal)}
            className="rounded-full bg-sunset-100 px-4 py-2 text-center text-sm font-bold text-forest-900 transition hover:bg-sunset-200"
          >
            {t.terug}
          </Link>
        </div>
        <TaalKiezer
          taal={taal}
          pagina={pagina}
          className="mx-auto mt-1 max-w-3xl justify-end px-5 text-sm text-forest-700"
          linkClassName="hover:text-forest-900"
          actiefClassName="font-bold text-forest-900"
        />
      </header>

      <main className="flex-1 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-forest-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-forest-700">
            {t.bijgewerkt}: {updated}
          </p>
          {t.nlGeldt && (
            <p className="mt-4 rounded-2xl bg-forest-100 px-4 py-3 text-sm text-forest-900">
              {t.nlGeldt}{" "}
              <a href={pad("nl", pagina)} hrefLang="nl" className="underline">
                Nederlands
              </a>
            </p>
          )}
          <div className="prose-legal mt-8 space-y-6 text-[15px] leading-relaxed text-forest-900">
            {children}
          </div>
        </div>
      </main>

      <Footer taal={taal} pagina={pagina} />
    </>
  );
}
