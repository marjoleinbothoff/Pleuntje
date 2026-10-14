<?php
// Direct boeken en betalen via Mollie, plus het onderhoud dat op de achtergrond loopt.
defined('PLEUNTJE') or exit;

const VASTHOUDEN_MINUTEN = 20;          // zo lang blijven datums vast terwijl iemand betaalt
const MOLLIE_API = 'https://api.mollie.com/v2';
const SITE_URL = 'https://boshuispleuntje.nl';

// ---------- Mollie ----------

function mollie_sleutel(): ?string
{
    $s = lees_json('instellingen.json', [])['mollie_sleutel'] ?? null;
    return is_string($s) && preg_match('/^(test|live)_[A-Za-z0-9]{20,}$/', $s) ? $s : null;
}

// 'live' = echte betalingen, 'test' = nep-betalingen, 'uit' = nog geen sleutel
function mollie_modus(): string
{
    $s = mollie_sleutel();
    if (!$s) return 'uit';
    return str_starts_with($s, 'live_') ? 'live' : 'test';
}

// Voor de tests op Claude's eigen computer kan Mollie worden nagebootst.
function mollie_verzoek(string $methode, string $pad, ?array $gegevens = null, ?string $sleutel = null): array
{
    if (isset($GLOBALS['MOLLIE_NEP']) && is_callable($GLOBALS['MOLLIE_NEP'])) {
        return ($GLOBALS['MOLLIE_NEP'])($methode, $pad, $gegevens);
    }
    $sleutel = $sleutel ?? mollie_sleutel();
    if (!$sleutel || !function_exists('curl_init')) return ['code' => 0, 'data' => null];
    $ch = curl_init(MOLLIE_API . $pad);
    $opties = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_CUSTOMREQUEST => $methode,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $sleutel, 'Content-Type: application/json'],
    ];
    if ($gegevens !== null) $opties[CURLOPT_POSTFIELDS] = json_encode($gegevens);
    curl_setopt_array($ch, $opties);
    $antwoord = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $code, 'data' => $antwoord === false ? null : json_decode($antwoord, true)];
}

// ---------- Prijs (zelfde tarieven als op de site, uit tarieven.json) ----------

function tarieven(): ?array
{
    $pad = dirname(__DIR__, 2) . '/api-data/tarieven.json';
    $data = is_file($pad) ? json_decode((string) file_get_contents($pad), true) : null;
    return is_array($data) && isset($data['hoogseizoenDagen']) ? $data : null;
}

function bereken_prijs(string $aankomst, string $vertrek, int $personen, int $honden): ?array
{
    $t = tarieven();
    if (!$t || $vertrek > $t['tot']) return null;
    $hoog = array_flip($t['hoogseizoenDagen']);
    $verblijf = 0;
    $n = 0;
    foreach (nachten($aankomst, $vertrek) as $nacht) {
        $verblijf += isset($hoog[$nacht]) ? $t['hoogseizoen'] : $t['laagseizoen'];
        $n++;
    }
    $hond = $honden > 0 ? $t['hond'] : 0;
    $belasting = round($n * $personen * $t['toeristenbelasting'], 2);
    $totaal = round($verblijf + $t['schoonmaak'] + $hond + $belasting, 2);
    return ['nachten' => $n, 'totaal' => $totaal, 'belasting' => $belasting];
}

function euro(float $bedrag): string
{
    return '€' . number_format($bedrag, 2, ',', '.');
}

// ---------- Boekingen ----------

function boekingen(): array
{
    return lees_json('boekingen.json', []);
}

function bewaar_boekingen(array $lijst): void
{
    schrijf_json('boekingen.json', array_values($lijst));
}

function zoek_boeking(string $id): ?array
{
    foreach (boekingen() as $b) if ($b['id'] === $id) return $b;
    return null;
}

function werk_boeking_bij(string $id, callable $wijzig): ?array
{
    return met_slot(function () use ($id, $wijzig) {
        $lijst = boekingen();
        foreach ($lijst as $i => $b) {
            if ($b['id'] === $id) {
                $lijst[$i] = $wijzig($b);
                bewaar_boekingen($lijst);
                return $lijst[$i];
            }
        }
        return null;
    });
}

