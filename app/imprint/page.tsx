import { getTranslations } from 'next-intl/server'
import { PageHead } from '@/components/site/PageHead'
import { SiteFrame } from '@/components/site/SiteFrame'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const t = await getTranslations('imprintPage')
  return { title: t('title') }
}

export default async function ImprintPage() {
  const t = await getTranslations('imprintPage')

  return (
    <SiteFrame>
      <PageHead title={t('title')} />
      <div className="tool-column py-[var(--space-section)]">
        <article className="grid max-w-[65ch] gap-8">

          <Section title={t('section1Title')}>
            <div className="bg-card border border-border rounded-lg p-4 not-italic">
              <p className="font-medium text-foreground">{t('addressName')}</p>
              <p className="whitespace-pre-line text-muted-foreground text-small mt-1">
                {t('addressLines')}
              </p>
            </div>
          </Section>

          <Section title={t('contactTitle')}>
            <p>{t('contactEmail')}</p>
          </Section>

          <Section title={t('noAdsTitle')}>
            <p>{t('noAdsText')}</p>
          </Section>

          <Section title={t('responsibleTitle')}>
            <div className="bg-card border border-border rounded-lg p-4 not-italic">
              <p className="font-medium text-foreground">{t('addressName')}</p>
              <p className="whitespace-pre-line text-muted-foreground text-small mt-1">
                {t('addressLines')}
              </p>
            </div>
          </Section>

          <Section title={t('disputeTitle')}>
            <p>{t('disputeText')}</p>
          </Section>

          <Section title={t('liabilityTitle')}>
            <SubSection
              title={t('liabilityContentTitle')}
              text={t('liabilityContentText')}
            />
            <SubSection
              title={t('liabilityLinksTitle')}
              text={t('liabilityLinksText')}
            />
          </Section>

        </article>
      </div>
    </SiteFrame>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-h3 font-[650] text-foreground">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  )
}

function SubSection({ title, text }: { title: string; text: string }) {
  return (
    <div className="pl-4 border-l-2 border-border space-y-1.5 mt-4">
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      <p className="text-small">{text}</p>
    </div>
  )
}
