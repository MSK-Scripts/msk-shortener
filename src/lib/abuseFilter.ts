/**
 * Anti-Abuse-Filter für URL-Shortener:
 *
 * 1. Verhindert "Shortener-Chaining" (Verschachtelung anderer Kurz-URLs)
 * 2. Verhindert Selbst-Shortening (Endlosschleifen)
 * 3. Blockiert bekannte Phishing-/Malware-Domains
 * 4. Optionale TLD-Blacklist
 *
 * Diese Liste ist absichtlich konservativ. Erweitern bei Bedarf.
 */

// ─── Andere Shortener (Verkettung verhindern) ─────────────────────────
const SHORTENER_DOMAINS = new Set<string>([
  'bit.ly', 'bitly.com',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'is.gd',
  'ow.ly',
  'buff.ly',
  'tiny.cc',
  'shorturl.at',
  'rebrand.ly',
  'cutt.ly',
  's.id',
  'rb.gy',
])

// ─── Bekannte Phishing/Abuse-Domains ──────────────────────────────────
// (Hier können bei Bedarf weitere Domains ergänzt werden)
const BLOCKED_DOMAINS = new Set<string>([
  // Beispiel-Einträge
])

// ─── Optional: TLDs mit hoher Abuse-Quote ─────────────────────────────
// Aktiv = nicht gesetzt. Wenn du z. B. .tk oder .gq blocken willst, hier einfügen.
const BLOCKED_TLDS = new Set<string>([])

export interface AbuseCheckResult {
  blocked:  boolean
  reason?:  string
}

/**
 * Prüft eine URL gegen alle Abuse-Filter.
 */
export function checkUrlForAbuse(url: string): AbuseCheckResult {
  let hostname: string
  try {
    hostname = new URL(url).hostname.toLowerCase()
  } catch {
    return { blocked: true, reason: 'Ungültige URL' }
  }

  // ─── 1. Selbst-Shortening verhindern ──────────────────────────────
  const baseUrlEnv = process.env.NEXT_PUBLIC_BASE_URL
  if (baseUrlEnv) {
    try {
      const ourHost = new URL(baseUrlEnv).hostname.toLowerCase()
      if (hostname === ourHost) {
        return {
          blocked: true,
          reason:  'Eigene Kurz-URLs können nicht weiter gekürzt werden',
        }
      }
    } catch {
      // Falls BASE_URL fehlerhaft ist: ignorieren
    }
  }

  // ─── 2. Andere Shortener blockieren ───────────────────────────────
  if (SHORTENER_DOMAINS.has(hostname)) {
    return {
      blocked: true,
      reason:  'Kurz-URLs anderer Shortener werden nicht akzeptiert',
    }
  }

  // ─── 3. Phishing/Abuse-Blacklist ──────────────────────────────────
  if (BLOCKED_DOMAINS.has(hostname)) {
    return {
      blocked: true,
      reason:  'Diese Domain ist nicht erlaubt',
    }
  }

  // ─── 4. TLD-Check ─────────────────────────────────────────────────
  const tld = hostname.split('.').pop()
  if (tld && BLOCKED_TLDS.has(tld)) {
    return {
      blocked: true,
      reason:  `Die TLD .${tld} ist nicht erlaubt`,
    }
  }

  return { blocked: false }
}

/**
 * Helper, um neue Domains zur Blacklist hinzuzufügen (z. B. via Admin-Skript).
 */
export function addBlockedDomain(domain: string): void {
  BLOCKED_DOMAINS.add(domain.toLowerCase())
}
