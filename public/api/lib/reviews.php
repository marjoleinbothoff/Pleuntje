<?php
// Reviews van gasten: via een persoonlijke link in de vertrekmail, of door Marjolein
// overgenomen van Airbnb. Niets komt online zonder haar goedkeuring.
defined('PLEUNTJE') or exit;

const REVIEW_GELDIG_DAGEN = 90; // zo lang na vertrek kan de gast nog een review schrijven

function reviews(): array
{
    $lijst = lees_json('reviews.json', null);
    $bekend = lees_json('reviews-start-gezien.json', []);
    $start = is_file(__DIR__ . '/reviews-start.php') ? require __DIR__ . '/reviews-start.php' : [];
    // Airbnb-reviews uit de code één keer overnemen (ook als er later nieuwe bijkomen)
    $nieuw = array_filter($start, fn($r) => !in_array($r['id'], $bekend, true));
    if ($lijst === null || $nieuw) {
        $lijst = $lijst ?? [];
        foreach ($nieuw as $r) {
            $lijst[] = $r + ['bron' => 'airbnb', 'status' => 'geplaatst', 'ingediend' => date('Y-m-d H:i')];
            $bekend[] = $r['id'];
        }
        schrijf_json('reviews.json', $lijst);
        schrijf_json('reviews-start-gezien.json', $bekend);
    }
    return $lijst;
}

function bewaar_reviews(array $lijst): void
{
    schrijf_json('reviews.json', array_values($lijst));
}

// Geheime sleutel om persoonlijke reviewlinks te ondertekenen (staat alleen op de server)
function review_geheim(): string
{
    $o = lees_json('instellingen.json', []);
    if (empty($o['review_geheim'])) {
        met_slot(function () use (&$o) {
            $o = lees_json('instellingen.json', []);
            if (empty($o['review_geheim'])) {
                $o['review_geheim'] = bin2hex(random_bytes(32));
                schrijf_json('instellingen.json', $o);
            }
        });
    }
    return $o['review_geheim'];
}

function review_link(string $blokkadeId): string
{
    $t = substr(hash_hmac('sha256', 'review|' . $blokkadeId, review_geheim()), 0, 24);
    return 'https://boshuispleuntje.nl/review/?b=' . rawurlencode($blokkadeId) . '&t=' . $t;
}

function review_link_klopt(string $blokkadeId, string $t): bool
{
    $verwacht = substr(hash_hmac('sha256', 'review|' . $blokkadeId, review_geheim()), 0, 24);
    return hash_equals($verwacht, $t);
}

// Controleert een persoonlijke link en geeft de blokkade en de gast terug
function review_uitnodiging(string $blokkadeId, string $t): array
{
    if (!preg_match('/^[a-f0-9]{6,20}$/', $blokkadeId) || !review_link_klopt($blokkadeId, $t)) {
        return ['fout' => 'Deze link is niet geldig.'];
    }
    $blokkade = null;
    foreach (blokkades() as $b) if ($b['id'] === $blokkadeId) $blokkade = $b;
    $gast = $blokkade ? gast_bij_blokkade($blokkade) : null;
    if (!$blokkade || !$gast) return ['fout' => 'Deze link is niet (meer) geldig.'];
    if (date('Y-m-d') < $blokkade['aankomst']) return ['fout' => 'Je kunt een review schrijven zodra je verblijf is begonnen.'];
    if (date('Y-m-d') > volgende_dag($blokkade['vertrek'], REVIEW_GELDIG_DAGEN)) return ['fout' => 'Deze link is verlopen.'];
    foreach (reviews() as $r) {
        if (($r['blokkade'] ?? '') === $blokkadeId) return ['fout' => 'Je hebt al een review geschreven. Dank je wel!', 'alGedaan' => true];
    }
    return ['blokkade' => $blokkade, 'gast' => $gast];
}

function openbare_reviews(): array
{
    $uit = [];
    foreach (reviews() as $r) {
        if ($r['status'] !== 'geplaatst') continue;
        $uit[] = [
            'id' => $r['id'],
            'naam' => $r['naam'],
            'sterren' => (int) $r['sterren'],
            'tekst' => $r['tekst'],
            'maand' => $r['maand'],
            'bron' => $r['bron'],
        ];
    }
    usort($uit, fn($a, $b) => strcmp($b['maand'], $a['maand']));
    return $uit;
}
