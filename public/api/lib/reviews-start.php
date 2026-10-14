<?php
// Reviews die Marjolein op Airbnb kreeg (openbare recensies, overgenomen van haar schermafbeeldingen
// op 14 okt 2026). Ze worden één keer overgenomen op boshuispleuntje.nl; daarna beheert Marjolein ze
// op /beheer. Nieuwe toevoegen: achteraan, met een nieuwe vaste id. Een id nooit hergebruiken.
// Privéberichten van gasten ("alleen zichtbaar voor jou en Airbnb") horen hier NIET in.
defined('PLEUNTJE') or exit;

return json_decode(<<<'LIJST'
[
  {
    "id": "ab-andre-2512",
    "naam": "André",
    "sterren": 5,
    "maand": "2025-12",
    "tekst": "In het boshuisje Pleuntje hebben wij een heel prettige tijd gehad. Het huisje was sfeervol, met wat kerstversiering ingericht, wat wij heel prettig vonden tijdens de kerst en de dagen erna. Wat ons betreft een schot in de roos.\nOok de omgeving was prachtig en er was uitgebreide informatie over te vinden in de map van het huisje. Heel prettig allemaal."
  },
  {
    "id": "ab-simone-2512",
    "naam": "Simone",
    "sterren": 5,
    "maand": "2025-12",
    "tekst": "Fantastisch om te ontsnappen aan de drukte en Marjolein is een geweldige hoste!"
  },
  {
    "id": "ab-marit-2602",
    "naam": "Marit",
    "sterren": 5,
    "maand": "2026-02",
    "tekst": "Hartelijk bedankt voor een heel spontaan en vooral mooi verblijf! Marjolein heeft super snel gereageerd en de self-checkin was makkelijk. Haar boshuisje is heel erg mooi ingericht. Alles (en meer) wat je nodig had was beschikbaar (zelfs en fön met diffusor!) zodat we lekker konden genieten van de rust en knusheid. We komen graag nog een keer! ☀️"
  },
  {
    "id": "ab-jamaine-2603",
    "naam": "Jamaine",
    "sterren": 5,
    "maand": "2026-03",
    "tekst": "Een fantastische uitvalsbasis voor prachtige wandelingen! De sauna is op loopafstand. Echt een aanrader. Kortom een heerlijke plek om even tot rust te komen."
  },
  {
    "id": "ab-nicole-2604",
    "naam": "Nicole",
    "sterren": 5,
    "maand": "2026-04",
    "tekst": "Pleuntje, een mooi Chalet met alles erop en eraan, om je thuis te voelen in de rustige natuur! Hele dag hoor je de vogeltjes fluiten, de wind door de bomen.. Heerlijk!\nOmheinde tuin, parkeerplaats voor de deur en alles netjes onderhouden en schoon.\nMijn beestjes waren écht welkom, wat vaak wordt aangegeven maar dan wordt er eigenlijk bedoelt dat ze getolereerd worden\nCommunicatie verloopt soepel en snel. Marjolein is enorm gastvrij en vriendelijk!\nOndanks dat ik dit als mijn geheime \"plek\" zou willen houden, zou ik het zeker aanraden om te boeken als je net als ik van de natuur en de rust houd!"
  },
  {
    "id": "ab-anouk-2604",
    "naam": "Anouk",
    "sterren": 5,
    "maand": "2026-04",
    "tekst": "heerlijk verblijf gehad in n gezellig huisje. mooie bossen op loopafstand. super dat onze honden ook welkom waren. Host Marjolein super vriendelijk en communicatief. Echt n aanrader!"
  },
  {
    "id": "ab-suzan-2604",
    "naam": "Suzan",
    "sterren": 4,
    "maand": "2026-04",
    "tekst": "Fijne plek in een rustig park. Huisje had alles wat we nodig hadden. Mooie bossen om met de hond te wandelen en een heerlijk dagje sauna gedaan"
  },
  {
    "id": "ab-annemiek-2604",
    "naam": "Annemiek",
    "sterren": 5,
    "maand": "2026-04",
    "tekst": "Marjolein was ontzettend vriendelijk en prettig en snel wat betreft communicatie.\nHet huisje was schoon en precies zoals geadverteerd. Haar instructies waren ook heel erg duidelijk, dus alles ging bijzonder vlot.\nDe tuin is privé en volledig omheind voor de hondjes. De auto kan voor het huisje staan, wat fijn is.\nOok sta je binnen 1 minuut buiten het park waar je de hondjes heel fijn uit kan laten.\nEn een extra shout out naar de 2 eenpersoonsdekbedden op het tweepersoonsbed.\nAl met al een heerlijk verblijf gehad en we komen graag terug."
  },
  {
    "id": "ab-emma-2604",
    "naam": "Emma",
    "sterren": 5,
    "maand": "2026-04",
    "tekst": "Heel fijn verblijf gehad in dit schattige huisje! Bedankt Marjolein"
  },
  {
    "id": "ab-juanita-2604",
    "naam": "Juanita",
    "sterren": 4,
    "maand": "2026-04",
    "tekst": "Wat een fijn verblijf! De sfeer in Pleun is gemoedelijk en knus.\nHet terras is met het ochtendzonnetje heerlijk zo met het geluid van de vogeltjes.\nPutten centrum is met de auto snel te bereiken maar ook met de fiets/ te voet te doen. Hierdoor is de omgeving heerlijk rustig.\n\nHet tweepersoonsbed is 140 breed. Dit is wel fijn om te weten wanneer je niet met je eigen partner bent:) Fijn is dat er 2 losse dekbedden bij zijn.\n\nHet contact met Marjolein was prettig. Ook het zelf incheck systeem is makkelijk.\nPrijs/kwaliteit is ook dik in orde!!"
  },
  {
    "id": "ab-samira-2608",
    "naam": "Samira",
    "sterren": 4,
    "maand": "2026-08",
    "tekst": "Een heel fijn huisje waar je toch een beetje privacy hebt en zo de natuur in bent. Fijn gelegen op de hoek binnen een park. Keuken was schoon en van alles voorzien. Er zijn horren aanwezig ivm de muggen en de bedden slapen heerlijk."
  },
  {
    "id": "ab-goran-2608",
    "naam": "Goran",
    "sterren": 5,
    "maand": "2026-08",
    "tekst": "Heerlijke, rustige omgeving en een zeer vriendelijke en behulpzame host! Aan te raden!"
  },
  {
    "id": "ab-katherine-2608",
    "naam": "Katherine",
    "sterren": 5,
    "maand": "2026-08",
    "tekst": "It was a pleasure to stay at Marjolein's cottage, we felt right at home quickly! The cottage itself was full of charm, simple, decorated nicely with her personal touch and had everything you'd need. We came by car and it was really well located and easy to reach different cities/small towns from the cottage. We also had our 2 dogs with us and they played happily outside in the fenced off area. My parents and I had a wonderful time there together <3 all the best Marjolein! :)"
  },
  {
    "id": "ab-alexander-2608",
    "naam": "Alexander",
    "sterren": 5,
    "maand": "2026-08",
    "tekst": "We hebben een heerlijk lang weekend gehad in Chalet Pleuntje! Het chalet is ontzettend sfeervol en leuk ingericht, waardoor je je meteen thuis voelt. Alles is netjes en schoon en van alle gemakken voorzien.\n\nDe ligging is bovendien fijn als je er even lekker tussenuit wilt en de omgeving van Putten biedt genoeg mogelijkheden om eropuit te gaan.\n\nOok het contact met host Marjolein was erg prettig. Ze is ontzettend vriendelijk, behulpzaam en reageert heel snel op berichten, wat het verblijf extra zorgeloos maakte.\n\nKortom: we hebben een ontzettend fijn verblijf gehad en zouden Chalet Pleuntje zeker aanraden."
  },
  {
    "id": "ab-siri-2608",
    "naam": "Siri",
    "sterren": 5,
    "maand": "2026-08",
    "tekst": "Prima verblijf voor drie personen in een schitterende omgeving!"
  },
  {
    "id": "ab-alja-2609",
    "naam": "Alja",
    "sterren": 4,
    "maand": "2026-09",
    "tekst": "Een heerlijke plek om tot rust te komen. Marjolein heeft het chalet charmant en compleet ingericht. Alles was schoon. Duidelijke instructies aanwezig. Op loopafstand van het bos."
  },
  {
    "id": "ab-dorte-2609",
    "naam": "Dörte",
    "sterren": 5,
    "maand": "2026-09",
    "tekst": "Fijn verblijf gehad in Marjoleins Airbnb! Het was precies zoals op de foto's, schoon en comfortabel.\nWe hebben een leuke tijd gehad en onze honden hebben het ook naar hun zin gehad :)"
  }
]
LIJST, true);
