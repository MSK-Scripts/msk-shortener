import { UAParser } from 'ua-parser-js'
import { getPool } from './db'
import { isBot } from './botDetection'
import type { DeviceType } from '@/types'

interface TrackClickOptions {
  linkId:    number
  userAgent: string | null
  referrer:  string | null
}

/**
 * Trackt einen Click: Insert in `clicks` und Increment von `links.click_count`
 * in EINER Transaktion. Damit können Zähler und Tabelle nicht auseinanderlaufen.
 *
 * Bots werden ignoriert, dann passiert gar nichts – weder Zeile noch Zähler.
 *
 * Fire-and-forget: Fehler werden geloggt, aber nicht geworfen. Der Aufrufer
 * soll das Promise nicht awaiten, damit Redirects nicht durch DB-Latenz
 * verzögert werden.
 */
export async function trackClick(opts: TrackClickOptions): Promise<void> {
  const { linkId, userAgent, referrer } = opts

  // Bots überspringen
  if (isBot(userAgent)) return

  // ─── User-Agent parsen ───────────────────────────────────────────
  // Ein kaputter UA darf das Tracking nicht verhindern, die Felder bleiben
  // dann einfach leer.
  let browser: string | null = null
  let os:      string | null = null
  let device:  DeviceType    = 'desktop'

  if (userAgent) {
    try {
      const result = new UAParser(userAgent).getResult()
      browser = result.browser.name ?? null
      os      = result.os.name      ?? null
      device  = mapDeviceType(result.device.type)
    } catch {
      // Stiller Fehlschlag – wir tracken trotzdem
    }
  }

  const cleanRef = sanitizeReferrer(referrer)

  // ─── Transaktion: Insert Click + Update Zähler ───────────────────
  let conn
  try {
    conn = await getPool().getConnection()
  } catch (err) {
    console.error('[trackClick] Keine DB-Verbindung:', err)
    return
  }

  try {
    await conn.beginTransaction()

    await conn.execute(
      // Bewusst ohne IP-Merkmal: die fruehere Spalte `ip_hash` wurde nie
      // gelesen, war wegen des festen Peppers aber pseudonym. Siehe
      // migrations/004_drop_click_ip_hash.sql.
      `INSERT INTO clicks
         (link_id, referrer, browser, os, device_type)
       VALUES (?, ?, ?, ?, ?)`,
      [linkId, cleanRef, browser, os, device]
    )

    await conn.execute(
      'UPDATE links SET click_count = click_count + 1 WHERE id = ?',
      [linkId]
    )

    await conn.commit()
  } catch (err) {
    console.error('[trackClick] Fehler beim Tracking:', err)
    // Bewusst kein Re-throw – Tracking darf den Redirect nicht stören
    try {
      await conn.rollback()
    } catch (rollbackErr) {
      console.error('[trackClick] Rollback fehlgeschlagen:', rollbackErr)
    }
  } finally {
    conn.release()
  }
}

/**
 * Mappt ua-parser-js Device-Types auf unsere DeviceType-Werte.
 * ua-parser-js v2 kennt zusätzlich 'xr' (VR/AR-Headsets), das zählt als mobile.
 */
function mapDeviceType(type: string | undefined): DeviceType {
  if (type === 'mobile') return 'mobile'
  if (type === 'tablet') return 'tablet'
  if (type === 'xr')     return 'mobile'
  return 'desktop'
}

/**
 * Bereinigt Referrer-URLs:
 * - Nur Origin + Pfad behalten, Query-Strings können Tokens enthalten
 * - Auf 500 Zeichen kürzen (Spaltenbreite)
 * - Nicht parsbare Werte verwerfen, statt sie roh zu übernehmen
 */
function sanitizeReferrer(referrer: string | null): string | null {
  if (!referrer) return null
  try {
    const url = new URL(referrer)
    return `${url.origin}${url.pathname}`.slice(0, 500)
  } catch {
    return null
  }
}
