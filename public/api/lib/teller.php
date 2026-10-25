<?php
// Bezoekersteller van boshuispleuntje.nl (25 okt 2026, wens Marjolein).
// Telt mensen en computers per dag en mailt elke ochtend om 8:00 een overzicht van gisteren naar info@.
// Privacy: er wordt geen IP-adres en geen cookie bewaard. Een bezoeker krijgt per dag een
// onherkenbare code (hash met een geheim dat elke dag wordt vervangen en daarna weggegooid),
// zodat je dezelfde persoon op één dag niet dubbel telt, maar niemand kunt volgen of herkennen.
defined('PLEUNTJE') or exit;

const TELLER_BEWAAR_DAGEN = 60;
const TELLER_MAIL_UUR = 8;

// Bekende computers: naam en waarom ze langskomen (in gewone taal voor Marjolein)
function teller_computers(): array
{
    return [
        ['/Googlebot|Google-InspectionTool|GoogleOther|Storebot-Google|AdsBot-Google|Mediapartners-Google/i', 'Google', 'leest je site door, zodat hij te vinden is in Google'],
        ['/Google-Calendar|Google-Calendar-Importer|Google Calendar/i', 'Google Agenda', 'haalt je boekingen op voor je eigen Google Agenda'],
        ['/bingbot|BingPreview|msnbot/i', 'Bing (Microsoft)', 'leest je site door voor de zoekmachine Bing'],
        ['/DuckDuckBot|DuckAssistBot/i', 'DuckDuckGo', 'leest je site door voor de zoekmachine DuckDuckGo'],
        ['/YandexBot|YandexImages/i', 'Yandex', 'Russische zoekmachine die je site doorleest'],
        ['/Baiduspider/i', 'Baidu', 'Chinese zoekmachine die je site doorleest'],
        ['/Applebot/i', 'Apple', 'leest je site voor Siri en zoeken op iPhone'],
        ['/Airbnb/i', 'Airbnb', 'haalt je agenda op, zodat bezette dagen ook in Airbnb dicht staan'],
        ['/facebookexternalhit|Facebot|meta-externalagent|meta-externalfetcher/i', 'Facebook/Instagram', 'maakt een voorbeeldje (foto en titel) als iemand je link deelt, of leest mee voor Meta'],
        ['/WhatsApp/i', 'WhatsApp', 'maakt een voorbeeldje als iemand je link in WhatsApp stuurt'],
        ['/Twitterbot|LinkedInBot|Pinterest|Slackbot|TelegramBot|Discordbot|SkypeUriPreview|Iframely|Embedly/i', 'Berichten-apps', 'maken een voorbeeldje als iemand je link deelt'],
        ['/GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Bytespider|Amazonbot|cohere-ai|Google-Extended|Diffbot|YouBot/i', 'AI-diensten', 'lezen je site om vragen van hun gebruikers te beantwoorden (zoals ChatGPT)'],
        ['/AhrefsBot|SemrushBot|MJ12bot|DotBot|DataForSeoBot|BLEXBot|SeznamBot|serpstatbot|PetalBot|Barkrowler|SEOkicks|Screaming Frog/i', 'Marketingbureaus', 'verzamelen gegevens over websites voor reclame- en zoekbureaus'],
        ['/UptimeRobot|Pingdom|StatusCake|Site24x7|Uptime/i', 'Bewakingsdiensten', 'kijken of je site in de lucht is'],
        ['/Mollie/i', 'Mollie', 'meldt dat een betaling is gelukt of veranderd'],
        ['/^curl\//i', 'Je eigen controle', 'kijkt elk uur of alles werkt en verstuurt op tijd de mails aan gasten'],
    ];
}

