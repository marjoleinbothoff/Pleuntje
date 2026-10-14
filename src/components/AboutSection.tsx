import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="over-ons" className="scroll-offset px-5 pb-24 sm:pb-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[0.8fr_1fr] md:gap-20">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[4px] md:mx-0">
          <Image
            src="/photos/marjolein-en-ed.jpg"
            alt="Marjolein en Ed, de eigenaren van Pleuntje"
            fill
            sizes="(min-width: 768px) 380px, 90vw"
            className="object-cover object-bottom"
          />
        </div>
        <div className="max-w-lg">
          <h2 className="text-4xl text-forest-900 sm:text-5xl">Over ons</h2>
          <p className="mt-6 text-lg leading-relaxed text-forest-800">
            Wij zijn Marjolein en Ed. Al jaren zijn we dol op de Veluwe. Een
            paar jaar geleden kochten we dit chalet, een plekje waar we
            enorm van genieten. Dat geluk gunnen we anderen ook en daarom
            verhuren we Pleuntje nu ook aan gasten zoals jij.
          </p>
          <p className="mt-6 font-wordmark text-2xl text-forest-700 italic">
            Marjolein en Ed
          </p>
        </div>
      </div>
    </section>
  );
}
