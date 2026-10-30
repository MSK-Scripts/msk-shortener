import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { PasswordPrompt } from '@/components/PasswordPrompt'
import { PageHead } from '@/components/site/PageHead'
import { SiteFrame } from '@/components/site/SiteFrame'
import { getLinkByCode, isLinkExpired } from '@/lib/links'

interface PageProps {
  params: Promise<{ code: string }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PasswordPage({ params }: PageProps) {
  const { code } = await params

  const link = await getLinkByCode(code)
  if (!link)              notFound()
  if (isLinkExpired(link)) redirect(`/${code}`)
  if (!link.password_hash) redirect(`/${code}`)

  const t = await getTranslations('password')

  return (
    <SiteFrame>
      <PageHead
        kicker={<span className="font-mono normal-case tracking-normal" translate="no">/{code}</span>}
        title={t('pageTitle')}
        lead={<span className="whitespace-pre-line">{t('pageSubtitle')}</span>}
      />
      <div className="tool-column py-[var(--space-section)]">
        <div className="max-w-[32rem] rounded-lg border border-border bg-card p-[clamp(1.25rem,0.75rem+1.5vw,2.5rem)] shadow-[var(--shadow-card)]">
          <PasswordPrompt shortCode={code} />
        </div>
      </div>
    </SiteFrame>
  )
}
