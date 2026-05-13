import { getRequestConfig } from 'next-intl/server'
import { getCurrentLocale } from './getLocale'

/**
 * Wird von next-intl bei JEDER Server-Request aufgerufen.
 * Liefert das aktuelle Locale + die zugehörigen Übersetzungen.
 */
export default getRequestConfig(async () => {
  const locale = await getCurrentLocale()

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'Europe/Berlin',
  }
})
