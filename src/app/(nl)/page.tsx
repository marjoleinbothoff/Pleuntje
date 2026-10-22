import Voorkant from "@/components/Voorkant";
import { TAAL_OPSLAG } from "@/i18n/talen";

// Automatisch de juiste taal (22 okt 2026, keuze van Marjolein):
// komt iemand voor het eerst op de Nederlandse voorkant en staat zijn browser op
// Duits, Frans of een andere taal, dan gaat hij meteen naar /de/, /fr/ of /en/.
// Niet als: de bezoeker al eens zelf een taal koos (taalknopjes), Nederlands ergens
// in de taalinstellingen staat, de browser Engels is maar in Nederland staat (veel
// Nederlanders hebben hun telefoon in het Engels), of het een zoekmachine is
// (Google moet de Nederlandse voorkant gewoon zien).
const taalWissel = `(function(){try{
var k=${JSON.stringify(TAAL_OPSLAG)};
try{if(localStorage.getItem(k))return;}catch(e){return;}
if(navigator.webdriver||/bot|crawl|spider|slurp|google|bing|yandex|baidu|duckduck|lighthouse|headless|preview|facebookexternalhit|whatsapp/i.test(navigator.userAgent||""))return;
var l=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||""]).map(function(x){return String(x||"").toLowerCase().slice(0,2);});
if(l.indexOf("nl")>=0||l.indexOf("fy")>=0||l.indexOf("af")>=0)return;
var t="en";for(var i=0;i<l.length;i++){if(l[i]==="de"||l[i]==="fr"||l[i]==="en"){t=l[i];break;}}
var z="";try{z=Intl.DateTimeFormat().resolvedOptions().timeZone||"";}catch(e){}
if(t==="en"&&z==="Europe/Amsterdam")return;
location.replace("/"+t+"/"+location.hash);
}catch(e){}})();`;

export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: taalWissel }} />
      <Voorkant taal="nl" />
    </>
  );
}
