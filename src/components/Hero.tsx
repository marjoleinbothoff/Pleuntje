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

          {/* text-balance verdeelt de woorden gelijkmatig over de regels,
              zodat er geen los woordje op de laatste regel blijft hangen */}
          <div className="mx-auto mt-6 max-w-md space-y-3 text-lg leading-relaxed text-balance text-forest-900">
            <p>
              Een knus chalet voor 3 volwassenen, helemaal omringd door bomen
              en met een eigen omheinde tuin voor je hond.
            </p>
            <p>
              Het bos ligt op loopafstand en de sauna vind je vlak om de hoek,
              naast het park.
            </p>
          </div>
          <p className="mt-5 font-wordmark text-2xl font-semibold text-sunset-600 italic">
            Even helemaal tot rust komen.
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
