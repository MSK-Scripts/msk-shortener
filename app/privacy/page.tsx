import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/Header'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const t = await getTranslations('privacy')
  return {
    title:       t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function PrivacyPage() {
  const t = await getTranslations('privacy')

  return (
    <div className="min-h-screen flex flex-col">
      <Header backLink={{ href: '/' }} />

      <main className="flex-1 px-6 py-10">
        <article className="max-w-3xl mx-auto space-y-8">

          {/* Title */}
          <header className="space-y-2 animate-fade-in">
            <h1 className="font-heading text-4xl md:text-5xl text-msk-text">
              {t('title')}
            </h1>
            <p className="text-sm text-msk-muted">{t('lastUpdated')}</p>
          </header>

          {/* Intro */}
          <p className="text-msk-muted leading-relaxed">{t('intro')}</p>

          {/* Section 1: Verantwortlicher */}
          <Section title={t('section1Title')}>
            <p>{t('section1Text')}</p>
            <div className="bg-msk-surface/50 border border-msk-border rounded-lg p-4 mt-3 not-italic">
              <p className="font-medium text-msk-text">{t('section1Name')}</p>
              <p className="whitespace-pre-line text-msk-muted text-sm mt-1">
                {t('section1Address')}
              </p>
              <p className="text-msk-muted text-sm mt-2">{t('section1Email')}</p>
            </div>
          </Section>

          {/* Section 2: Welche Daten */}
          <Section title={t('section2Title')}>
            <p>{t('section2Intro')}</p>
            <SubSection title={t('section2aTitle')} text={t('section2aText')} />
            <SubSection title={t('section2bTitle')} text={t('section2bText')} />
            <SubSection title={t('section2cTitle')} text={t('section2cText')} />
            <SubSection title={t('section2dTitle')} text={t('section2dText')} />
          </Section>

          {/* Section 3: Cookies */}
          <Section title={t('section3Title')}>
            <p>{t('section3Text')}</p>
            <div className="bg-msk-surface/50 border border-msk-border rounded-lg p-4 mt-3 space-y-1.5 text-sm">
              <p className="font-mono text-msk-accent">{t('section3CookieName')}</p>
              <p className="text-msk-muted">{t('section3CookiePurpose')}</p>
              <p className="text-msk-muted">{t('section3CookieDuration')}</p>
              <p className="text-msk-muted">{t('section3CookieLegal')}</p>
            </div>
            <p className="text-sm italic text-msk-muted mt-3">
              {t('section3NoTracking')}
            </p>
          </Section>

          {/* Section 4: Rechtsgrundlage */}
          <Section title={t('section4Title')}>
            <p>{t('section4Text')}</p>
          </Section>

          {/* Section 5: Speicherdauer */}
          <Section title={t('section5Title')}>
            <ul className="space-y-2 list-disc list-inside marker:text-msk-accent">
              <li>{t('section5Links')}</li>
              <li>{t('section5Clicks')}</li>
              <li>{t('section5Logs')}</li>
            </ul>
          </Section>

          {/* Section 6: Empfänger */}
          <Section title={t('section6Title')}>
            <p>{t('section6Intro')}</p>
            <div className="bg-msk-surface/50 border border-msk-border rounded-lg p-4 mt-3">
              <p className="font-medium text-msk-text mb-1">{t('section6HostingTitle')}</p>
              <p className="text-sm text-msk-muted">{t('section6HostingText')}</p>
            </div>
          </Section>

          {/* Section 7: Deine Rechte */}
          <Section title={t('section7Title')}>
            <p>{t('section7Intro')}</p>
            <ul className="mt-3 space-y-2 list-disc list-inside marker:text-msk-accent">
              <li>{t('section7RightAccess')}</li>
              <li>{t('section7RightRectification')}</li>
              <li>{t('section7RightErasure')}</li>
              <li>{t('section7RightRestriction')}</li>
              <li>{t('section7RightPortability')}</li>
              <li>{t('section7RightObjection')}</li>
              <li>{t('section7RightComplaint')}</li>
            </ul>
            <p className="text-sm text-msk-muted mt-3">{t('section7Contact')}</p>
          </Section>

          {/* Section 8: Aufsichtsbehörde */}
          <Section title={t('section8Title')}>
            <p>{t('section8Text')}</p>
            <div className="bg-msk-surface/50 border border-msk-border rounded-lg p-4 mt-3 text-sm">
              <p className="font-medium text-msk-text">{t('section8AuthorityName')}</p>
              <p className="whitespace-pre-line text-msk-muted mt-1">
                {t('section8AuthorityAddress')}
              </p>
              <a
                href={t('section8AuthorityWebsite')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-msk-accent hover:underline mt-2 inline-block break-all"
              >
                {t('section8AuthorityWebsite')}
              </a>
            </div>
          </Section>

          {/* Section 9: Sicherheit */}
          <Section title={t('section9Title')}>
            <p>{t('section9Text')}</p>
          </Section>

          {/* Section 10: Änderungen */}
          <Section title={t('section10Title')}>
            <p>{t('section10Text')}</p>
          </Section>

          {/* Section 11: Datenschutzbeauftragter */}
          <Section title={t('section11Title')}>
            <p>{t('section11Text')}</p>
          </Section>

          {/* Section 12: Keine automatisierte Entscheidung */}
          <Section title={t('section12Title')}>
            <p>{t('section12Text')}</p>
          </Section>

          {/* Section 13: Lokale Webfonts */}
          <Section title={t('section13Title')}>
            <p>{t('section13Text')}</p>
          </Section>

        </article>
      </main>
    </div>
  )
}

// ─── Hilfs-Komponenten ────────────────────────────────────────────────

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
