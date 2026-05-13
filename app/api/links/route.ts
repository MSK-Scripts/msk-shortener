import { NextRequest, NextResponse } from 'next/server'
import { createLinkSchema } from '@/lib/validation'
import { createLink, LinkServiceError } from '@/lib/links'
import { getClientIp, hashIp, checkCreateRateLimit } from '@/lib/rateLimit'
import type { CreateLinkResponse, ApiError } from '@/types'

// ─── POST /api/links – Link erstellen ────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers)
    const ipHash   = hashIp(clientIp)

    // ─── Rate-Limit prüfen ──────────────────────────────────────────
    const rateLimit = checkCreateRateLimit(ipHash)
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
      return NextResponse.json<ApiError>(
        {
          error: 'Zu viele Anfragen. Bitte später erneut versuchen.',
        },
        {
          status: 429,
          headers: {
            'Retry-After':           String(retryAfter),
            'X-RateLimit-Limit':     String(process.env.RATE_LIMIT_CREATE_PER_HOUR ?? 20),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset':     String(Math.floor(rateLimit.resetAt / 1000)),
          },
        }
      )
    }

    // ─── Body parsen ─────────────────────────────────────────────────
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json<ApiError>(
        { error: 'Ungültiges JSON' },
        { status: 400 }
      )
    }

    // ─── Validieren ──────────────────────────────────────────────────
    const parsed = createLinkSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json<ApiError>(
        {
          error:   'Validierung fehlgeschlagen',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { url, customCode, password, expiresAt } = parsed.data

    // ─── Link erstellen ──────────────────────────────────────────────
    const { link, deleteToken } = await createLink({
      url,
      customCode,
      password,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      clientIp,
    })

    // ─── Response zusammenbauen ──────────────────────────────────────
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `${request.nextUrl.origin}`

    const response: CreateLinkResponse = {
      shortCode:   link.short_code,
      shortUrl:    `${baseUrl}/${link.short_code}`,
      deleteToken,
      expiresAt:   link.expires_at ? new Date(link.expires_at).toISOString() : null,
      hasPassword: link.password_hash !== null,
    }

    return NextResponse.json(response, {
      status: 201,
      headers: {
        'X-RateLimit-Limit':     String(process.env.RATE_LIMIT_CREATE_PER_HOUR ?? 20),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset':     String(Math.floor(rateLimit.resetAt / 1000)),
      },
    })

  } catch (err) {
    if (err instanceof LinkServiceError) {
      return NextResponse.json<ApiError>(
        { error: err.message },
        { status: err.status }
      )
    }

    console.error('[POST /api/links] Unerwarteter Fehler:', err)
    return NextResponse.json<ApiError>(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
