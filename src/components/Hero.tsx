import Image from "next/image";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-16 pb-20 sm:pt-24">
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="text-center">
          <h1 className="text-5xl leading-tight font-bold text-forest-900 sm:text-6xl">
            Welkom bij{" "}
            <span className="glossy-text" data-text="Pleuntje">
              Pleuntje
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-lg text-forest-900">
            Een knus chalet voor 3 personen, helemaal
            omringd door bomen en met een eigen omheinde tuin. Het bos ligt
            op loopafstand en de sauna vind je vlak om de hoek, naast het
            park. Even helemaal tot rust komen.
          </p>
        </div>

        <div className="relative mx-auto w-full">
          <div className="photo-frame blob rect-box">
            <Image
              src="/photos/tuin.jpg"
              alt="Pleuntje met de omheinde tuin, omringd door bomen en groen"
              fill
              sizes="(min-width: 1024px) 560px, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
