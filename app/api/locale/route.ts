import { NextRequest, NextResponse } from 'next/server'
import { isLocale, LOCALE_COOKIE } from '@/i18n/config'

/**
 * POST /api/locale
 * Body: { locale: 'de' | 'en' }
 * Setzt das Sprach-Cookie für 1 Jahr.
 */
export async function POST(request: NextRequest) {
  try {
    const { locale } = await request.json()

    if (!isLocale(locale)) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
    }

    const response = NextResponse.json({ ok: true, locale })
    response.cookies.set(LOCALE_COOKIE, locale, {
      maxAge:   60 * 60 * 24 * 365, // 1 Jahr
      path:     '/',
      sameSite: 'lax',
      httpOnly: false, // Client-side lesbar
      secure:   process.env.NODE_ENV === 'production',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
