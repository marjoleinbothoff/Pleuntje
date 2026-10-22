import IconDefs from "@/components/IconDefs";
import { fontKlassen } from "@/app/fonts";
import { structuredData } from "@/i18n/site";
import { HTML_LANG, type Taal } from "@/i18n/talen";
import "@/app/globals.css";

// Het "huis" om elke pagina heen, voor de Nederlandse én de vertaalde versie.
export default function HtmlRoot({ taal, children }: { taal: Taal; children: React.ReactNode }) {
  return (
    <html lang={HTML_LANG[taal]} className={`${fontKlassen} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-forest-900 font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(taal)) }}
        />
        <IconDefs />
        {children}
      </body>
    </html>
  );
}
