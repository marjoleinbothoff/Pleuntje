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
          <span className="inline-flex items-center gap-2 rounded-full bg-sunset-100 px-4 py-1.5 text-sm font-bold text-sunset-700">
            Over ons
          </span>
          <h2 className="mt-8 text-4xl font-bold text-forest-800">
            Het verhaal achter{" "}
            <span className="glossy-text" data-text="Pleuntje">
              Pleuntje
            </span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-forest-800">
            Pleuntje is ons kleine plekje midden in de natuur van de Veluwe. We
            hebben het huisje met heel veel liefde ingericht, zodat jij je
            direct thuis voelt tussen het groen. Van een dampende kop koffie
            op het terras tot een frisse boswandeling voor het ontbijt —
            Pleuntje is de perfecte uitvalsbasis om even helemaal niets te
            hoeven.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-forest-800">
            We vinden gastvrijheid ontzettend belangrijk en staan altijd
            klaar met een goede tip over de omgeving, het bos of natuurlijk
            de sauna om de hoek. Welkom bij Pleuntje, welkom op de Veluwe.
          </p>
        </div>
      </div>
    </section>
  );
}
