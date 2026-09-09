export default function AboutSection() {
  return (
    <section
      id="over-ons"
      className="scroll-offset relative overflow-hidden px-4 py-20"
    >
      <div
        aria-hidden
        className="blob-alt absolute -left-20 bottom-0 h-64 w-64 bg-forest-100/80"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-sm lg:order-2">
          <div className="blob-alt absolute inset-0 bg-gradient-to-br from-sunset-200 to-forest-200/70" />
          <div className="relative flex aspect-square items-center justify-center p-10">
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-[2rem] bg-white/70 text-center shadow-inner">
              <span className="text-6xl">👋</span>
              <p className="glossy-text glossy-text--green text-3xl" data-text="Hoi!">
                Hoi!
              </p>
              <p className="max-w-[14rem] text-sm font-semibold text-forest-700">
                Wij verheugen ons op jouw bezoek aan de Veluwe.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center lg:order-1 lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-sunset-100 px-4 py-1.5 text-sm font-bold text-sunset-700">
            Over ons
          </span>
          <h2 className="mt-4 text-4xl font-bold text-forest-900">
            Het verhaal achter{" "}
            <span className="glossy-text glossy-text--green" data-text="Pleun">
              Pleun
            </span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-forest-700">
            Pleun is ons kleine plekje midden in de natuur van de Veluwe. We
            hebben het huisje met heel veel liefde ingericht, zodat jij je
            direct thuis voelt tussen het groen. Van een dampende kop koffie
            op het terras tot een frisse boswandeling voor het ontbijt —
            Pleun is de perfecte uitvalsbasis om even helemaal niets te
            hoeven.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-forest-700">
            We vinden gastvrijheid ontzettend belangrijk en staan altijd
            klaar met een goede tip over de omgeving, het bos of natuurlijk
            de sauna om de hoek. Welkom bij Pleun, welkom op de Veluwe.
          </p>
        </div>
      </div>
    </section>
  );
}
