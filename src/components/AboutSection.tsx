import Image from "next/image";

export default function AboutSection() {
  return (
    <section
      id="over-ons"
      className="scroll-offset relative overflow-hidden px-4 pt-20 pb-16"
    >
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

        <div className="mx-auto mt-20 max-w-xl">
          <h2 className="text-4xl font-bold text-forest-900">Over ons</h2>
          <div className="mx-auto mt-8 max-w-[220px]">
            <div className="photo-frame blob square-box w-full">
              <Image
                src="/photos/marjolein-en-ed.jpg"
                alt="Marjolein en Ed, de eigenaren van Pleuntje"
                fill
                sizes="220px"
                className="object-cover object-top"
              />
            </div>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-forest-900">
            We zijn Marjolein en Ed. Al jaren zijn we dol op de Veluwe. Een
            paar jaar geleden kochten we dit chalet, een plekje waar we
            enorm van genieten. Dat geluk gunnen we anderen ook en daarom
            verhuren we Pleuntje nu ook aan gasten zoals jij.
          </p>
        </div>
      </div>
    </section>
  );
}
