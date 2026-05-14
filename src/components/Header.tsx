import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Logo } from './Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileNav } from './MobileNav'

interface HeaderProps {
  /** Wenn true: nur Logo + Sprach-Switcher, ohne Navi-Links */
  minimal?: boolean
  /** Wenn gesetzt: zeigt einen „Zurück"-Link statt der Navi */
  backLink?: { href: string }
}

export async function Header({ minimal = false, backLink }: HeaderProps) {
  const t = await getTranslations('header')
  const c = await getTranslations('common')

  const showNav = !minimal && !backLink
  const navLinks = [
    { label: t('stats'), href: '/stats' },
    { label: t('docs'), href: 'https://docu.msk-scripts.de', external: true },
    { label: t('github'), href: 'https://github.com/msk-scripts/msk-shortener', external: true },
  ]

  return (
    <header className="px-4 sm:px-6 py-5 border-b border-msk-border/50">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Logo size={32} />
          <span className="font-heading text-lg sm:text-xl text-msk-text whitespace-nowrap">
            MSK <span className="text-msk-accent">Shortener</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {showNav && (
            <nav className="hidden md:flex items-center gap-6 text-sm mr-2">
              <Link
                href="/stats"
                className="text-msk-muted hover:text-msk-text transition-colors"
              >
                {t('stats')}
              </Link>
              <a
                href="https://docu.msk-scripts.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-msk-muted hover:text-msk-text transition-colors"
              >
                {t('docs')}
              </a>
              <a
                href="https://github.com/msk-scripts/msk-shortener"
                target="_blank"
                rel="noopener noreferrer"
                className="text-msk-muted hover:text-msk-text transition-colors"
              >
                {t('github')}
              </a>
            </nav>
          )}

          {backLink && (
            <Link
              href={backLink.href}
              className="text-sm text-msk-muted hover:text-msk-accent transition-colors flex items-center gap-1.5 mr-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {c('back')}
            </Link>
          )}

          <LanguageSwitcher />

          {showNav && <MobileNav links={navLinks} menuLabel={t('menu')} />}
        </div>
      </div>
    </header>
  )
}
