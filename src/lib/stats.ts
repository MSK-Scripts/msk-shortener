import { queryMany } from './db'
import type { TimelinePoint, AggregateEntry } from '@/types'

// ─── Timeline ─────────────────────────────────────────────────────────

/**
 * Liefert Click-Counts pro Tag für die letzten N Tage.
 * Füllt fehlende Tage mit 0 auf.
 */
export async function getTimeline(
  linkId: number,
  days: number
): Promise<TimelinePoint[]> {
  const rows = await queryMany<{ date: string; clicks: number }>(
    `SELECT
       DATE(clicked_at) AS date,
       COUNT(*)         AS clicks
     FROM clicks
     WHERE link_id  = ?
       AND clicked_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
     GROUP BY DATE(clicked_at)
     ORDER BY date ASC`,
    [linkId, days]
  )

  // Map für schnellen Lookup
  const byDate = new Map(
    rows.map((r) => [formatDate(new Date(r.date)), Number(r.clicks)])
  )

  // Alle Tage im Zeitraum auffüllen
  const result: TimelinePoint[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = formatDate(d)
    result.push({
      date:   key,
      clicks: byDate.get(key) ?? 0,
    })
  }

  return result
}

// ─── Aggregationen ────────────────────────────────────────────────────

async function aggregate(
  linkId: number,
  column: 'browser' | 'os' | 'device_type',
  limit = 10
): Promise<AggregateEntry[]> {
  const rows = await queryMany<{ name: string | null; count: number }>(
    `SELECT
       ${column} AS name,
       COUNT(*) AS count
     FROM clicks
     WHERE link_id = ?
       AND ${column} IS NOT NULL
     GROUP BY ${column}
     ORDER BY count DESC
     LIMIT ?`,
    [linkId, limit]
  )

  return rows.map((r) => ({
    name:  r.name ?? 'Unbekannt',
    count: Number(r.count),
  }))
}

export const getBrowserStats = (linkId: number) => aggregate(linkId, 'browser')
export const getOsStats      = (linkId: number) => aggregate(linkId, 'os')
export const getDeviceStats  = (linkId: number) => aggregate(linkId, 'device_type')

// ─── Top-Referrer ─────────────────────────────────────────────────────

export async function getTopReferrers(
  linkId: number,
  limit = 10
): Promise<AggregateEntry[]> {
  const rows = await queryMany<{ referrer: string | null; count: number }>(
    `SELECT
       referrer,
       COUNT(*) AS count
     FROM clicks
     WHERE link_id = ?
     GROUP BY referrer
     ORDER BY count DESC
     LIMIT ?`,
    [linkId, limit]
  )

  return rows.map((r) => ({
    name:  extractDomain(r.referrer),
    count: Number(r.count),
  }))
}

// ─── Helper ───────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  // YYYY-MM-DD im lokalen Zeitzone-Kontext
  const y  = d.getFullYear()
  const m  = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function extractDomain(ref: string | null): string {
  if (!ref) return 'Direkt'
  try {
    return new URL(ref).hostname.replace(/^www\./, '')
  } catch {
    return ref.slice(0, 50)
  }
}
