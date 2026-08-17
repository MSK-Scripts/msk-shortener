import { NextRequest, NextResponse } from 'next/server'
import { verifyPasswordSchema } from '@/lib/validation'
import { verifyLinkPassword } from '@/lib/links'
import { trackClick } from '@/lib/clicks'
import { getClientIp, hashIp, checkRateLimit } from '@/lib/rateLimit'
import type { ApiError } from '@/types'

// ─── POST /api/verify – Passwort prüfen & URL zurückgeben ────────────
export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers)
    const ipHash   = hashIp(clientIp)

    // ─── Rate-Limit (Brute-Force-Schutz) ───────────────────────────
    // Max. 10 Versuche pro 5 Minuten pro IP
    const rl = checkRateLimit(`verify:${ipHash}`, 10, 5 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json<ApiError>(
        { error: 'Zu viele Versuche. Bitte 5 Minuten warten.' },
        { status: 429 }
      )
    }

    // ─── Body parsen ───────────────────────────────────────────────
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json<ApiError>(
        { error: 'Ungültiges JSON' },
        { status: 400 }
      )
    }

    const parsed = verifyPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json<ApiError>(
        {
          error:   'Validierung fehlgeschlagen',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { shortCode, password } = parsed.data

    // ─── Passwort verifizieren ─────────────────────────────────────
    const link = await verifyLinkPassword(shortCode, password)

    if (!link) {
      // Bewusst generische Fehlermeldung (kein Info-Leak)
      return NextResponse.json<ApiError>(
        { error: 'Falsches Passwort oder Link nicht verfügbar' },
        { status: 401 }
      )
    }

    // ─── Click tracken (fire-and-forget) ───────────────────────────
    // Zeile und Zähler schreibt trackClick in einer Transaktion.
    trackClick({
      linkId:    link.id,
      userAgent: request.headers.get('user-agent'),
      referrer:  request.headers.get('referer'),
      clientIp,
    }).catch(() => { /* bereits intern geloggt */ })

    // ─── Original-URL zurückgeben ──────────────────────────────────
    return NextResponse.json({ originalUrl: link.original_url })

  } catch (err) {
    console.error('[POST /api/verify] Unerwarteter Fehler:', err)
    return NextResponse.json<ApiError>(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
