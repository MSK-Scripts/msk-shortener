import { UAParser } from 'ua-parser-js'
import { getPool } from './db'
import { hashIp } from './rateLimit'
import type { DeviceType } from '@/types'

/**
 * Header-Interface, das sowohl Standard-Headers als auch ReadonlyHeaders akzeptiert.
 */
type ReadableHeaders = { get(name: string): string | null }

export interface ClickContext {
  ip:        string
  userAgent: string | null
  referrer:  string | null
}

/**
 * Extrahiert Click-Kontext aus den Request-Headern.
 */
export function extractClickContext(headers: ReadableHeaders, ip: string): ClickContext {
  return {
    ip,
    userAgent: headers.get('user-agent'),
    referrer:  headers.get('referer'), // HTTP-Standard ist "referer" (Schreibfehler von 1996)
  }
}

/**
 * Verkürzt einen Referrer auf max. 500 Zeichen und entfernt Query-Strings
 * mit sensiblen Daten (Tokens, Session-IDs).
 */
function sanitizeReferrer(referrer: string | null): string | null {
  if (!referrer) return null
  try {
    const url = new URL(referrer)
    // Nur Origin + Pfad behalten (Query-Strings können sensible Daten enthalten)
    const cleaned = `${url.origin}${url.pathname}`
    return cleaned.substring(0, 500)
  } catch {
    return null
  }
}

/**
 * Mapped ua-parser-js Device-Type auf unseren DeviceType.
 */
function normalizeDeviceType(uaDeviceType: string | undefined): DeviceType {
  if (uaDeviceType === 'mobile') return 'mobile'
  if (uaDeviceType === 'tablet') return 'tablet'
  return 'desktop'
}

/**
 * Trackt einen Click: Insert in `clicks`-Tabelle + Increment `click_count`.
 * Beides in einer Transaktion → konsistent.
 *
 * Wirft bei DB-Fehlern, aber NICHT bei UA-Parse-Fehlern.
 */
export async function trackClick(linkId: number, ctx: ClickContext): Promise<void> {
  // ─── User-Agent parsen ────────────────────────────────────────────
  let browser:    string | null = null
  let os:         string | null = null
  let deviceType: DeviceType    = 'desktop'

  if (ctx.userAgent) {
    try {
      const parser = new UAParser(ctx.userAgent)
      browser    = parser.getBrowser().name ?? null
      os         = parser.getOS().name ?? null
      deviceType = normalizeDeviceType(parser.getDevice().type)
    } catch {
      // Stiller Fehlschlag – wir tracken trotzdem
    }
  }

  // ─── Sonstige Felder vorbereiten ──────────────────────────────────
  const ipHash   = hashIp(ctx.ip)
  const referrer = sanitizeReferrer(ctx.referrer)

  // ─── Transaktion: Insert Click + Update Count ─────────────────────
  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    await conn.execute(
      `INSERT INTO clicks
         (link_id, ip_hash, referrer, browser, os, device_type)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [linkId, ipHash, referrer, browser, os, deviceType]
    )

    await conn.execute(
      'UPDATE links SET click_count = click_count + 1 WHERE id = ?',
      [linkId]
    )

    await conn.commit()
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}
