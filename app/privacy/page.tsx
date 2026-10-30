import { getTranslations } from 'next-intl/server'
import { PageHead } from '@/components/site/PageHead'
import { SiteFrame } from '@/components/site/SiteFrame'

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
    <SiteFrame>
      <PageHead title={t('title')} lead={t('lastUpdated')} />
      <div className="tool-column py-[var(--space-section)]">
        <article className="grid max-w-[65ch] gap-8">

          {/* Intro */}
          <p className="text-muted-foreground leading-relaxed">{t('intro')}</p>

          {/* Section 1: Verantwortlicher */}
          <Section title={t('section1Title')}>
            <p>{t('section1Text')}</p>
            <div className="bg-card border border-border rounded-lg p-4 mt-3 not-italic">
              <p className="font-medium text-foreground">{t('section1Name')}</p>
              <p className="whitespace-pre-line text-muted-foreground text-small mt-1">
                {t('section1Address')}
              </p>
              <p className="text-muted-foreground text-small mt-2">{t('section1Email')}</p>
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
            <div className="bg-card border border-border rounded-lg p-4 mt-3 space-y-1.5 text-small">
              <p className="font-mono text-primary">{t('section3CookieName')}</p>
              <p className="text-muted-foreground">{t('section3CookiePurpose')}</p>
              <p className="text-muted-foreground">{t('section3CookieDuration')}</p>
              <p className="text-muted-foreground">{t('section3CookieLegal')}</p>
            </div>
            <p className="text-small italic text-muted-foreground mt-3">
              {t('section3NoTracking')}
            </p>
          </Section>

          {/* Section 4: Rechtsgrundlage */}
          <Section title={t('section4Title')}>
            <p>{t('section4Text')}</p>
          </Section>

          {/* Section 5: Speicherdauer */}
          <Section title={t('section5Title')}>
            <ul className="space-y-2 list-disc list-inside marker:text-primary">
              <li>{t('section5Links')}</li>
              <li>{t('section5Clicks')}</li>
              <li>{t('section5Logs')}</li>
            </ul>
          </Section>

          {/* Section 6: Empfänger */}
          <Section title={t('section6Title')}>
            <p>{t('section6Intro')}</p>
            <div className="bg-card border border-border rounded-lg p-4 mt-3">
              <p className="font-medium text-foreground mb-1">{t('section6HostingTitle')}</p>
              <p className="text-small text-muted-foreground">{t('section6HostingText')}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 mt-3">
              <p className="font-medium text-foreground mb-1">{t('section6TurnstileTitle')}</p>
              <p className="text-small text-muted-foreground">{t('section6TurnstileText')}</p>
            </div>
          </Section>

          {/* Section 7: Deine Rechte */}
          <Section title={t('section7Title')}>
            <p>{t('section7Intro')}</p>
            <ul className="mt-3 space-y-2 list-disc list-inside marker:text-primary">
              <li>{t('section7RightAccess')}</li>
              <li>{t('section7RightRectification')}</li>
              <li>{t('section7RightErasure')}</li>
              <li>{t('section7RightRestriction')}</li>
              <li>{t('section7RightPortability')}</li>
              <li>{t('section7RightObjection')}</li>
              <li>{t('section7RightComplaint')}</li>
            </ul>
            <p className="text-small text-muted-foreground mt-3">{t('section7Contact')}</p>
          </Section>

          {/* Section 8: Aufsichtsbehörde */}
          <Section title={t('section8Title')}>
            <p>{t('section8Text')}</p>
            <div className="bg-card border border-border rounded-lg p-4 mt-3 text-small">
              <p className="font-medium text-foreground">{t('section8AuthorityName')}</p>
              <p className="whitespace-pre-line text-muted-foreground mt-1">
                {t('section8AuthorityAddress')}
              </p>
              <a
                href={t('section8AuthorityWebsite')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline mt-2 inline-block break-all"
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
      </div>
    </SiteFrame>
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