$GLOBALS['MAANDEN_NL'] = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
$GLOBALS['DAGEN_NL'] = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];

function datum_nl(string $iso): string
{
    $d = new DateTimeImmutable($iso);
    return $GLOBALS['DAGEN_NL'][(int) $d->format('w')] . ' ' . (int) $d->format('j') . ' ' . $GLOBALS['MAANDEN_NL'][(int) $d->format('n') - 1] . ' ' . $d->format('Y');
}

// Kijkt bij Mollie hoe het met de betaling van een boeking staat en handelt dat af.
// Wordt aangeroepen door Mollie zelf (webhook), door de terugkeerpagina en door het onderhoud.
function verwerk_betaling(string $boekingId): ?array
{
    $b = zoek_boeking($boekingId);
    if (!$b || empty($b['mollie_id']) || !in_array($b['status'], ['wacht', 'verlopen'], true)) return $b;

    // Een testbetaling kan alleen met de testsleutel worden opgevraagd, en een echte alleen met de live sleutel
    if (($b['mollie_sleutel_soort'] ?? '') !== mollie_modus()) return $b;
    $r = mollie_verzoek('GET', '/payments/' . rawurlencode($b['mollie_id']));
    $status = $r['data']['status'] ?? null;
    if (!$status) return $b;

    if ($status === 'paid') return rond_betaalde_boeking_af($boekingId);

    if (in_array($status, ['canceled', 'expired', 'failed'], true)) {
        return werk_boeking_bij($boekingId, function ($b) use ($status) {
            $b['status'] = 'mislukt';
            $b['mollie_status'] = $status;
            return $b;
        });
    }
    // Nog open: als de vasthoudtijd voorbij is, de datums alvast weer vrijgeven
    if ($b['status'] === 'wacht' && ($b['vasthouden_tot'] ?? 0) <= time()) {
        return werk_boeking_bij($boekingId, function ($b) {
            $b['status'] = 'verlopen';
            return $b;
        });
    }
    return $b;
}

function rond_betaalde_boeking_af(string $boekingId): ?array
{
    $resultaat = met_slot(function () use ($boekingId) {
        $lijst = boekingen();
        $index = null;
        foreach ($lijst as $i => $b) if ($b['id'] === $boekingId) $index = $i;
        if ($index === null) return null;
        $b = $lijst[$index];
        if (!in_array($b['status'], ['wacht', 'verlopen'], true)) return ['boeking' => $b, 'nieuw' => false];

        // Zijn de datums intussen door iemand anders bezet? (alleen mogelijk als de betaling erg laat was)
        $bezet = array_flip(bezette_nachten($boekingId));
        $conflict = false;
        foreach (nachten($b['aankomst'], $b['vertrek']) as $n) if (isset($bezet[$n])) $conflict = true;

        $blokkades = blokkades();
        $blokkadeId = bin2hex(random_bytes(5));
        $blokkades[] = [
            'id' => $blokkadeId,
            'aankomst' => $b['aankomst'],
            'vertrek' => $b['vertrek'],
            'omschrijving' => $b['naam'] . ' (geboekt via boshuispleuntje.nl)',
            'boeking' => $b['id'],
        ];
        schrijf_json('blokkades.json', $blokkades);

        $b['status'] = 'betaald';
        $b['betaald_op'] = date('Y-m-d H:i');
        $b['blokkade'] = $blokkadeId;
        $b['conflict'] = $conflict;
        $lijst[$index] = $b;
        bewaar_boekingen($lijst);
        return ['boeking' => $b, 'nieuw' => true];
    });
    if (!$resultaat) return null;
    $b = $resultaat['boeking'];
    if ($resultaat['nieuw']) {
        stuur_bevestiging($b);
        meld_marjolein_nieuwe_boeking($b);
    }
    return $b;
}

// ---------- Mails rond een boeking ----------

