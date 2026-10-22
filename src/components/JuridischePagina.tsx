import LegalPage from "@/components/LegalPage";
import { PRIVACY, VOORWAARDEN } from "@/i18n/juridisch";
import { paginaMetadata } from "@/i18n/site";
import type { Taal } from "@/i18n/talen";

// Privacyverklaring en algemene voorwaarden, voor elke taal
const SOORTEN = {
  privacy: { teksten: PRIVACY, pagina: "privacyverklaring/" },
  voorwaarden: { teksten: VOORWAARDEN, pagina: "algemene-voorwaarden/" },
};
export type JuridischSoort = keyof typeof SOORTEN;

export function juridischeMetadata(soort: JuridischSoort, taal: Taal) {
  const { teksten, pagina } = SOORTEN[soort];
  const t = teksten[taal];
  return paginaMetadata(taal, pagina, `${t.titel} – Pleuntje`, t.omschrijving);
}

export default function JuridischePagina({ soort, taal }: { soort: JuridischSoort; taal: Taal }) {
  const { teksten, pagina } = SOORTEN[soort];
  const t = teksten[taal];
  return (
    <LegalPage taal={taal} pagina={pagina} title={t.titel} updated={t.bijgewerkt}>
      <t.Inhoud />
    </LegalPage>
  );
}
