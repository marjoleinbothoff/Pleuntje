// Vertalingen van de reviews (26 okt 2026, wens Marjolein: buitenlandse gasten moeten ze kunnen lezen).
// Sleutel = de vaste id van de review (zie public/api/lib/reviews-start.php).
// Staat een review hier niet in (bijv. een nieuwe), dan toont de site de originele tekst.
// Nieuwe review erbij? Voeg hier de vertalingen toe met dezelfde id.
import type { Taal } from "@/i18n/talen";

export const REVIEW_VERTALINGEN: Record<string, Partial<Record<Taal, string>>> = {
  "ab-andre-2512": {
    de: "Im Waldhäuschen Pleuntje hatten wir eine sehr angenehme Zeit. Das Häuschen war stimmungsvoll und mit etwas Weihnachtsdekoration geschmückt, was wir über Weihnachten und die Tage danach sehr schön fanden. Für uns ein Volltreffer.\nAuch die Umgebung war wunderschön, und in der Mappe im Häuschen gab es ausführliche Informationen dazu. Alles sehr angenehm.",
    en: "We had a really lovely time at forest cottage Pleuntje. The cottage was cosy and decorated with a few Christmas touches, which we really enjoyed over Christmas and the days after. A real hit as far as we're concerned.\nThe surroundings were beautiful too, and the folder in the cottage had plenty of information about them. All very pleasant.",
    fr: "Nous avons passé un très bon moment dans la petite maison des bois Pleuntje. La maison était chaleureuse, avec quelques décorations de Noël, ce que nous avons beaucoup apprécié pendant Noël et les jours suivants. Pour nous, un vrai coup dans le mille.\nLes environs étaient magnifiques aussi, et le classeur de la maison contenait de nombreuses informations à leur sujet. Très agréable dans l'ensemble.",
  },
  "ab-simone-2512": {
    de: "Fantastisch, um dem Trubel zu entfliehen, und Marjolein ist eine großartige Gastgeberin!",
    en: "Fantastic for escaping the hustle and bustle, and Marjolein is a wonderful host!",
    fr: "Fantastique pour échapper à l'agitation, et Marjolein est une hôtesse formidable !",
  },
  "ab-marit-2602": {
    de: "Herzlichen Dank für einen ganz spontanen und vor allem schönen Aufenthalt! Marjolein hat super schnell reagiert und der Self-Check-in war einfach. Ihr Waldhäuschen ist sehr schön eingerichtet. Alles (und mehr), was man braucht, war vorhanden (sogar ein Föhn mit Diffusor!), sodass wir die Ruhe und Gemütlichkeit richtig genießen konnten. Wir kommen gerne wieder! ☀️",
    en: "Thank you so much for a very spontaneous and above all lovely stay! Marjolein replied super quickly and the self check-in was easy. Her forest cottage is beautifully furnished. Everything (and more) you could need was there (even a hairdryer with a diffuser!), so we could really enjoy the peace and cosiness. We'd love to come back! ☀️",
    fr: "Merci beaucoup pour ce séjour très spontané et surtout très agréable ! Marjolein a répondu très rapidement et l'arrivée autonome était facile. Sa petite maison des bois est très joliment aménagée. Tout ce dont on a besoin (et plus) était là (même un sèche-cheveux avec diffuseur !), si bien que nous avons pu profiter pleinement du calme et du confort. Nous reviendrons avec plaisir ! ☀️",
  },
  "ab-jamaine-2603": {
    de: "Ein fantastischer Ausgangspunkt für herrliche Wanderungen! Die Sauna ist zu Fuß erreichbar. Wirklich empfehlenswert. Kurzum: ein herrlicher Ort, um zur Ruhe zu kommen.",
    en: "A fantastic base for beautiful walks! The sauna is within walking distance. Highly recommended. In short, a lovely place to unwind.",
    fr: "Un point de départ fantastique pour de superbes promenades ! Le sauna est accessible à pied. Vraiment à recommander. Bref, un endroit merveilleux pour se ressourcer.",
  },
  "ab-nicole-2604": {
    de: "Pleuntje, ein schönes Chalet mit allem Drum und Dran, um sich in der ruhigen Natur zu Hause zu fühlen! Den ganzen Tag hört man die Vögel zwitschern und den Wind in den Bäumen … Herrlich!\nEingezäunter Garten, Parkplatz vor der Tür und alles gepflegt und sauber.\nMeine Tiere waren wirklich willkommen – das wird oft gesagt, aber dann ist eigentlich gemeint, dass sie geduldet werden.\nDie Kommunikation läuft reibungslos und schnell. Marjolein ist sehr gastfreundlich und freundlich!\nObwohl ich das am liebsten als meinen geheimen „Ort“ behalten würde, kann ich es jedem empfehlen, der wie ich die Natur und die Ruhe liebt!",
    en: "Pleuntje, a lovely chalet with everything you need to feel at home in peaceful nature! All day long you hear the birds singing and the wind through the trees… Wonderful!\nFenced garden, parking right outside and everything neatly kept and clean.\nMy animals were truly welcome – something that's often said, when what's really meant is that they're tolerated.\nCommunication is smooth and quick. Marjolein is incredibly hospitable and friendly!\nEven though I'd like to keep this as my secret \"spot\", I'd definitely recommend booking if, like me, you love nature and peace and quiet!",
    fr: "Pleuntje, un joli chalet tout équipé pour se sentir chez soi au cœur d'une nature paisible ! Toute la journée, on entend les oiseaux chanter et le vent dans les arbres… Merveilleux !\nJardin clôturé, parking devant la porte, et tout est bien entretenu et propre.\nMes animaux étaient vraiment les bienvenus – on le dit souvent, alors qu'en réalité on veut dire qu'ils sont tolérés.\nLa communication est fluide et rapide. Marjolein est extrêmement accueillante et aimable !\nMême si j'aimerais garder cet endroit comme mon « coin secret », je le recommande vivement si, comme moi, vous aimez la nature et le calme !",
  },
  "ab-anouk-2604": {
    de: "Herrlicher Aufenthalt in einem gemütlichen Häuschen. Schöne Wälder zu Fuß erreichbar. Super, dass auch unsere Hunde willkommen waren. Gastgeberin Marjolein ist super freundlich und kommunikativ. Wirklich empfehlenswert!",
    en: "Lovely stay in a cosy little cottage. Beautiful woods within walking distance. Great that our dogs were welcome too. Host Marjolein is super friendly and communicative. Highly recommended!",
    fr: "Séjour merveilleux dans une petite maison chaleureuse. De belles forêts accessibles à pied. Super que nos chiens soient aussi les bienvenus. Marjolein, notre hôtesse, est très aimable et communicative. Vraiment à recommander !",
  },
  "ab-suzan-2604": {
    de: "Schöner Ort in einem ruhigen Park. Das Häuschen hatte alles, was wir brauchten. Schöne Wälder zum Spazierengehen mit dem Hund, und wir hatten einen herrlichen Saunatag.",
    en: "Nice spot in a quiet park. The cottage had everything we needed. Beautiful woods for walking the dog, and we had a lovely day at the sauna.",
    fr: "Bel endroit dans un parc tranquille. La maison avait tout ce dont nous avions besoin. De belles forêts pour promener le chien, et nous avons passé une excellente journée au sauna.",
  },
  "ab-annemiek-2604": {
    de: "Marjolein war unglaublich freundlich und angenehm, und die Kommunikation lief schnell.\nDas Häuschen war sauber und genau wie beschrieben. Ihre Anleitungen waren auch sehr klar, sodass alles besonders reibungslos lief.\nDer Garten ist privat und für die Hunde komplett eingezäunt. Das Auto kann vor dem Häuschen stehen, was praktisch ist.\nInnerhalb einer Minute ist man außerhalb des Parks, wo man die Hunde wunderbar ausführen kann.\nUnd ein extra Lob für die zwei Einzelbettdecken auf dem Doppelbett.\nAlles in allem ein herrlicher Aufenthalt, wir kommen gerne wieder.",
    en: "Marjolein was incredibly friendly and pleasant, and communication was quick.\nThe cottage was clean and exactly as advertised. Her instructions were also very clear, so everything went really smoothly.\nThe garden is private and fully fenced for the dogs. The car can be parked in front of the cottage, which is handy.\nWithin a minute you're outside the park, where it's lovely to walk the dogs.\nAnd an extra shout-out for the two single duvets on the double bed.\nAll in all a wonderful stay, and we'd love to come back.",
    fr: "Marjolein a été extrêmement aimable et agréable, et la communication était rapide.\nLa maison était propre et exactement comme annoncée. Ses instructions étaient aussi très claires, si bien que tout s'est déroulé sans accroc.\nLe jardin est privé et entièrement clôturé pour les chiens. La voiture peut stationner devant la maison, ce qui est pratique.\nEn une minute, vous êtes hors du parc, où il est très agréable de promener les chiens.\nEt une mention spéciale pour les deux couettes individuelles sur le lit double.\nDans l'ensemble, un séjour merveilleux, et nous reviendrons avec plaisir.",
  },
  "ab-emma-2604": {
    de: "Ein sehr schöner Aufenthalt in diesem süßen Häuschen! Danke, Marjolein",
    en: "A really lovely stay in this charming little cottage! Thank you, Marjolein",
    fr: "Un très bon séjour dans cette adorable petite maison ! Merci Marjolein",
  },
  "ab-juanita-2604": {
    de: "Was für ein schöner Aufenthalt! Die Atmosphäre in Pleun ist gemütlich und heimelig.\nDie Terrasse ist mit der Morgensonne und dem Vogelgezwitscher einfach herrlich.\nDas Zentrum von Putten ist mit dem Auto schnell erreichbar, aber auch mit dem Fahrrad oder zu Fuß machbar. Dadurch ist die Umgebung wunderbar ruhig.\n\nDas Doppelbett ist 140 cm breit. Gut zu wissen, wenn man nicht mit dem eigenen Partner unterwegs ist :) Schön ist, dass es zwei separate Bettdecken gibt.\n\nDer Kontakt mit Marjolein war angenehm. Auch das Self-Check-in-System ist einfach.\nPreis-Leistung ist absolut in Ordnung!!",
    en: "What a lovely stay! The atmosphere at Pleun is relaxed and cosy.\nThe terrace is wonderful with the morning sun and the sound of the birds.\nThe centre of Putten is quick to reach by car, but also doable by bike or on foot. That's what makes the surroundings so lovely and quiet.\n\nThe double bed is 140 cm wide. Good to know if you're not travelling with your own partner :) Nice that there are two separate duvets.\n\nContact with Marjolein was pleasant. The self check-in system is easy too.\nValue for money is more than fine!!",
    fr: "Quel séjour agréable ! L'ambiance chez Pleun est conviviale et chaleureuse.\nLa terrasse est délicieuse au soleil du matin, avec le chant des oiseaux.\nLe centre de Putten est rapidement accessible en voiture, mais aussi à vélo ou à pied. C'est pourquoi les environs sont si calmes.\n\nLe lit double fait 140 cm de large. Bon à savoir si vous ne voyagez pas avec votre partenaire :) Il y a deux couettes séparées, c'est appréciable.\n\nLe contact avec Marjolein était agréable. Le système d'arrivée autonome est simple aussi.\nLe rapport qualité-prix est largement au rendez-vous !!",
  },
  "ab-samira-2608": {
    de: "Ein sehr schönes Häuschen, in dem man trotzdem ein bisschen Privatsphäre hat und direkt in der Natur ist. Schön gelegen an einer Ecke im Park. Die Küche war sauber und gut ausgestattet. Es gibt Fliegengitter wegen der Mücken, und in den Betten schläft man herrlich.",
    en: "A really nice cottage where you still have a bit of privacy and you're right out in nature. Nicely located on a corner within a park. The kitchen was clean and well equipped. There are insect screens because of the mosquitoes, and the beds are very comfortable.",
    fr: "Une très jolie maison où l'on a tout de même un peu d'intimité, en pleine nature. Bien située à l'angle d'un parc. La cuisine était propre et bien équipée. Il y a des moustiquaires contre les moustiques, et on dort merveilleusement bien dans les lits.",
  },
  "ab-goran-2608": {
    de: "Herrliche, ruhige Umgebung und eine sehr freundliche und hilfsbereite Gastgeberin! Empfehlenswert!",
    en: "Lovely, peaceful surroundings and a very friendly and helpful host! Recommended!",
    fr: "Un environnement calme et agréable, et une hôtesse très aimable et serviable ! À recommander !",
  },
  "ab-katherine-2608": {
    nl: "Het was een genoegen om in het huisje van Marjolein te verblijven; we voelden ons snel helemaal thuis! Het huisje zelf zat vol charme, was eenvoudig, mooi ingericht met haar persoonlijke touch en had alles wat je nodig hebt. We kwamen met de auto en het lag echt goed, verschillende steden en dorpjes waren makkelijk te bereiken. We hadden ook onze 2 honden bij ons en die speelden vrolijk buiten in de omheinde tuin. Mijn ouders en ik hebben er samen een heerlijke tijd gehad <3 het allerbeste Marjolein! :)",
    de: "Es war eine Freude, in Marjoleins Häuschen zu wohnen – wir haben uns schnell wie zu Hause gefühlt! Das Häuschen selbst steckt voller Charme, ist schlicht, schön eingerichtet mit ihrer persönlichen Note und hat alles, was man braucht. Wir kamen mit dem Auto, und es liegt wirklich gut; verschiedene Städte und Dörfer sind leicht zu erreichen. Wir hatten auch unsere 2 Hunde dabei, und sie haben draußen im eingezäunten Garten fröhlich gespielt. Meine Eltern und ich hatten dort zusammen eine wunderbare Zeit <3 alles Gute, Marjolein! :)",
    fr: "Ce fut un plaisir de séjourner dans la maison de Marjolein, nous nous sommes vite sentis comme chez nous ! La maison elle-même est pleine de charme, simple, joliment décorée avec sa touche personnelle et dispose de tout le nécessaire. Nous sommes venus en voiture et elle est vraiment bien située : différentes villes et petits villages sont faciles d'accès. Nous avions aussi nos 2 chiens, qui ont joué joyeusement dehors dans le jardin clôturé. Mes parents et moi y avons passé un merveilleux moment ensemble <3 tout le meilleur, Marjolein ! :)",
  },
  "ab-alexander-2608": {
    de: "Wir hatten ein herrliches langes Wochenende im Chalet Pleuntje! Das Chalet ist sehr stimmungsvoll und schön eingerichtet, sodass man sich sofort zu Hause fühlt. Alles ist ordentlich, sauber und mit allem Komfort ausgestattet.\n\nDie Lage ist außerdem ideal, wenn man einfach mal raus möchte, und die Umgebung von Putten bietet genug Möglichkeiten für Ausflüge.\n\nAuch der Kontakt mit Gastgeberin Marjolein war sehr angenehm. Sie ist unglaublich freundlich, hilfsbereit und antwortet sehr schnell auf Nachrichten, was den Aufenthalt besonders sorglos gemacht hat.\n\nKurzum: Wir hatten einen wunderbaren Aufenthalt und würden das Chalet Pleuntje auf jeden Fall empfehlen.",
    en: "We had a wonderful long weekend at Chalet Pleuntje! The chalet is incredibly cosy and nicely furnished, so you feel at home straight away. Everything is neat, clean and has every comfort.\n\nThe location is also great if you just want to get away for a while, and the area around Putten offers plenty of options for days out.\n\nContact with host Marjolein was very pleasant too. She is incredibly friendly, helpful and replies to messages very quickly, which made the stay extra carefree.\n\nIn short: we had a really lovely stay and would definitely recommend Chalet Pleuntje.",
    fr: "Nous avons passé un merveilleux long week-end au Chalet Pleuntje ! Le chalet est très chaleureux et joliment aménagé, on s'y sent tout de suite chez soi. Tout est soigné, propre et doté de tout le confort.\n\nL'emplacement est en outre idéal pour s'évader un peu, et les environs de Putten offrent de nombreuses possibilités de sorties.\n\nLe contact avec Marjolein, notre hôtesse, était aussi très agréable. Elle est extrêmement aimable, serviable et répond très vite aux messages, ce qui a rendu le séjour encore plus serein.\n\nBref : nous avons passé un excellent séjour et recommandons vivement le Chalet Pleuntje.",
  },
  "ab-siri-2608": {
    de: "Prima Aufenthalt für drei Personen in einer wunderschönen Umgebung!",
    en: "A great stay for three people in beautiful surroundings!",
    fr: "Un très bon séjour pour trois personnes dans un cadre magnifique !",
  },
  "ab-alja-2609": {
    de: "Ein herrlicher Ort, um zur Ruhe zu kommen. Marjolein hat das Chalet charmant und komplett eingerichtet. Alles war sauber. Klare Anleitungen vorhanden. Der Wald ist zu Fuß erreichbar.",
    en: "A lovely place to unwind. Marjolein has furnished the chalet charmingly and completely. Everything was clean. Clear instructions provided. The woods are within walking distance.",
    fr: "Un endroit merveilleux pour se ressourcer. Marjolein a aménagé le chalet avec charme et de façon complète. Tout était propre. Des instructions claires sont fournies. La forêt est accessible à pied.",
  },
  "ab-dorte-2609": {
    de: "Ein schöner Aufenthalt in Marjoleins Airbnb! Es war genau wie auf den Fotos, sauber und komfortabel.\nWir hatten eine tolle Zeit, und unsere Hunde haben sich auch wohlgefühlt :)",
    en: "A lovely stay at Marjolein's Airbnb! It was exactly like the photos, clean and comfortable.\nWe had a great time, and our dogs enjoyed themselves too :)",
    fr: "Un très bon séjour dans l'Airbnb de Marjolein ! C'était exactement comme sur les photos, propre et confortable.\nNous avons passé un bon moment, et nos chiens se sont bien amusés aussi :)",
  },
  "ab-bavo-2609": {
    de: "Ein sehr angenehmer und sauberer Aufenthalt",
    en: "A very pleasant and clean stay",
    fr: "Un séjour très agréable et propre",
  },
  "ab-viviana-2610": {
    de: "Wir waren mit unserem Hund dort und haben uns rundum wohlgefühlt.\nDie Lage ist herrlich zum Entspannen, Wandern oder Bummeln.\nDie Unterkunft hat alles, was man braucht.\nDie Einrichtung ist schön und persönlich, man merkt die Liebe zum Detail.",
    en: "We stayed with our dog and felt completely at home.\nThe location is wonderful for relaxing and for walking or strolling.\nThe accommodation has everything you need.\nThe interior is beautiful and personal; you can tell attention has been paid to detail.",
    fr: "Nous y étions avec notre chien et nous nous sommes sentis parfaitement à l'aise.\nL'emplacement est idéal pour se détendre, se promener ou flâner.\nLe logement dispose de tout le nécessaire.\nLa décoration est belle et personnelle, on sent le souci du détail.",
  },
  "ab-lonneke-2610": {
    de: "Schönes Plätzchen in einem kleinen Park in einer schönen Umgebung. Ein richtig gemütliches Fleckchen!",
    en: "Lovely spot in a small park in beautiful surroundings. A really cosy little place!",
    fr: "Un joli petit coin dans un petit parc, dans un bel environnement. Un endroit vraiment douillet !",
  },
  "ab-maarten-2610": {
    de: "Ein schöner Ort, um wieder einmal zur Ruhe zu kommen. Danke für die Gastfreundschaft und den guten Kontakt.",
    en: "A lovely place to unwind again. Thank you for the hospitality and the great contact.",
    fr: "Un bel endroit pour se ressourcer. Merci pour l'hospitalité et le bon contact.",
  },
};
