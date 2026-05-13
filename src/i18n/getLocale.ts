import { cookies, headers } from 'next/headers'
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from './config'

/**
 * Ermittelt das aktuelle Locale aus (in dieser Reihenfolge):
 *   1. Cookie `NEXT_LOCALE`
 *   2. Accept-Language Header (Browser-Sprache)
 *   3. DEFAULT_LOCALE (Fallback)
 */
export async function getCurrentLocale(): Promise<Locale> {
  // 1. Cookie
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value
  if (isLocale(cookieLocale)) return cookieLocale

  // 2. Browser-Sprache
  const headerStore = await headers()
  const acceptLang = headerStore.get('accept-language')
  if (acceptLang) {
    // Format: "de-DE,de;q=0.9,en;q=0.8" → ersten Sprachcode extrahieren
    const primary = acceptLang
      .split(',')[0]            // "de-DE"
      ?.split(';')[0]           // "de-DE"
      ?.split('-')[0]           // "de"
      ?.toLowerCase()

    if (isLocale(primary)) return primary
  }

  // 3. Default
  return DEFAULT_LOCALE
}
