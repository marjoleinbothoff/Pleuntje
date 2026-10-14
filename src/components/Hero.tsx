import Image from "next/image";

// Opening: één grote foto van Pleuntje tussen de bomen, met de naam eroverheen.
export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[560px] items-end overflow-hidden h-[88svh]">
      <Image
        src="/photos/tuin.jpg"
        alt="Pleuntje tussen de bomen, met de omheinde tuin ervoor"
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
        <h1 className="font-wordmark text-[clamp(4.5rem,15vw,10.5rem)] leading-[0.85] font-medium text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
          Pleuntje
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white sm:text-xl [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
          Een knus boshuis op de Veluwe voor drie personen, met een omheinde
          tuin voor je hond.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href="#boeken"
            className="rounded-sm bg-white px-7 py-3.5 text-base font-medium text-forest-900 transition-colors hover:bg-cream"
          >
            Bekijk beschikbaarheid
          </a>
          <a href="#binnenkijkje" className="text-base text-white underline decoration-white/50 underline-offset-4 hover:decoration-white">
            Kijk binnen
          </a>
        </div>
      </div>
    </section>
  );
}