function stuur_bevestiging(array $b): void
{
    $voornaam = trim(explode(' ', $b['naam'])[0]);
    $n = count(nachten($b['aankomst'], $b['vertrek']));
    $tekst = "Hoi $voornaam,\n\n"
        . "Wat leuk dat je komt logeren bij Pleuntje! Je betaling is ontvangen en je boeking is definitief.\n\n"
        . "Aankomst: " . datum_nl($b['aankomst']) . ", inchecken tussen 15:00 en 20:00\n"
        . "Vertrek: " . datum_nl($b['vertrek']) . ", uitchecken voor 11:00\n"
        . "Aantal nachten: $n\n"
        . "Personen: {$b['personen']}" . ($b['honden'] > 0 ? ", honden: {$b['honden']}" : '') . "\n"
        . "Betaald: " . euro($b['bedrag']) . "\n\n"
        . "Een paar dagen voor je aankomst sturen we je alle praktische informatie.\n\n"
        . "Heb je vragen? Beantwoord dan gewoon deze mail.\n\n"
        . "Hartelijke groet,\nMarjolein en Ed\nPleuntje op de Veluwe\n" . SITE_URL . "\n";
    stuur_mail($b['email'], 'Je boeking bij Pleuntje is bevestigd', $tekst);
    stuur_mail(MAIL_MARJOLEIN, 'Kopie: bevestiging aan ' . $b['naam'], "Deze mail is zojuist verstuurd naar {$b['email']}:\n\n------\n\n" . $tekst);
}

function meld_marjolein_nieuwe_boeking(array $b): void
{
    $tekst = "Er is een nieuwe boeking via boshuispleuntje.nl, en er is betaald.\n\n"
        . "Naam: {$b['naam']}\n"
        . "E-mail: {$b['email']}\n"
        . "Telefoon: " . ($b['telefoon'] ?: '-') . "\n"
        . "Aankomst: " . datum_nl($b['aankomst']) . "\n"
        . "Vertrek: " . datum_nl($b['vertrek']) . "\n"
        . "Personen: {$b['personen']}, honden: {$b['honden']}\n"
        . "Betaald: " . euro($b['bedrag']) . ($b['mollie_sleutel_soort'] === 'test' ? " (TESTBETALING, niet echt)" : '') . "\n"
        . "Bericht: " . ($b['bericht'] ?: '-') . "\n\n"
        . "De datums zijn automatisch geblokkeerd op boshuispleuntje.nl en gaan ook naar Airbnb.\n";
    if (!empty($b['conflict'])) {
        $tekst = "LET OP: deze datums waren intussen al bezet (waarschijnlijk via Airbnb). "
            . "Er is nu dubbel geboekt. Neem contact op met de gast en betaal terug via Mollie.\n\n" . $tekst;
    }
    stuur_mail(MAIL_MARJOLEIN, (!empty($b['conflict']) ? 'LET OP dubbel geboekt: ' : 'Nieuwe boeking: ') . $b['naam'] . ', ' . datum_nl($b['aankomst']), $tekst);
}

// ---------- Onderhoud: loopt op de achtergrond, hooguit eens per 5 minuten ----------

function onderhoud(bool $forceer = false): void
{
    try {
        $stempel = lees_json('onderhoud.json', ['laatst' => 0]);
        if (!$forceer && time() - ($stempel['laatst'] ?? 0) < 300) return;
        schrijf_json('onderhoud.json', ['laatst' => time()]);

        // Betalingen die nog openstaan nalopen (voor het geval Mollie's bericht niet aankwam)
        foreach (boekingen() as $b) {
            if (in_array($b['status'], ['wacht', 'verlopen'], true) && !empty($b['mollie_id'])
                && strtotime($b['aangemaakt']) > time() - 2 * 86400) {
                verwerk_betaling($b['id']);
            }
        }
        // Oude mislukte pogingen opruimen (privacy)
        met_slot(function () {
            $grens = date('Y-m-d H:i', time() - 7 * 86400);
            $lijst = array_filter(boekingen(), fn($b) => !(in_array($b['status'], ['mislukt', 'verlopen'], true) && $b['aangemaakt'] < $grens));
            bewaar_boekingen($lijst);
        });
    } catch (Throwable $e) {
        // Onderhoud mag nooit de rest van de site laten mislukken
    }
}
