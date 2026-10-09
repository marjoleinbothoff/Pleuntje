import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="px-4 pt-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between rounded-3xl border border-forest-700/60 bg-forest-600/95 px-5 py-4 text-cream shadow-sm shadow-forest-900/20">
          <Link href="/" className="flex items-center gap-3">
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
            href="/"
            className="rounded-full bg-sunset-100 px-4 py-2 text-sm font-bold text-forest-900 transition hover:bg-sunset-200"
          >
            Terug naar de site
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-forest-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-forest-700">
            Laatst bijgewerkt: {updated}
          </p>
          <div className="prose-legal mt-8 space-y-6 text-[15px] leading-relaxed text-forest-900">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
