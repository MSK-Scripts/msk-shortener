import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/Header'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const t = await getTranslations('imprintPage')
  return { title: t('title') }
}

export default async function ImprintPage() {
  const t = await getTranslations('imprintPage')

  return (
    <div className="min-h-screen flex flex-col">
      <Header backLink={{ href: '/' }} />

      <main className="flex-1 px-6 py-10">
        <article className="max-w-3xl mx-auto space-y-8">

          <header className="space-y-2 animate-fade-in">
            <h1 className="font-heading text-4xl md:text-5xl text-msk-text">
              {t('title')}
            </h1>
          </header>

          <Section title={t('section1Title')}>
            <div className="bg-msk-surface/50 border border-msk-border rounded-lg p-4 not-italic">
              <p className="font-medium text-msk-text">{t('addressName')}</p>
              <p className="whitespace-pre-line text-msk-muted text-sm mt-1">
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
            <div className="bg-msk-surface/50 border border-msk-border rounded-lg p-4 not-italic">
              <p className="font-medium text-msk-text">{t('addressName')}</p>
              <p className="whitespace-pre-line text-msk-muted text-sm mt-1">
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
      </main>
    </div>
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
      <h2 className="font-heading text-2xl text-msk-text">{title}</h2>
      <div className="text-msk-muted leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  )
}

function SubSection({ title, text }: { title: string; text: string }) {
  return (
    <div className="pl-4 border-l-2 border-msk-border space-y-1.5 mt-4">
      <h3 className="text-base font-medium text-msk-text">{title}</h3>
      <p className="text-sm">{text}</p>
    </div>
  )
}
