<?php
// Gedeelde onderdelen voor de agenda van boshuispleuntje.nl.
// Dit bestand is niet los op te vragen (zie .htaccess en de regel hieronder).
defined('PLEUNTJE') or exit;

date_default_timezone_set('Europe/Amsterdam');

const AIRBNB_VERVERS_SECONDEN = 15 * 60;
const MAX_MISLUKTE_POGINGEN = 8;
const BLOKKEER_SECONDEN = 15 * 60;

function instellingen(): array
{
    static $instellingen = null;
    if ($instellingen === null) {
        $instellingen = require __DIR__ . '/instellingen.php';
    }
    return $instellingen;
}

// De gegevens staan bij voorkeur buiten de map van de website, zodat ze nooit
// via een webadres op te vragen zijn. Lukt dat niet, dan in een afgeschermde map.
function gegevensmap(): string
{
    static $map = null;
    if ($map !== null) return $map;

    $kandidaten = [
        dirname(__DIR__, 3) . '/pleuntje-gegevens',
        __DIR__ . '/gegevens',
    ];
    foreach ($kandidaten as $kandidaat) {
        if (!is_dir($kandidaat)) @mkdir($kandidaat, 0700, true);
        if (is_dir($kandidaat) && is_writable($kandidaat)) {
            $map = $kandidaat;
            return $map;
        }
    }
    throw new RuntimeException('Geen schrijfbare map voor gegevens gevonden.');
}

function lees_json(string $naam, $standaard)
{
    $pad = gegevensmap() . '/' . $naam;
    if (!is_file($pad)) return $standaard;
    $inhoud = @file_get_contents($pad);
    if ($inhoud === false) return $standaard;
    $data = json_decode($inhoud, true);
    return $data === null ? $standaard : $data;
}

function schrijf_json(string $naam, $data): void
{
    $pad = gegevensmap() . '/' . $naam;
    $tijdelijk = $pad . '.' . bin2hex(random_bytes(4)) . '.tmp';
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (@file_put_contents($tijdelijk, $json, LOCK_EX) === false || !@rename($tijdelijk, $pad)) {
        @unlink($tijdelijk);
        throw new RuntimeException('Opslaan mislukt.');
    }
    // Bewaar ook een reservekopie per dag, voor het geval er iets misgaat.
    if ($naam === 'blokkades.json') {
        @copy($pad, gegevensmap() . '/reserve-blokkades-' . date('Y-m-d') . '.json');
    }
}

// Een slot zodat twee wijzigingen tegelijk elkaar niet overschrijven.
function met_slot(callable $taak)
{
    $slot = fopen(gegevensmap() . '/.slot', 'c');
    flock($slot, LOCK_EX);
    try {
        return $taak();
    } finally {
        flock($slot, LOCK_UN);
        fclose($slot);
    }
}

function geldige_datum($datum): bool
{
    if (!is_string($datum) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $datum)) return false;
    [$j, $m, $d] = array_map('intval', explode('-', $datum));
    return checkdate($m, $d, $j);
}

function volgende_dag(string $datum, int $aantal = 1): string
{
    return (new DateTimeImmutable($datum))->modify(($aantal >= 0 ? '+' : '') . $aantal . ' day')->format('Y-m-d');
}

// Alle nachten van aankomst tot (niet met) vertrek.
function nachten(string $aankomst, string $vertrek): array
{
    $uit = [];
    for ($dag = $aankomst; $dag < $vertrek; $dag = volgende_dag($dag)) {
        $uit[] = $dag;
        if (count($uit) > 800) break; // veiligheidsgrens
    }
    return $uit;
}

// ---------- Blokkades van Marjolein ----------

function blokkades(): array
{
    $data = lees_json('blokkades.json', null);
    if ($data === null) {
        // Eerste keer: neem de boekingen over die al op de site stonden.
        $data = require __DIR__ . '/startdata.php';
        schrijf_json('blokkades.json', $data);
    }
    return $data;
}

// ---------- Airbnb ----------

