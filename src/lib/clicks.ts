import { UAParser } from 'ua-parser-js'
import { execute } from './db'
import { hashIp } from './rateLimit'
import { isBot } from './botDetection'
import type { DeviceType } from '@/types'

interface TrackClickOptions {
  linkId:    number
  userAgent: string | null
  referrer:  string | null
  clientIp:  string
}

/**
 * Trackt einen Click in der `clicks`-Tabelle.
 * Bots werden ignoriert. Fire-and-forget – wirft keinen Fehler.
 *
 * Der Aufrufer sollte das Promise nicht awaiten,
 * damit Redirects nicht durch DB-Latenz verzögert werden.
 */
export async function trackClick(opts: TrackClickOptions): Promise<void> {
  const { linkId, userAgent, referrer, clientIp } = opts

  // Bots überspringen
  if (isBot(userAgent)) return

  try {
    // ─── User-Agent parsen ─────────────────────────────────────────
    const parser = new UAParser(userAgent ?? '')
    const result = parser.getResult()

    const browser = result.browser.name ?? null
    const os      = result.os.name      ?? null
    const device  = mapDeviceType(result.device.type)

    // ─── Referrer normalisieren (max. 500 Zeichen, ohne Querystring-Spam) ───
    const cleanRef = referrer ? sanitizeReferrer(referrer) : null

    // ─── In DB schreiben ──────────────────────────────────────────
    await execute(
      `INSERT INTO clicks
         (link_id, ip_hash, referrer, browser, os, device_type)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        linkId,
        hashIp(clientIp),
        cleanRef,
        browser,
        os,
        device,
      ]
    )
  } catch (err) {
    console.error('[trackClick] Fehler beim Tracking:', err)
    // Bewusst kein Re-throw – Tracking darf den Redirect nicht stören
  }
}

/**
 * Mappt ua-parser-js Device-Types auf unsere DeviceType-Werte.
 */
function mapDeviceType(type: string | undefined): DeviceType {
  if (!type) return 'desktop'
  if (type === 'mobile') return 'mobile'
  if (type === 'tablet') return 'tablet'
  return 'desktop'
}

/**
 * Bereinigt Referrer-URLs:
 * - Schneidet auf 500 Zeichen
 * - Entfernt Query-Strings (Privacy)
 */
function sanitizeReferrer(ref: string): string | null {
  try {
    const url = new URL(ref)
    return `${url.protocol}//${url.host}${url.pathname}`.slice(0, 500)
  } catch {
    return ref.slice(0, 500)
  }
}
