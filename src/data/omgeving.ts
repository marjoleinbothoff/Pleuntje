import type { Taal } from "@/i18n/talen";

// Tips voor de omgeving (venster "Ontdek de omgeving"), in alle vier de talen.
// Een plek toevoegen of aanpassen? Doe het in elke taal op dezelfde plek in de lijst.

export type Plek = {
  name: string;
  time: string;
  text: string;
  url?: string;
  logo?: string;
};

export type Categorie = { title: string; places: Plek[] };

const SCHOVENHORST = "https://schovenhorst.nl/bomentuin/vijf-bomentuinen/";
const DROME = "https://saunadrome-putten.nl/";
const DROME_LOGO = "/photos/sauna-drome-logo.png";

export const OMGEVING: Record<Taal, Categorie[]> = {
  nl: [
    {
      title: "Natuur & wandelen",
      places: [
        {
          name: "Landgoed Schovenhorst",
          time: "± 10-15 min",
          text: "Prachtig landgoed met vijf bijzondere bomentuinen, een speelbos en de beklimbare Bostoren (40 meter hoog, met een spectaculair uitzicht over de Veluwe). Ook heel leuk voor kinderen: klauternetten, hutten bouwen en een zandbak.",
          url: SCHOVENHORST,
        },
        {
          name: "Nationaal Park De Hoge Veluwe",
          time: "± 25 min",
          text: "Prachtig natuurgebied met bos, heide en zandverstuivingen. Leen gratis een wit fietsje en fiets rond. Ook mooi voor kinderen.",
        },
        {
          name: "Radio Kootwijk",
          time: "± 20 min",
          text: "Bijzonder oud radiostation midden in een indrukwekkend stuifzandgebied. Sfeervol wandelgebied, net even anders.",
        },
        {
          name: "Kasteel Staverden",
          time: "± 15 min",
          text: "Piepklein dorpje (het kleinste van Nederland!) met een kasteeltje en watermolen. Heerlijk rustig wandelen.",
        },
        {
          name: "Speulderbos & Garderen",
          time: "± 10-15 min",
          text: "Mooie boswandelingen vlak om de hoek.",
        },
      ],
    },
    {
      title: "Cultuur & musea",
      places: [
        {
          name: "Kröller-Müller Museum",
          time: "± 25-30 min, in De Hoge Veluwe",
          text: "Wereldberoemde kunstcollectie met veel werk van Van Gogh, plus een prachtige beeldentuin.",
        },
        {
          name: "Paleis Het Loo, Apeldoorn",
          time: "± 25-30 min",
          text: "Voormalig koninklijk paleis met schitterende tuinen.",
        },
        {
          name: "Amersfoort",
          time: "± 25-30 min",
          text: "Gezellige historische binnenstad met de Koppelpoort, grachtjes en leuke terrasjes.",
        },
        {
          name: "Elburg",
          time: "± 30 min",
          text: "Goed bewaard middeleeuws vestingstadje, heel sfeervol om doorheen te slenteren.",
        },
        {
          name: "Kasteel Cannenburch, Vaassen",
          time: "± 35 min",
          text: "Sfeervol kasteel met mooie tuinen.",
        },
        {
          name: "Nederlands Openluchtmuseum, Arnhem",
          time: "± 40 min",
          text: "Historische gebouwen en verhalen door heel Nederland heen, op één groot terrein.",
        },
        {
          name: "Nationaal Militair Museum, Soesterberg",
          time: "± 40 min",
          text: "Boeiend museum over oorlog en vrede, ook met vliegtuigen buiten.",
        },
      ],
    },
    {
      title: "Gezellige dorpjes & steden",
      places: [
        {
          name: "Barneveld",
          time: "± 10 min",
          text: "Dichtstbijzijnde plaats, leuk voor een terrasje of wat boodschappen.",
        },
        {
          name: "Garderen",
          time: "± 10-15 min",
          text: "Knus Veluws dorpje met een eigen dorpsplein, leuke winkeltjes en gezellige terrasjes, vlak om de hoek.",
        },
        {
          name: "Amersfoort",
          time: "± 25-30 min",
          text: "Sfeervolle historische binnenstad met de Koppelpoort, gezellige grachtjes en volop terrasjes en winkels.",
        },
        {
          name: "Nunspeet",
          time: "± 20 min",
          text: "Aan de rand van de Veluwe, met strandjes aan het Veluwemeer.",
        },
        {
          name: "Harderwijk",
          time: "± 20-25 min",
          text: "Historisch havenstadje aan het water, gezellig om te wandelen.",
        },
        {
          name: "Hattem",
          time: "± 35 min",
          text: "Klein, goed bewaard vestingstadje, heel schilderachtig.",
        },
        {
          name: "Deventer",
          time: "± 40-45 min",
          text: "Sfeervolle Hanzestad met een gezellig historisch centrum.",
        },
        {
          name: "Zwolle",
          time: "± 45 min",
          text: "Prachtige oude binnenstad, veel terrasjes en winkels.",
        },
        {
          name: "Nijmegen",
          time: "± 50 min",
          text: "Oudste stad van Nederland, mooie Waalkade om te wandelen.",
        },
        {
          name: "Utrecht",
          time: "± 50-55 min",
          text: "Sfeervolle grachten, de Domtoren, veel te doen.",
        },
      ],
    },
    {
      title: "Ontspannen",
      places: [
        {
          name: "Sauna Drôme, om de hoek van Pleuntje",
          time: "± 5 min",
          text: "Zoals je misschien al weet: heerlijk dichtbij! Authentieke houtgestookte sauna's, een lekker buitenbad en een Turks hamam, omringd door bos en water.",
          url: DROME,
          logo: DROME_LOGO,
        },
      ],
    },
    {
      title: "Leuk voor kinderen",
      places: [
        {
          name: "Bosbad Putten",
          time: "± 10 min",
          text: "Heerlijk natuurlijk zwembad midden in het bos, met een echt strandje. Top voor het hele gezin, vlakbij.",
        },
        {
          name: "Apenheul, Apeldoorn",
          time: "± 25-30 min",
          text: "Dierentuin waar apen vrij rondlopen. Ook leuk voor volwassenen!",
        },
        {
          name: "Julianatoren, Apeldoorn",
          time: "± 25-30 min",
          text: "Attractiepark voor de kleintjes.",
        },
        {
          name: "Dolfinarium, Harderwijk",
          time: "± 20-25 min",
          text: "Shows met dolfijnen en zeeleeuwen.",
        },
        {
          name: "Burgers' Zoo, Arnhem",
          time: "± 40 min",
          text: "Grote, mooie dierentuin met verschillende klimaatgebieden. Ook top voor volwassenen.",
        },
        {
          name: "Walibi Holland, Biddinghuizen",
          time: "± 40-45 min",
          text: "Pretpark met achtbanen, vooral leuk voor oudere kinderen en tieners.",
        },
      ],
    },
  ],

  de: [
    {
      title: "Natur & Wandern",
      places: [
        {
          name: "Landgoed Schovenhorst",
          time: "± 10-15 Min.",
          text: "Wunderschönes Landgut mit fünf besonderen Baumgärten, einem Spielwald und dem Bostoren, einem 40 Meter hohen Aussichtsturm mit spektakulärem Blick über die Veluwe. Auch für Kinder toll: Kletternetze, Hütten bauen und ein Sandkasten.",
          url: SCHOVENHORST,
        },
        {
          name: "Nationalpark De Hoge Veluwe",
          time: "± 25 Min.",
          text: "Herrliches Naturgebiet mit Wald, Heide und Sanddünen. Leih dir kostenlos eines der weißen Fahrräder und radle durch den Park. Auch schön für Kinder.",
        },
        {
          name: "Radio Kootwijk",
          time: "± 20 Min.",
          text: "Besondere alte Radiostation mitten in einer beeindruckenden Sanddünenlandschaft. Stimmungsvolles Wandergebiet, mal etwas anderes.",
        },
        {
          name: "Kasteel Staverden",
          time: "± 15 Min.",
          text: "Winziges Dorf (das kleinste der Niederlande!) mit einem kleinen Schloss und einer Wassermühle. Herrlich ruhig zum Spazierengehen.",
        },
        {
          name: "Speulderbos & Garderen",
          time: "± 10-15 Min.",
          text: "Schöne Waldspaziergänge ganz in der Nähe.",
        },
      ],
    },
    {
      title: "Kultur & Museen",
      places: [
        {
          name: "Kröller-Müller Museum",
          time: "± 25-30 Min., im Park De Hoge Veluwe",
          text: "Weltberühmte Kunstsammlung mit vielen Werken von Van Gogh und einem wunderschönen Skulpturengarten.",
        },
        {
          name: "Palast Het Loo, Apeldoorn",
          time: "± 25-30 Min.",
          text: "Ehemaliger königlicher Palast mit prächtigen Gärten.",
        },
        {
          name: "Amersfoort",
          time: "± 25-30 Min.",
          text: "Gemütliche historische Altstadt mit dem Stadttor Koppelpoort, kleinen Grachten und schönen Terrassen.",
        },
        {
          name: "Elburg",
          time: "± 30 Min.",
          text: "Gut erhaltenes mittelalterliches Festungsstädtchen, sehr stimmungsvoll zum Bummeln.",
        },
        {
          name: "Kasteel Cannenburch, Vaassen",
          time: "± 35 Min.",
          text: "Stimmungsvolles Schloss mit schönen Gärten.",
        },
        {
          name: "Niederländisches Freilichtmuseum, Arnhem",
          time: "± 40 Min.",
          text: "Historische Gebäude und Geschichten aus den ganzen Niederlanden auf einem großen Gelände.",
        },
        {
          name: "Nationaal Militair Museum, Soesterberg",
          time: "± 40 Min.",
          text: "Spannendes Museum über Krieg und Frieden, auch mit Flugzeugen draußen.",
        },
      ],
    },
    {
      title: "Gemütliche Dörfer & Städte",
      places: [
        {
          name: "Barneveld",
          time: "± 10 Min.",
          text: "Nächstgelegener Ort, schön für ein Café oder zum Einkaufen.",
        },
        {
          name: "Garderen",
          time: "± 10-15 Min.",
          text: "Gemütliches Veluwe-Dorf mit eigenem Dorfplatz, netten kleinen Läden und Terrassen, ganz in der Nähe.",
        },
        {
          name: "Amersfoort",
          time: "± 25-30 Min.",
          text: "Stimmungsvolle historische Altstadt mit der Koppelpoort, gemütlichen Grachten und vielen Terrassen und Geschäften.",
        },
        {
          name: "Nunspeet",
          time: "± 20 Min.",
          text: "Am Rand der Veluwe, mit kleinen Stränden am Veluwemeer.",
        },
        {
          name: "Harderwijk",
          time: "± 20-25 Min.",
          text: "Historisches Hafenstädtchen am Wasser, schön zum Spazierengehen.",
        },
        {
          name: "Hattem",
          time: "± 35 Min.",
          text: "Kleines, gut erhaltenes Festungsstädtchen, sehr malerisch.",
        },
        {
          name: "Deventer",
          time: "± 40-45 Min.",
          text: "Stimmungsvolle Hansestadt mit gemütlichem historischem Zentrum.",
        },
        {
          name: "Zwolle",
          time: "± 45 Min.",
          text: "Wunderschöne Altstadt, viele Terrassen und Geschäfte.",
        },
        {
          name: "Nijmegen",
          time: "± 50 Min.",
          text: "Älteste Stadt der Niederlande, schöne Uferpromenade an der Waal.",
        },
        {
          name: "Utrecht",
          time: "± 50-55 Min.",
          text: "Stimmungsvolle Grachten, der Domturm und viel zu entdecken.",
        },
      ],
    },
    {
      title: "Entspannen",
      places: [
        {
          name: "Sauna Drôme, gleich um die Ecke von Pleuntje",
          time: "± 5 Min.",
          text: "Herrlich nah! Echte holzbefeuerte Saunen, ein schönes Außenbecken und ein türkisches Hamam, umgeben von Wald und Wasser.",
          url: DROME,
          logo: DROME_LOGO,
        },
      ],
    },
    {
      title: "Für Kinder",
      places: [
        {
          name: "Bosbad Putten",
          time: "± 10 Min.",
          text: "Herrliches Naturfreibad mitten im Wald, mit einem richtigen kleinen Strand. Toll für die ganze Familie, ganz in der Nähe.",
        },
        {
          name: "Apenheul, Apeldoorn",
          time: "± 25-30 Min.",
          text: "Zoo, in dem die Affen frei herumlaufen. Auch für Erwachsene schön!",
        },
        {
          name: "Julianatoren, Apeldoorn",
          time: "± 25-30 Min.",
          text: "Freizeitpark für die Kleinen.",
        },
        {
          name: "Dolfinarium, Harderwijk",
          time: "± 20-25 Min.",
          text: "Shows mit Delfinen und Seelöwen.",
        },
        {
          name: "Burgers' Zoo, Arnhem",
          time: "± 40 Min.",
          text: "Großer, schöner Zoo mit verschiedenen Klimazonen. Auch für Erwachsene toll.",
        },
        {
          name: "Walibi Holland, Biddinghuizen",
          time: "± 40-45 Min.",
          text: "Freizeitpark mit Achterbahnen, vor allem für ältere Kinder und Teenager.",
        },
      ],
    },
  ],

  en: [
    {
      title: "Nature & walking",
      places: [
        {
          name: "Landgoed Schovenhorst",
          time: "± 10-15 min",
          text: "Beautiful estate with five special arboretums, a play forest and the Bostoren, a 40-metre lookout tower you can climb for a spectacular view over the Veluwe. Great for children too: climbing nets, den building and a sandpit.",
          url: SCHOVENHORST,
        },
        {
          name: "De Hoge Veluwe National Park",
          time: "± 25 min",
          text: "Stunning nature reserve with woods, heathland and sand dunes. Borrow one of the free white bicycles and cycle around. Lovely for children too.",
        },
        {
          name: "Radio Kootwijk",
          time: "± 20 min",
          text: "Remarkable old radio station in the middle of an impressive drift-sand landscape. An atmospheric place to walk, something a little different.",
        },
        {
          name: "Kasteel Staverden",
          time: "± 15 min",
          text: "Tiny village (the smallest in the Netherlands!) with a little castle and a watermill. Wonderfully quiet for a walk.",
        },
        {
          name: "Speulderbos & Garderen",
          time: "± 10-15 min",
          text: "Beautiful woodland walks just around the corner.",
        },
      ],
    },
    {
      title: "Culture & museums",
      places: [
        {
          name: "Kröller-Müller Museum",
          time: "± 25-30 min, in De Hoge Veluwe",
          text: "World-famous art collection with many works by Van Gogh, plus a beautiful sculpture garden.",
        },
        {
          name: "Het Loo Palace, Apeldoorn",
          time: "± 25-30 min",
          text: "Former royal palace with magnificent gardens.",
        },
        {
          name: "Amersfoort",
          time: "± 25-30 min",
          text: "Charming historic town centre with the Koppelpoort water gate, little canals and lovely terraces.",
        },
        {
          name: "Elburg",
          time: "± 30 min",
          text: "Well-preserved medieval fortified town, very atmospheric for a stroll.",
        },
        {
          name: "Kasteel Cannenburch, Vaassen",
          time: "± 35 min",
          text: "Atmospheric castle with beautiful gardens.",
        },
        {
          name: "Netherlands Open Air Museum, Arnhem",
          time: "± 40 min",
          text: "Historic buildings and stories from all over the Netherlands, on one large site.",
        },
        {
          name: "National Military Museum, Soesterberg",
          time: "± 40 min",
          text: "Fascinating museum about war and peace, with aircraft outside as well.",
        },
      ],
    },
    {
      title: "Charming villages & towns",
      places: [
        {
          name: "Barneveld",
          time: "± 10 min",
          text: "The nearest town, nice for a drink on a terrace or some shopping.",
        },
        {
          name: "Garderen",
          time: "± 10-15 min",
          text: "Cosy Veluwe village with its own village square, nice little shops and terraces, just around the corner.",
        },
        {
          name: "Amersfoort",
          time: "± 25-30 min",
          text: "Atmospheric historic town centre with the Koppelpoort, charming canals and plenty of terraces and shops.",
        },
        {
          name: "Nunspeet",
          time: "± 20 min",
          text: "On the edge of the Veluwe, with small beaches on the Veluwemeer lake.",
        },
        {
          name: "Harderwijk",
          time: "± 20-25 min",
          text: "Historic little harbour town on the water, lovely for a walk.",
        },
        {
          name: "Hattem",
          time: "± 35 min",
          text: "Small, well-preserved fortified town, very picturesque.",
        },
        {
          name: "Deventer",
          time: "± 40-45 min",
          text: "Atmospheric Hanseatic town with a charming historic centre.",
        },
        {
          name: "Zwolle",
          time: "± 45 min",
          text: "Beautiful old town centre, lots of terraces and shops.",
        },
        {
          name: "Nijmegen",
          time: "± 50 min",
          text: "The oldest city in the Netherlands, with a lovely riverside promenade along the Waal.",
        },
        {
          name: "Utrecht",
          time: "± 50-55 min",
          text: "Atmospheric canals, the Dom Tower and plenty to do.",
        },
      ],
    },
    {
      title: "Relaxing",
      places: [
        {
          name: "Sauna Drôme, just around the corner from Pleuntje",
          time: "± 5 min",
          text: "Wonderfully close! Authentic wood-fired saunas, a lovely outdoor pool and a Turkish hammam, surrounded by woods and water.",
          url: DROME,
          logo: DROME_LOGO,
        },
      ],
    },
    {
      title: "Fun for children",
      places: [
        {
          name: "Bosbad Putten",
          time: "± 10 min",
          text: "Lovely natural swimming pool in the middle of the woods, with a real little beach. Great for the whole family, close by.",
        },
        {
          name: "Apenheul, Apeldoorn",
          time: "± 25-30 min",
          text: "Zoo where the monkeys roam freely. Fun for adults too!",
        },
        {
          name: "Julianatoren, Apeldoorn",
          time: "± 25-30 min",
          text: "Amusement park for little ones.",
        },
        {
          name: "Dolfinarium, Harderwijk",
          time: "± 20-25 min",
          text: "Shows with dolphins and sea lions.",
        },
        {
          name: "Burgers' Zoo, Arnhem",
          time: "± 40 min",
          text: "Large, beautiful zoo with different climate zones. Great for adults too.",
        },
        {
          name: "Walibi Holland, Biddinghuizen",
          time: "± 40-45 min",
          text: "Theme park with roller coasters, especially fun for older children and teenagers.",
        },
      ],
    },
  ],

  fr: [
    {
      title: "Nature & randonnée",
      places: [
        {
          name: "Landgoed Schovenhorst",
          time: "± 10-15 min",
          text: "Magnifique domaine avec cinq arboretums remarquables, une forêt de jeux et la Bostoren, une tour d'observation de 40 mètres que l'on peut gravir pour une vue spectaculaire sur la Veluwe. Idéal aussi pour les enfants : filets d'escalade, construction de cabanes et bac à sable.",
          url: SCHOVENHORST,
        },
        {
          name: "Parc national De Hoge Veluwe",
          time: "± 25 min",
          text: "Superbe espace naturel avec forêts, landes et dunes de sable. Empruntez gratuitement l'un des vélos blancs pour vous balader. Très bien aussi pour les enfants.",
        },
        {
          name: "Radio Kootwijk",
          time: "± 20 min",
          text: "Ancienne station de radio étonnante, au milieu d'un impressionnant paysage de sable. Une promenade pleine de caractère, un peu différente.",
        },
        {
          name: "Kasteel Staverden",
          time: "± 15 min",
          text: "Minuscule village (le plus petit des Pays-Bas !) avec un petit château et un moulin à eau. Idéal pour une promenade au calme.",
        },
        {
          name: "Speulderbos & Garderen",
          time: "± 10-15 min",
          text: "De belles balades en forêt tout près.",
        },
      ],
    },
    {
      title: "Culture & musées",
      places: [
        {
          name: "Musée Kröller-Müller",
          time: "± 25-30 min, dans le parc De Hoge Veluwe",
          text: "Collection d'art de renommée mondiale avec de nombreuses œuvres de Van Gogh, et un superbe jardin de sculptures.",
        },
        {
          name: "Palais Het Loo, Apeldoorn",
          time: "± 25-30 min",
          text: "Ancien palais royal entouré de jardins splendides.",
        },
        {
          name: "Amersfoort",
          time: "± 25-30 min",
          text: "Centre historique convivial avec la porte d'eau Koppelpoort, de petits canaux et de jolies terrasses.",
        },
        {
          name: "Elburg",
          time: "± 30 min",
          text: "Petite ville fortifiée médiévale bien préservée, pleine de charme pour flâner.",
        },
        {
          name: "Kasteel Cannenburch, Vaassen",
          time: "± 35 min",
          text: "Château plein de charme avec de beaux jardins.",
        },
        {
          name: "Musée néerlandais en plein air, Arnhem",
          time: "± 40 min",
          text: "Des bâtiments historiques et des histoires de tous les Pays-Bas, réunis sur un grand site.",
        },
        {
          name: "Musée militaire national, Soesterberg",
          time: "± 40 min",
          text: "Musée passionnant sur la guerre et la paix, avec aussi des avions à l'extérieur.",
        },
      ],
    },
    {
      title: "Villages & villes pittoresques",
      places: [
        {
          name: "Barneveld",
          time: "± 10 min",
          text: "La ville la plus proche, agréable pour boire un verre en terrasse ou faire quelques courses.",
        },
        {
          name: "Garderen",
          time: "± 10-15 min",
          text: "Charmant village de la Veluwe avec sa place, de jolies petites boutiques et des terrasses conviviales, tout près.",
        },
        {
          name: "Amersfoort",
          time: "± 25-30 min",
          text: "Centre historique plein de charme avec la Koppelpoort, de jolis canaux et de nombreuses terrasses et boutiques.",
        },
        {
          name: "Nunspeet",
          time: "± 20 min",
          text: "En bordure de la Veluwe, avec de petites plages au bord du lac Veluwemeer.",
        },
        {
          name: "Harderwijk",
          time: "± 20-25 min",
          text: "Petite ville portuaire historique au bord de l'eau, agréable pour se promener.",
        },
        {
          name: "Hattem",
          time: "± 35 min",
          text: "Petite ville fortifiée bien préservée, très pittoresque.",
        },
        {
          name: "Deventer",
          time: "± 40-45 min",
          text: "Ville hanséatique pleine de charme avec un centre historique convivial.",
        },
        {
          name: "Zwolle",
          time: "± 45 min",
          text: "Magnifique vieille ville, avec beaucoup de terrasses et de boutiques.",
        },
        {
          name: "Nijmegen",
          time: "± 50 min",
          text: "La plus ancienne ville des Pays-Bas, avec une belle promenade le long du Waal.",
        },
        {
          name: "Utrecht",
          time: "± 50-55 min",
          text: "Canaux pleins de charme, la tour du Dom et beaucoup à faire.",
        },
      ],
    },
    {
      title: "Détente",
      places: [
        {
          name: "Sauna Drôme, juste à côté de Pleuntje",
          time: "± 5 min",
          text: "Tout près ! D'authentiques saunas chauffés au bois, une agréable piscine extérieure et un hammam turc, entourés de forêt et d'eau.",
          url: DROME,
          logo: DROME_LOGO,
        },
      ],
    },
    {
      title: "Pour les enfants",
      places: [
        {
          name: "Bosbad Putten",
          time: "± 10 min",
          text: "Superbe piscine naturelle au milieu des bois, avec une vraie petite plage. Parfait pour toute la famille, tout près.",
        },
        {
          name: "Apenheul, Apeldoorn",
          time: "± 25-30 min",
          text: "Zoo où les singes se promènent en liberté. Amusant aussi pour les adultes !",
        },
        {
          name: "Julianatoren, Apeldoorn",
          time: "± 25-30 min",
          text: "Parc d'attractions pour les petits.",
        },
        {
          name: "Dolfinarium, Harderwijk",
          time: "± 20-25 min",
          text: "Spectacles de dauphins et d'otaries.",
        },
        {
          name: "Burgers' Zoo, Arnhem",
          time: "± 40 min",
          text: "Grand et beau zoo avec différentes zones climatiques. Super aussi pour les adultes.",
        },
        {
          name: "Walibi Holland, Biddinghuizen",
          time: "± 40-45 min",
          text: "Parc d'attractions avec montagnes russes, surtout pour les enfants plus âgés et les ados.",
        },
      ],
    },
  ],
};
