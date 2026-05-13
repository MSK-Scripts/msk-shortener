import { NextResponse } from 'next/server'
import { getGlobalStats } from '@/lib/globalStats'
import type { ApiError } from '@/types'

// ─── GET /api/stats – Globale Statistiken (öffentlich, anonym) ───────
export async function GET() {
  try {
    const stats = await getGlobalStats()

    return NextResponse.json(stats, {
      headers: {
        // 5 Minuten cachen – Stats müssen nicht in Echtzeit sein
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    })
  } catch (err) {
    console.error('[GET /api/stats] Fehler:', err)
    return NextResponse.json<ApiError>(
      { error: 'Statistiken konnten nicht geladen werden' },
      { status: 500 }
    )
  }
}
