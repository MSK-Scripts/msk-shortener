import { NextRequest, NextResponse } from 'next/server'
import { getLinkByCode } from '@/lib/links'
import {
  getTimeline,
  getBrowserStats,
  getOsStats,
  getDeviceStats,
  getTopReferrers,
} from '@/lib/stats'
import type { StatsResponse, ApiError } from '@/types'

interface RouteContext {
  params: Promise<{ code: string }>
}

// ─── GET /api/links/[code]/stats?days=30 ─────────────────────────────
export async function GET(request: NextRequest, ctx: RouteContext) {
  const { code } = await ctx.params

  // Days-Parameter (default: 30, max: 365)
  const daysParam = request.nextUrl.searchParams.get('days') ?? '30'
  let days = parseInt(daysParam, 10)
  if (isNaN(days) || days < 1) days = 30
  if (days > 365)              days = 365

  const link = await getLinkByCode(code)
  if (!link) {
    return NextResponse.json<ApiError>(
      { error: 'Link nicht gefunden' },
      { status: 404 }
    )
  }

  // Alle Aggregationen parallel laden
  const [timeline, browsers, operatingSystems, devices, topReferrers] = await Promise.all([
    getTimeline(link.id, days),
    getBrowserStats(link.id),
    getOsStats(link.id),
    getDeviceStats(link.id),
    getTopReferrers(link.id),
  ])

  const response: StatsResponse = {
    shortCode:    link.short_code,
    totalClicks:  link.click_count,
    createdAt:    new Date(link.created_at).toISOString(),
    expiresAt:    link.expires_at ? new Date(link.expires_at).toISOString() : null,
    timeline,
    browsers,
    operatingSystems,
    devices,
    topReferrers,
  }

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    },
  })
}
