import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { CreateLinkForm }   from '@/components/CreateLinkForm'
import { DeleteLinkButton } from '@/components/DeleteLinkButton'
import { Header }           from '@/components/Header'

export default async function HomePage() {
  const t = await getTranslations('home')
  const f = await getTranslations('footer')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* ─── Main ──────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">

          {/* Hero */}
          <div className="text-center mb-10 space-y-3 animate-fade-in">
            <h1 className="font-heading text-4xl md:text-5xl text-msk-text leading-tight">
              {t('titleLine1')}<br />
              <span className="text-msk-accent">{t('titleLine2')}</span>
            </h1>
            <p className="text-msk-muted max-w-md mx-auto">
              {t('subtitle')}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-msk-surface/50 border border-msk-border rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
            <CreateLinkForm />
          </div>

          {/* Sekundäre Aktionen */}
          <div className="mt-4 flex items-center justify-center gap-6">
            <DeleteLinkButton />
            <Link
              href="/stats"
              className="text-xs text-msk-muted hover:text-msk-accent transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t('globalStats')}
            </Link>
          </div>

          {/* Feature-Strip */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs text-msk-muted">
            <Feature icon="🔗" text={t('features.customCodes')} />
            <Feature icon="📊" text={t('features.statistics')} />
            <Feature icon="📱" text={t('features.qrCodes')} />
            <Feature icon="🔒" text={t('features.openSource')} />
          </div>
        </div>
      </main>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer className="px-6 py-6 border-t border-msk-border/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-msk-muted">
          <p>
            © {new Date().getFullYear()}{' '}
            <a
              href="https://www.msk-scripts.de"
              className="hover:text-msk-accent transition-colors"
              target="_blank" rel="noopener noreferrer"
            >
              MSK Scripts
            </a>
            {' · '}{f('openSource')}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/imprint" className="hover:text-msk-text transition-colors">{f('imprint')}</Link>
            <Link href="/privacy" className="hover:text-msk-text transition-colors">{f('privacy')}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-msk-surface/50 transition-colors">
      <span className="text-xl" aria-hidden="true">{icon}</span>
      <span>{text}</span>
    </div>
  )
}
