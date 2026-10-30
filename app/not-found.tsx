import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { PageHead } from '@/components/site/PageHead'
import { SiteFrame } from '@/components/site/SiteFrame'
import { Button } from '@/components/ui/Button'

export default async function NotFound() {
  const t = await getTranslations('notFound')

  return (
    <SiteFrame>
      <PageHead kicker="404" title={t('title')} lead={t('subtitle')} />
      <div className="tool-column py-[var(--space-section)]">
        <Button asChild>
          <Link href="/">{t('backToHome')}</Link>
        </Button>
      </div>
    </SiteFrame>
  )
}
