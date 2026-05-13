import { queryOne, queryMany } from './db'
import type { AggregateEntry } from '@/types'

/**
 * Aggregierte Statistiken über ALLE Links – komplett anonym.
 * Keine Short-Codes, keine URLs, keine IPs.
 */
export interface GlobalStats {
  totalLinks:        number
  totalClicks:       number
  linksToday:        number
  clicksToday:       number
  clicksLast7Days:   number
  topBrowsers:       AggregateEntry[]
  topOperatingSystems: AggregateEntry[]
}

export async function getGlobalStats(): Promise<GlobalStats> {
  // Alle Aggregationen parallel für Performance
  const [
    totalLinks,
    totalClicks,
    linksToday,
    clicksToday,
    clicksLast7Days,
    topBrowsers,
    topOperatingSystems,
  ] = await Promise.all([
    countTotalLinks(),
    countTotalClicks(),
    countLinksToday(),
    countClicksToday(),
    countClicksLast7Days(),
    aggregateBrowsersGlobal(),
    aggregateOsGlobal(),
  ])

  return {
    totalLinks,
    totalClicks,
    linksToday,
    clicksToday,
    clicksLast7Days,
    topBrowsers,
    topOperatingSystems,
  }
}

// ─── Counts ───────────────────────────────────────────────────────────

async function countTotalLinks(): Promise<number> {
  const row = await queryOne<{ count: number }>(
    'SELECT COUNT(*) AS count FROM links'
  )
  return Number(row?.count ?? 0)
}

async function countTotalClicks(): Promise<number> {
  const row = await queryOne<{ count: number }>(
    'SELECT COALESCE(SUM(click_count), 0) AS count FROM links'
  )
  return Number(row?.count ?? 0)
}

async function countLinksToday(): Promise<number> {
  const row = await queryOne<{ count: number }>(
    `SELECT COUNT(*) AS count FROM links
     WHERE created_at >= CURDATE()`
  )
  return Number(row?.count ?? 0)
}

async function countClicksToday(): Promise<number> {
  const row = await queryOne<{ count: number }>(
    `SELECT COUNT(*) AS count FROM clicks
     WHERE clicked_at >= CURDATE()`
  )
  return Number(row?.count ?? 0)
}

async function countClicksLast7Days(): Promise<number> {
  const row = await queryOne<{ count: number }>(
    `SELECT COUNT(*) AS count FROM clicks
     WHERE clicked_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
  )
  return Number(row?.count ?? 0)
}

// ─── Top-Aggregations (anonymisiert) ──────────────────────────────────

async function aggregateBrowsersGlobal(limit = 5): Promise<AggregateEntry[]> {
  const rows = await queryMany<{ name: string | null; count: number }>(
    `SELECT browser AS name, COUNT(*) AS count
     FROM clicks
     WHERE browser IS NOT NULL
     GROUP BY browser
     ORDER BY count DESC
     LIMIT ?`,
    [limit]
  )

  return rows.map((r) => ({
    name:  r.name ?? 'Unbekannt',
    count: Number(r.count),
  }))
}

async function aggregateOsGlobal(limit = 5): Promise<AggregateEntry[]> {
  const rows = await queryMany<{ name: string | null; count: number }>(
    `SELECT os AS name, COUNT(*) AS count
     FROM clicks
     WHERE os IS NOT NULL
     GROUP BY os
     ORDER BY count DESC
     LIMIT ?`,
    [limit]
  )

  return rows.map((r) => ({
    name:  r.name ?? 'Unbekannt',
    count: Number(r.count),
  }))
}