// Herkent een computer aan zijn naam. Geeft [naam, reden] of null voor een gewone bezoeker.
function teller_herken_computer(string $ua): ?array
{
    foreach (teller_computers() as [$patroon, $naam, $reden]) {
        if (preg_match($patroon, $ua)) return [$naam, $reden];
    }
    if ($ua === '' || preg_match('/bot\b|bot\/|crawl|spider|slurp|scan|fetch|python|java\/|wget|go-http|okhttp|axios|node-fetch|headless|phantom|lighthouse|httpclient|libwww|scrapy|feed/i', $ua)) {
        return ['Overige computers', 'onbekende programma\'s die het internet afstruinen (meestal onschuldig)'];
    }
    return null;
}

function teller_bestand(string $dag): string
{
    return 'teller-' . $dag . '.json';
}

// Werkt de telling van vandaag bij, met een eigen slot (los van boekingen, zodat het nooit iets ophoudt)
function teller_bij(callable $wijzig, ?string $dag = null): void
{
    try {
        $dag = $dag ?? date('Y-m-d');
        $slot = @fopen(gegevensmap() . '/.slot-teller', 'c');
        if (!$slot) return;
        flock($slot, LOCK_EX);
        try {
            $data = lees_json(teller_bestand($dag), []);
            $data += ['mensen' => [], 'computers' => [], 'gebeurtenissen' => []];
            $data = $wijzig($data);
            schrijf_json(teller_bestand($dag), $data);
        } finally {
            flock($slot, LOCK_UN);
            fclose($slot);
        }
    } catch (Throwable $e) {
        // Tellen mag nooit iets anders laten mislukken
    }
}

// Onherkenbare code voor een bezoeker, alleen geldig op deze dag
function teller_bezoekerscode(): string
{
    $dag = date('Y-m-d');
    $zout = lees_json('teller-zout.json', []);
    if (($zout['dag'] ?? '') !== $dag) {
        $zout = ['dag' => $dag, 'geheim' => bin2hex(random_bytes(16))];
        try { schrijf_json('teller-zout.json', $zout); } catch (Throwable $e) {}
    }
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    return substr(hash('sha256', $zout['geheim'] . '|' . $ip . '|' . $ua), 0, 16);
}

function teller_apparaat(string $ua): string
{
    if (preg_match('/iPad|Tablet|Android(?!.*Mobile)/i', $ua)) return 'tablet';
    if (preg_match('/Mobi|iPhone|Android/i', $ua)) return 'telefoon';
    return 'computer';
}

// Waar kwam iemand vandaan (op basis van de vorige pagina)
function teller_bron(string $verwijzing): string
{
    $host = strtolower((string)parse_url($verwijzing, PHP_URL_HOST));
    $host = preg_replace('/^(www|m|l|lm)\./', '', $host);
    if ($host === '' || str_ends_with($host, 'boshuispleuntje.nl')) return 'direct';
    if (preg_match('/(^|\.)google\./', $host)) return 'Google';
    if (preg_match('/(^|\.)airbnb\./', $host)) return 'Airbnb';
    if (preg_match('/facebook\.com|fb\.com|instagram\.com/', $host)) return 'Facebook/Instagram';
    if (preg_match('/bing\.com/', $host)) return 'Bing';
    if (preg_match('/duckduckgo\.com/', $host)) return 'DuckDuckGo';
    if (preg_match('/whatsapp/', $host)) return 'WhatsApp';
    if (preg_match('/mail\.|outlook|gmail/', $host)) return 'e-mail';
    return $host;
}

