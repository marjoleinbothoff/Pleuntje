import Image from "next/image";
import type { Taal } from "@/i18n/talen";

const T: Record<Taal, { kop: string; tekst: string; altWoon: string; altTerras: string; altWij: string }> = {
  nl: {
    kop: "Over ons",
    tekst:
      "Wij zijn Marjolein en Ed. Al jaren zijn we dol op de Veluwe. Een paar jaar geleden kochten we dit chalet, een plekje waar we enorm van genieten. Dat geluk gunnen we anderen ook en daarom verhuren we Pleuntje nu ook aan gasten zoals jij.",
    altWoon: "Gezellige woonkamer van Pleuntje met een warme bank en vloerkleed",
    altTerras: "Terras van Pleuntje, lekker buiten zitten tussen het groen",
    altWij: "Marjolein en Ed, de eigenaren van Pleuntje, bij een akker op de Veluwe",
  },
  de: {
    kop: "Über uns",
    tekst:
      "Wir sind Marjolein und Ed. Seit Jahren lieben wir die Veluwe. Vor ein paar Jahren haben wir dieses Chalet gekauft, ein Fleckchen, das wir sehr genießen. Dieses Glück gönnen wir auch anderen, deshalb vermieten wir Pleuntje jetzt auch an Gäste wie dich.",
    altWoon: "Gemütliches Wohnzimmer von Pleuntje mit Sofa und Teppich",
    altTerras: "Terrasse von Pleuntje, herrlich draußen sitzen im Grünen",
    altWij: "Marjolein und Ed, die Eigentümer von Pleuntje, an einem Feld in der Veluwe",
  },
  en: {
    kop: "About us",
    tekst:
      "We are Marjolein and Ed. We have loved the Veluwe for years. A few years ago we bought this chalet, a little spot we enjoy enormously. We'd like others to enjoy it too, which is why we now also rent out Pleuntje to guests like you.",
    altWoon: "Cosy living room of Pleuntje with a comfortable sofa and rug",
    altTerras: "Pleuntje's terrace, a lovely place to sit outside among the greenery",
    altWij: "Marjolein and Ed, the owners of Pleuntje, by a field on the Veluwe",
  },
  fr: {
    kop: "À propos de nous",
    tekst:
      "Nous sommes Marjolein et Ed. Depuis des années, nous adorons la Veluwe. Il y a quelques années, nous avons acheté ce chalet, un petit coin où nous nous sentons merveilleusement bien. Nous aimerions que d'autres en profitent aussi : c'est pourquoi nous louons désormais Pleuntje à des hôtes comme vous.",
    altWoon: "Salon chaleureux de Pleuntje avec un canapé et un tapis",
    altTerras: "Terrasse de Pleuntje, idéale pour profiter de l'extérieur dans la verdure",
    altWij: "Marjolein et Ed, les propriétaires de Pleuntje, près d'un champ en Veluwe",
  },
};

export default function AboutSection({ taal }: { taal: Taal }) {
  const t = T[taal];
  return (
    <section className="relative overflow-hidden">
      <div className="band-fotos px-4 pt-20 pb-20">
      <div className="relative mx-auto max-w-3xl text-center">
        <div className="relative mx-auto w-full max-w-lg pb-10 pl-10">
          <div className="photo-frame blob-alt square-box">
            <Image
              src="/photos/woonkamer.jpg"
              alt={t.altWoon}
              fill
              sizes="(min-width: 1024px) 512px, 90vw"
              className="object-cover"
            />
          </div>
          <div className="photo-frame blob absolute bottom-0 left-0 h-0 w-1/2 pt-[50%] ring-4 ring-perzik">
            <Image
              src="/photos/terras.jpg"
              alt={t.altTerras}
              fill
              sizes="256px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
      </div>

      {/* Over ons in een brede roestbruine baan, de foto in een crème lijst (Herfstblad) */}
      <div id="over-ons" className="scroll-offset band-overons px-4 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-4xl font-bold text-white">{t.kop}</h2>
          {/* Staande portretfoto van Marjolein en Ed */}
          <div className="oud-fotootje-houder mx-auto mt-10 w-full max-w-[260px]">
          <div className="oud-fotootje">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src="/photos/marjolein-en-ed.jpg"
                alt={t.altWij}
                fill
                sizes="260px"
                className="object-cover"
              />
            </div>
          </div>
          </div>
          <p className="mt-8 text-lg leading-relaxed text-white">
            {t.tekst}
          </p>
        </div>
      </div>
    </section>
  );
}
