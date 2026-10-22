import HtmlRoot from "@/components/HtmlRoot";
import { siteMetadata } from "@/i18n/site";

// Nederlandse versie van de site (de gewone adressen zonder /de/, /en/ of /fr/)
export const metadata = siteMetadata("nl");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <HtmlRoot taal="nl">{children}</HtmlRoot>;
}
