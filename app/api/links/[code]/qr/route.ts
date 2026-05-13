import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { getLinkByCode } from '@/lib/links'
import type { ApiError } from '@/types'

interface RouteContext {
  params: Promise<{ code: string }>
}

// ─── QR-Optionen (MSK-Branding) ──────────────────────────────────────
const QR_OPTIONS = {
  errorCorrectionLevel: 'M' as const,
  margin:               2,
  width:                512,
  color: {
    dark:  '#1b1b1d',   // MSK-Hintergrund als "Pixel"
    light: '#ffffff',   // Weiß
  },
}

// ─── GET /api/links/[code]/qr?format=png|svg ─────────────────────────
export async function GET(request: NextRequest, ctx: RouteContext) {
  const { code } = await ctx.params

  // ─── Format-Parameter ──────────────────────────────────────────
  const format = request.nextUrl.searchParams.get('format') ?? 'png'
  if (format !== 'png' && format !== 'svg') {
    return NextResponse.json<ApiError>(
      { error: 'Format muss "png" oder "svg" sein' },
      { status: 400 }
    )
  }

  // ─── Link laden ────────────────────────────────────────────────
  const link = await getLinkByCode(code)
  if (!link) {
    return NextResponse.json<ApiError>(
      { error: 'Link nicht gefunden' },
      { status: 404 }
    )
  }

  // ─── Volle Kurz-URL für den QR-Code zusammenbauen ──────────────
  const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin
  const shortUrl = `${baseUrl}/${link.short_code}`

  // ─── QR generieren ─────────────────────────────────────────────
  try {
    if (format === 'svg') {
      const svg = await QRCode.toString(shortUrl, {
        ...QR_OPTIONS,
        type: 'svg',
      })

      return new NextResponse(svg, {
        status: 200,
        headers: {
          'Content-Type':        'image/svg+xml',
          'Content-Disposition': `inline; filename="msk-${code}.svg"`,
          'Cache-Control':       'public, max-age=86400',
        },
      })
    }

    // PNG (Default)
    const buffer = await QRCode.toBuffer(shortUrl, {
      ...QR_OPTIONS,
      type: 'png',
    })

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type':        'image/png',
        'Content-Disposition': `inline; filename="msk-${code}.png"`,
        'Cache-Control':       'public, max-age=86400',
        'Content-Length':      String(buffer.length),
      },
    })
  } catch (err) {
    console.error('[QR Generator] Fehler:', err)
    return NextResponse.json<ApiError>(
      { error: 'QR-Code konnte nicht generiert werden' },
      { status: 500 }
    )
  }
}
