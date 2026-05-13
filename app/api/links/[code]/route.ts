import { NextRequest, NextResponse } from 'next/server'
import { getLinkByCode, deleteLinkByToken, isLinkExpired } from '@/lib/links'
import type { LinkInfoResponse, ApiError } from '@/types'

interface RouteContext {
  params: Promise<{ code: string }>
}

// ─── GET /api/links/[code] – Link-Info abrufen ───────────────────────
export async function GET(_request: NextRequest, ctx: RouteContext) {
  const { code } = await ctx.params

  const link = await getLinkByCode(code)
  if (!link) {
    return NextResponse.json<ApiError>(
      { error: 'Link nicht gefunden' },
      { status: 404 }
    )
  }

  const baseUrl     = process.env.NEXT_PUBLIC_BASE_URL ?? ''
  const hasPassword = link.password_hash !== null

  const response: LinkInfoResponse = {
    shortCode:   link.short_code,
    shortUrl:    `${baseUrl}/${link.short_code}`,
    hasPassword,
    expiresAt:   link.expires_at ? new Date(link.expires_at).toISOString() : null,
    clickCount:  link.click_count,
    createdAt:   new Date(link.created_at).toISOString(),
    // URL nur preisgeben, wenn kein Passwort gesetzt UND nicht abgelaufen
    ...(!hasPassword && !isLinkExpired(link) && { originalUrl: link.original_url }),
  }

  return NextResponse.json(response)
}

// ─── DELETE /api/links/[code] – Link löschen ─────────────────────────
// Erwartet Authorization-Header: "Bearer <delete_token>"
export async function DELETE(request: NextRequest, ctx: RouteContext) {
  const { code } = await ctx.params

  // ─── Auth-Header parsen ──────────────────────────────────────────
  const auth = request.headers.get('authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json<ApiError>(
      { error: 'Delete-Token erforderlich (Header: Authorization: Bearer <token>)' },
      { status: 401 }
    )
  }

  const token = auth.slice('Bearer '.length).trim()
  if (token.length !== 48) {
    return NextResponse.json<ApiError>(
      { error: 'Ungültiges Delete-Token Format' },
      { status: 400 }
    )
  }

  // ─── Löschen ─────────────────────────────────────────────────────
  const success = await deleteLinkByToken(code, token)
  if (!success) {
    return NextResponse.json<ApiError>(
      { error: 'Link nicht gefunden oder Token ungültig' },
      { status: 404 }
    )
  }

  return NextResponse.json({ message: 'Link erfolgreich gelöscht' })
}