// Een computer telt mee (door de server zelf aangeroepen, bijv. bij agenda.php of een pagina)
// $anders: wie het waarschijnlijk is als de naam niet herkend wordt (bijv. bij de agendalink voor Airbnb)
function tel_computer(?string $ua = null, ?array $anders = null): bool
{
    $ua = $ua ?? (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
    $herkend = teller_herken_computer($ua);
    if ($anders && (!$herkend || $herkend[0] === 'Overige computers')) {
        // Een gewone browser op deze link is meestal Marjolein zelf: niet tellen
        if (!$herkend && preg_match('/Mozilla\/5\.0 \((iPhone|iPad|Macintosh|Windows|Linux; Android)/', $ua) && !preg_match('/Google/i', $ua)) return false;
        $herkend = $anders;
    }
    if (!$herkend) return false;
    [$naam, $reden] = $herkend;
    teller_bij(function ($d) use ($naam, $reden) {
        $d['computers'][$naam] = ['aantal' => ($d['computers'][$naam]['aantal'] ?? 0) + 1, 'reden' => $reden];
        return $d;
    });
    return true;
}

// Een gebeurtenis zonder persoon erbij (betaling gestart, geboekt, aanvraag, vraag)
function tel_gebeurtenis(string $soort): void
{
    teller_bij(function ($d) use ($soort) {
        $d['gebeurtenissen'][$soort] = ($d['gebeurtenissen'][$soort] ?? 0) + 1;
        return $d;
    });
}

// Een bezoek van een mens (via het stukje op elke pagina)
function tel_bezoek(string $soort, string $pagina, string $verwijzing, string $taal): void
{
    $ua = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
    if (tel_computer($ua)) return;
    $code = teller_bezoekerscode();
    $apparaat = teller_apparaat($ua);
    $bron = teller_bron($verwijzing);
    $taal = in_array($taal, ['nl', 'de', 'en', 'fr'], true) ? $taal : 'nl';
    $pagina = substr(preg_replace('/[^a-z0-9\/_-]/i', '', $pagina), 0, 60) ?: '/';
    teller_bij(function ($d) use ($code, $soort, $pagina, $bron, $taal, $apparaat) {
        $m = $d['mensen'][$code] ?? ['paginas' => 0, 'bron' => $bron, 'taal' => $taal, 'apparaat' => $apparaat, 'gezien' => []];
        if ($soort === 'pagina') {
            $m['paginas']++;
            if (count($m['gezien']) < 15 && !in_array($pagina, $m['gezien'], true)) $m['gezien'][] = $pagina;
            if ($m['bron'] === 'direct' && $bron !== 'direct') $m['bron'] = $bron;
        } elseif ($soort === 'boekvenster') {
            $m['boekvenster'] = true;
        }
        $d['mensen'][$code] = $m;
        return $d;
    });
}

function teller_nl_dag(string $dag): string
{
    $dagen = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
    $maanden = ['', 'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
    $t = strtotime($dag . ' 12:00');
    return $dagen[(int)date('w', $t)] . ' ' . (int)date('j', $t) . ' ' . $maanden[(int)date('n', $t)];
}

function teller_lijstje(array $telling): string
{
    arsort($telling);
    $delen = [];
    foreach ($telling as $naam => $aantal) $delen[] = $naam . ' ' . $aantal;
    return implode(' · ', $delen);
}

// Het ochtendmailtje over één dag. Geeft [onderwerp, tekst].
function teller_rapport(string $dag): array
{
    $d = lees_json(teller_bestand($dag), []);
    $mensen = $d['mensen'] ?? [];
    $computers = $d['computers'] ?? [];
    $g = $d['gebeurtenissen'] ?? [];
    $aantal = count($mensen);
    $paginas = array_sum(array_map(fn($m) => $m['paginas'] ?? 0, $mensen));
    $kalender = count(array_filter($mensen, fn($m) => !empty($m['boekvenster'])));
    $dagNaam = teller_nl_dag($dag);

    $r = [];
    $r[] = 'Bezoek aan boshuispleuntje.nl op ' . $dagNaam;
    $r[] = '';

    // Extra melding bovenaan als er geboekt, aangevraagd of gevraagd is
    $extra = [];
    if (!empty($g['geboekt'])) $extra[] = ($g['geboekt'] == 1 ? 'Er is 1 keer' : 'Er is ' . $g['geboekt'] . ' keer') . ' geboekt én betaald via je site!';
    if (!empty($g['betaling_gestart'])) $extra[] = $g['betaling_gestart'] . ($g['betaling_gestart'] == 1 ? ' bezoeker begon' : ' bezoekers begonnen') . ' met betalen.';
    if (!empty($g['aanvraag'])) $extra[] = $g['aanvraag'] . ($g['aanvraag'] == 1 ? ' boekingsaanvraag' : ' boekingsaanvragen') . ' ontvangen.';
    if (!empty($g['vraag'])) $extra[] = $g['vraag'] . ($g['vraag'] == 1 ? ' vraag' : ' vragen') . ' gesteld via "Een vraag?".';
    if ($extra) {
        $r[] = 'BOEKEN:';
        foreach ($extra as $e) $r[] = '- ' . $e;
        $r[] = '';
    }

    $r[] = 'MENSEN:';
    if ($aantal === 0) {
        $r[] = '- Er is niemand op je site geweest.';
    } else {
        $r[] = '- ' . ($aantal === 1 ? '1 persoon bekeek' : $aantal . ' mensen bekeken') . ' je site (samen ' . $paginas . ($paginas === 1 ? ' pagina' : ' pagina\'s') . ').';
        $r[] = '- ' . ($kalender === 0 ? 'Niemand opende' : ($kalender === 1 ? '1 persoon opende' : $kalender . ' mensen openden')) . ' het boekingsvenster met de kalender.';
        $bronnen = [];
        $talen = [];
        $apparaten = [];
        $taalNaam = ['nl' => 'Nederlands', 'de' => 'Duits', 'en' => 'Engels', 'fr' => 'Frans'];
        foreach ($mensen as $m) {
            $bronnen[$m['bron']] = ($bronnen[$m['bron']] ?? 0) + 1;
            $t = $taalNaam[$m['taal']] ?? $m['taal'];
            $talen[$t] = ($talen[$t] ?? 0) + 1;
            $apparaten[$m['apparaat']] = ($apparaten[$m['apparaat']] ?? 0) + 1;
        }
        $r[] = '';
        $r[] = 'HOE HEBBEN ZE JE GEVONDEN?';
        arsort($bronnen);
        $uitleg = [
            'Google' => 'via Google (ze zochten iets en klikten op jouw site)',
            'Airbnb' => 'via Airbnb (de link naar je site)',
            'Facebook/Instagram' => 'via Facebook of Instagram',
            'Bing' => 'via de zoekmachine Bing',
            'DuckDuckGo' => 'via de zoekmachine DuckDuckGo',
            'WhatsApp' => 'via een link in WhatsApp',
            'e-mail' => 'via een link in een e-mail',
            'direct' => 'direct: adres zelf getypt, of een link uit een app of mail (welke is niet te zien)',
        ];
        foreach ($bronnen as $bron => $n) {
            $r[] = '- ' . $n . ' ' . ($n === 1 ? 'persoon' : 'mensen') . ' ' . ($uitleg[$bron] ?? 'via de website ' . $bron);
        }
        $r[] = '(Waar ze in Google precies op zochten, geeft Google niet door.)';
        $r[] = '';
        $r[] = 'VERDER:';
        $r[] = '- Taal: ' . teller_lijstje($talen);
        $r[] = '- Apparaat: ' . teller_lijstje($apparaten);
    }
    $r[] = '';

    $r[] = 'COMPUTERS (automatische bezoekers, geen mensen):';
    if (!$computers) {
        $r[] = '- Geen.';
    } else {
        uasort($computers, fn($a, $b) => $b['aantal'] <=> $a['aantal']);
        foreach ($computers as $naam => $c) {
            $r[] = '- ' . $naam . ' (' . $c['aantal'] . ' keer): ' . $c['reden'] . '.';
        }
    }
    $r[] = '';
    $r[] = 'Jouw eigen bezoeken tellen niet mee. Iemand die op telefoon én iPad kijkt, telt als twee mensen. Namen of adressen van bezoekers worden niet bewaard.';

    $onderwerp = 'Bezoek Pleuntje ' . $dagNaam . ': ' . ($aantal === 1 ? '1 persoon' : $aantal . ' mensen')
        . (!empty($g['geboekt']) ? ' (er is geboekt!)' : ($kalender ? ', ' . $kalender . ' in de kalender' : ''));
    return [$onderwerp, implode("\n", $r)];
}

// Wordt vanuit onderhoud() aangeroepen: stuurt na 8:00 één keer het rapport van gisteren en ruimt oude tellingen op
function teller_ochtendmail(): void
{
    try {
        $stand = lees_json('teller-stand.json', null);
        if ($stand === null) {
            $stand = ['gemaild' => '', 'begonnen' => date('Y-m-d')];
            schrijf_json('teller-stand.json', $stand);
        }
        // Eenmalige tussenstand op 25 okt 2026 na 13:00 (wens Marjolein: 'alleen voor deze ene keer')
        // Daarna (wens Marjolein) vandaag elk uur een nieuwe tussenstand, van 14:00 tot en met 23:00
        $uur = (int)date('G');
        if (date('Y-m-d') === '2026-10-25' && $uur >= 14 && $uur <= 23 && ($stand['tussenstand_uur'] ?? 13) < $uur) {
            [$onderwerp, $tekst] = teller_rapport(date('Y-m-d'));
            $onderwerp = 'Tussenstand vandaag tot ' . date('H:i') . ': ' . preg_replace('/^Bezoek Pleuntje [^:]+: /', '', $onderwerp);
            $tekst = "Tussenstand van vandaag: vanaf het moment dat de teller aanging (rond half 1) tot " . date('H:i') . ".\nVandaag krijg je dit elk uur, tot en met 23:00. Vanaf morgen elke ochtend om 8:00 het overzicht van de hele dag ervoor.\n\n" . $tekst;
            if (stuur_mail(MAIL_MARJOLEIN, $onderwerp, $tekst)) {
                $stand['tussenstand_uur'] = $uur;
                schrijf_json('teller-stand.json', $stand);
            }
        }
        if (date('Y-m-d') === '2026-10-25' && (int)date('G') >= 13 && empty($stand['tussenstand'])) {
            [$onderwerp, $tekst] = teller_rapport(date('Y-m-d'));
            $onderwerp = 'Tussenstand vandaag tot ' . date('H:i') . ': ' . preg_replace('/^Bezoek Pleuntje [^:]+: /', '', $onderwerp);
            $tekst = "Eenmalige tussenstand: vanaf het moment dat de teller aanging (rond half 1) tot " . date('H:i') . ".\nVanaf morgen krijg je elke ochtend om 8:00 het overzicht van de hele dag ervoor.\n\n" . $tekst;
            if (stuur_mail(MAIL_MARJOLEIN, $onderwerp, $tekst)) {
                $stand['tussenstand'] = date('Y-m-d H:i');
                schrijf_json('teller-stand.json', $stand);
            }
        }
        if ((int)date('G') < TELLER_MAIL_UUR) return;
        $gisteren = date('Y-m-d', strtotime('-1 day'));
        if (($stand['gemaild'] ?? '') >= $gisteren) return;
        // De eerste dag (toen de teller nog niet bestond) overslaan
        if (($stand['begonnen'] ?? date('Y-m-d')) > $gisteren) {
            $stand['gemaild'] = $gisteren;
            schrijf_json('teller-stand.json', $stand);
            return;
        }
        [$onderwerp, $tekst] = teller_rapport($gisteren);
        if (stuur_mail(MAIL_MARJOLEIN, $onderwerp, $tekst)) {
            $stand['gemaild'] = $gisteren;
            schrijf_json('teller-stand.json', $stand);
        }
        // Oude tellingen weg (privacy en opruimen)
        foreach (glob(gegevensmap() . '/teller-20*.json') ?: [] as $pad) {
            if (preg_match('/teller-(\d{4}-\d{2}-\d{2})\.json$/', $pad, $m) && $m[1] < date('Y-m-d', strtotime('-' . TELLER_BEWAAR_DAGEN . ' days'))) @unlink($pad);
        }
    } catch (Throwable $e) {
        // Nooit iets anders laten mislukken
    }
}
