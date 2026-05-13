import { createHash } from 'crypto'

// ─── In-Memory Rate-Limit (für Single-Server-Setups) ──────────────────
// Für mehrere Server-Instanzen wäre Redis besser, aber für dein Setup reicht das.

type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

// Cleanup-Intervall: Alte Einträge alle 5 Minuten entfernen
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, bucket] of buckets.entries()) {
      if (bucket.resetAt <= now) buckets.delete(key)
    }
  }, CLEANUP_INTERVAL_MS).unref?.()
}

/**
 * Hasht eine IP-Adresse mit dem Secret-Pepper (DSGVO-konform).
 */
export function hashIp(ip: string): string {
  const secret = process.env.IP_HASH_SECRET
  if (!secret) {
    throw new Error('IP_HASH_SECRET ist nicht gesetzt')
  }
  return createHash('sha256').update(ip + secret).digest('hex')
}

/**
 * Prüft das Rate-Limit für einen Identifier (z. B. IP-Hash).
 *
 * @param key       - Eindeutige Kennung (z. B. IP-Hash)
 * @param limit     - Max. Anfragen im Zeitfenster
 * @param windowMs  - Zeitfenster in Millisekunden
 * @returns         - true wenn erlaubt, false wenn überschritten
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now    = Date.now()
  const bucket = buckets.get(key)

  // Neuer Bucket oder abgelaufen
  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + windowMs
    buckets.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: limit - 1, resetAt }
  }

  // Limit erreicht
  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt }
  }

  // Counter erhöhen
  bucket.count++
  return {
    allowed:   true,
    remaining: limit - bucket.count,
    resetAt:   bucket.resetAt,
  }
}

/**
 * Convenience-Wrapper für Link-Erstellung.
 */
export function checkCreateRateLimit(ipHash: string) {
  const limit  = Number(process.env.RATE_LIMIT_CREATE_PER_HOUR ?? 20)
  const window = 60 * 60 * 1000 // 1 Stunde
  return checkRateLimit(`create:${ipHash}`, limit, window)
}

/**
 * Extrahiert die echte Client-IP aus den Request-Headern.
 * Berücksichtigt Apache2 Reverse-Proxy (X-Forwarded-For, X-Real-IP)
 * und Cloudflare (CF-Connecting-IP).
 *
 * Akzeptiert sowohl Standard-`Headers` als auch `ReadonlyHeaders` von next/headers.
 */
export function getClientIp(headers: { get(name: string): string | null }): string {
  const xff      = headers.get('x-forwarded-for')
  const realIp   = headers.get('x-real-ip')
  const cfIp     = headers.get('cf-connecting-ip')

  if (cfIp)    return cfIp.trim()
  if (xff)     return xff.split(',')[0]!.trim()
  if (realIp)  return realIp.trim()

  return '0.0.0.0'
}
