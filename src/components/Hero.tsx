import Image from "next/image";
import type { Taal } from "@/i18n/talen";
import HeroInfo from "@/components/HeroInfo";
import Glinster from "@/components/Glinster";

const ALT: Record<Taal, string> = {
  nl: "Pleuntje tussen de bomen, met de omheinde tuin ervoor",
  de: "Pleuntje zwischen den Bäumen, mit dem eingezäunten Garten davor",
  en: "Pleuntje among the trees, with the fenced garden in front",
  fr: "Pleuntje entre les arbres, avec le jardin clôturé devant",
};

// Opening: één grote foto van Pleuntje tussen de bomen, met alleen de naam eroverheen.
export default function Hero({ taal }: { taal: Taal }) {
  return (
    <section id="top" className="relative flex min-h-[560px] items-end overflow-hidden h-[88svh]">
      <Image
        src="/photos/tuin.jpg"
        alt={ALT[taal]}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_45%]"
      />
      {/* Zachte verduistering onderaan, zodat de tekst goed leesbaar is */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,30,22,0.55)_0%,rgba(20,30,22,0)_25%,rgba(20,30,22,0.1)_45%,rgba(20,30,22,0.88)_100%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 sm:pb-20">
        <h1 className="relative inline-block font-wordmark text-[clamp(4.5rem,15vw,10.5rem)] leading-[0.85] font-medium text-photo-ink [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
          Pleuntje
          <Glinster className="-top-3 -right-6 sm:-right-9" grootte={30} />
          <Glinster className="top-6 -right-11 sm:-right-16" grootte={16} vertraging={1.3} />
        </h1>
        <HeroInfo taal={taal} />
      </div>
    </section>
  );
}
