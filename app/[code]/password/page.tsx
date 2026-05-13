import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getLinkByCode, isLinkExpired } from '@/lib/links'
import { PasswordPrompt } from '@/components/PasswordPrompt'
import { Logo } from '@/components/Logo'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

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
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between">
        <a href="/" className="inline-flex items-center gap-3">
          <Logo size={28} />
          <span className="font-heading text-lg text-msk-text">
            MSK <span className="text-msk-accent">Shortener</span>
          </span>
        </a>
        <LanguageSwitcher />
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          {/* Hero */}
          <div className="text-center mb-8 space-y-3 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-msk-accent/10 mb-2">
              <svg className="w-8 h-8 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-heading text-3xl text-msk-text">{t('pageTitle')}</h1>
            <p className="text-msk-muted text-sm whitespace-pre-line">
              {t('pageSubtitle')}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-msk-surface/50 border border-msk-border rounded-2xl p-6 md:p-8 shadow-2xl">
            <PasswordPrompt shortCode={code} />
          </div>

          <p className="text-center text-xs text-msk-dim mt-6 font-mono">
            /{code}
          </p>
        </div>
      </div>
    </main>
  )
}
