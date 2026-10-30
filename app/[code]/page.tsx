import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { getLinkByCode, isLinkExpired } from '@/lib/links'
import { trackClick } from '@/lib/clicks'
import { isBot } from '@/lib/botDetection'
import { PageHead } from '@/components/site/PageHead'
import { SiteFrame } from '@/components/site/SiteFrame'
import { Button } from '@/components/ui/Button'

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
      <SiteFrame>
        <PageHead title={t('title')} lead={t('subtitle')} />
        <div className="tool-column py-[var(--space-section)]">
          <Button asChild>
            <Link href="/">{t('createNew')}</Link>
          </Button>
        </div>
      </SiteFrame>
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
