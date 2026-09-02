import { redirect, notFound } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getLinkByCode, isLinkExpired } from '@/lib/links'
import { trackClick } from '@/lib/clicks'
import { isBot } from '@/lib/botDetection'

interface PageProps {
  params: Promise<{ code: string }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RedirectPage({ params }: PageProps) {
  const { code } = await params

  const link = await getLinkByCode(code)
  if (!link) notFound()

  if (isLinkExpired(link)) {
    const t = await getTranslations('expired')
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-msk-danger/10 mb-2">
            <svg className="w-8 h-8 text-msk-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl text-msk-text">{t('title')}</h1>
          <p className="text-msk-muted">{t('subtitle')}</p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-2.5 bg-msk-accent hover:bg-msk-hover text-white rounded-lg font-medium transition-colors"
          >
            {t('createNew')}
          </Link>
        </div>
      </main>
    )
  }

  if (link.password_hash) {
    redirect(`/${code}/password`)
  }

  const headersList = await headers()
  const userAgent   = headersList.get('user-agent')
  const referrer    = headersList.get('referer')

  // trackClick schreibt Zeile und Zähler in einer Transaktion und filtert Bots
  // selbst. Bewusst ohne await, damit die Weiterleitung nicht auf die DB wartet.
  if (!isBot(userAgent)) {
    trackClick({
      linkId:    link.id,
      userAgent,
      referrer,
    }).catch(() => { /* bereits intern geloggt */ })
  }

  redirect(link.original_url)
}