function airbnb_link(): ?string
{
    $opgeslagen = lees_json('instellingen.json', []);
    return $opgeslagen['airbnb_link'] ?? null;
}

// Haalt de Airbnb-agenda op (hooguit eens per kwartier) en geeft de boekingen terug.
function airbnb_boekingen(bool $forceer = false): array
{
    $cache = lees_json('airbnb-cache.json', ['opgehaald' => 0, 'boekingen' => [], 'gelukt' => false]);
    $link = airbnb_link();
    if (!$link) return ['boekingen' => [], 'gelukt' => false, 'opgehaald' => 0];

    $verouderd = time() - ($cache['opgehaald'] ?? 0) > AIRBNB_VERVERS_SECONDEN;
    if (!$forceer && !$verouderd) return $cache;

    $tekst = haal_op($link);
    if ($tekst === null || strpos($tekst, 'BEGIN:VCALENDAR') === false) {
        // Ophalen mislukt: gebruik de laatste goede versie en probeer het over een kwartier opnieuw.
        $cache['gelukt'] = false;
        $cache['opgehaald'] = time();
        schrijf_json('airbnb-cache.json', $cache);
        return $cache;
    }

    $nieuw = ['opgehaald' => time(), 'gelukt' => true, 'boekingen' => lees_ical($tekst)];
    schrijf_json('airbnb-cache.json', $nieuw);
    return $nieuw;
}

function haal_op(string $url): ?string
{
    if (!function_exists('curl_init')) return null;
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_USERAGENT => 'boshuispleuntje.nl agenda',
    ]);
    $tekst = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ($tekst !== false && $code >= 200 && $code < 300) ? $tekst : null;
}

// Leest een iCal-agenda en geeft per afspraak aankomst, vertrek en soort terug.
function lees_ical(string $tekst): array
{
    $tekst = str_replace(["\r\n", "\r"], "\n", $tekst);
    $tekst = preg_replace("/\n[ \t]/", '', $tekst); // samengevouwen regels weer aan elkaar
    $boekingen = [];
    foreach (explode('BEGIN:VEVENT', $tekst) as $i => $blok) {
        if ($i === 0) continue;
        $velden = [];
        foreach (explode("\n", $blok) as $regel) {
            if (!preg_match('/^([A-Z-]+)(?:;[^:]*)?:(.*)$/', $regel, $m)) continue;
            $velden[$m[1]] = $m[2];
        }
        $start = ical_datum($velden['DTSTART'] ?? '');
        $eind = ical_datum($velden['DTEND'] ?? '');
        if (!$start) continue;
        if (!$eind || $eind <= $start) $eind = volgende_dag($start);
        $titel = trim($velden['SUMMARY'] ?? '');
        $boekingen[] = [
            'aankomst' => $start,
            'vertrek' => $eind,
            'soort' => stripos($titel, 'not available') !== false ? 'geblokkeerd' : 'boeking',
        ];
    }
    usort($boekingen, fn($a, $b) => strcmp($a['aankomst'], $b['aankomst']));
    return $boekingen;
}

function ical_datum(string $waarde): ?string
{
    if (!preg_match('/^(\d{4})(\d{2})(\d{2})/', trim($waarde), $m)) return null;
    $datum = "$m[1]-$m[2]-$m[3]";
    return geldige_datum($datum) ? $datum : null;
}

// ---------- Samen ----------

// Alle bezette nachten: van Marjolein én van Airbnb.
function bezette_nachten(): array
{
    $set = [];
    foreach (blokkades() as $b) {
        foreach (nachten($b['aankomst'], $b['vertrek']) as $n) $set[$n] = true;
    }
    foreach (airbnb_boekingen()['boekingen'] as $b) {
        foreach (nachten($b['aankomst'], $b['vertrek']) as $n) $set[$n] = true;
    }
    $lijst = array_keys($set);
    sort($lijst);
    $vandaag = date('Y-m-d');
    return array_values(array_filter($lijst, fn($n) => $n >= volgende_dag($vandaag, -1)));
}

function stuur_json($data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
