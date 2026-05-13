import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  const t = await getTranslations('notFound')

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
        <div className="space-y-2">
          <p className="font-heading text-7xl text-msk-accent tracking-tight">404</p>
          <h1 className="font-heading text-3xl text-msk-text">{t('title')}</h1>
          <p className="text-msk-muted">{t('subtitle')}</p>
        </div>

        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-msk-accent hover:bg-msk-hover text-white rounded-lg font-medium transition-colors"
        >
          {t('backToHome')}
        </Link>
      </div>
    </main>
  )
}
