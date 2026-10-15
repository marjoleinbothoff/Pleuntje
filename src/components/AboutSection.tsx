import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-16">
      <div className="relative mx-auto max-w-3xl text-center">
        <div className="relative mx-auto w-full max-w-lg pb-10 pl-10">
          <div className="photo-frame blob-alt square-box">
            <Image
              src="/photos/woonkamer.jpg"
              alt="Gezellige woonkamer van Pleuntje met een warme bank en vloerkleed"
              fill
              sizes="(min-width: 1024px) 512px, 90vw"
              className="object-cover"
            />
          </div>
          <div className="photo-frame blob absolute bottom-0 left-0 h-0 w-1/2 pt-[50%] ring-4 ring-cream">
            <Image
              src="/photos/terras.jpg"
              alt="Terras van Pleuntje, lekker buiten zitten tussen het groen"
              fill
              sizes="256px"
              className="object-cover"
            />
          </div>
        </div>

        <div id="over-ons" className="scroll-offset mx-auto mt-20 max-w-xl">
          <h2 className="text-4xl font-bold text-forest-900">Over ons</h2>
          {/* Staande portretfoto van Marjolein en Ed */}
          <div className="mx-auto mt-10 w-full max-w-[340px]">
            <div className="photo-frame relative aspect-[3/4] w-full rounded-[4px]">
              <Image
                src="/photos/marjolein-en-ed.jpg"
                alt="Marjolein en Ed, de eigenaren van Pleuntje, bij een akker op de Veluwe"
                fill
                sizes="(min-width: 640px) 340px, 80vw"
                className="object-cover"
              />
            </div>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-forest-900">
            Wij zijn Marjolein en Ed. Al jaren zijn we dol op de Veluwe. Een
            paar jaar geleden kochten we dit chalet, een plekje waar we
            enorm van genieten. Dat geluk gunnen we anderen ook en daarom
            verhuren we Pleuntje nu ook aan gasten zoals jij.
          </p>
        </div>
      </div>
    </section>
  );
}
