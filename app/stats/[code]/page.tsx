import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { getLinkByCode, isLinkExpired } from '@/lib/links'
import {
  getTimeline,
  getBrowserStats,
  getOsStats,
  getDeviceStats,
  getTopReferrers,
} from '@/lib/stats'
import { Header }          from '@/components/Header'
import { TimelineChart }   from '@/components/TimelineChart'
import { AggregateBars }   from '@/components/AggregateBars'
import { QRCodeDisplay }   from '@/components/QRCodeDisplay'

interface PageProps {
  params:        Promise<{ code: string }>
  searchParams?: Promise<{ days?: string }>
}

export const dynamic   = 'force-dynamic'
export const revalidate = 60

export default async function StatsPage({ params, searchParams }: PageProps) {
  const { code } = await params
  const search   = await searchParams
  const days     = parseDays(search?.days)

  const link = await getLinkByCode(code)
  if (!link) notFound()

  const t        = await getTranslations('stats')
  const c        = await getTranslations('common')
  const locale   = await getLocale()
  const dateFmt  = locale === 'de' ? 'de-DE' : 'en-GB'

  const [timeline, browsers, operatingSystems, devices, referrers] = await Promise.all([
    getTimeline(link.id, days),
    getBrowserStats(link.id),
    getOsStats(link.id),
    getDeviceStats(link.id),
    getTopReferrers(link.id),
  ])

  const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL ?? ''
  const shortUrl = `${baseUrl}/${link.short_code}`
  const expired  = isLinkExpired(link)

  return (
    <div className="min-h-screen flex flex-col">
      <Header backLink={{ href: '/' }} />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Title-Block */}
          <div className="space-y-2 animate-fade-in">
            <p className="text-xs uppercase tracking-wider text-msk-muted">{t('subtitle')}</p>
            <h1 className="font-heading text-3xl md:text-4xl text-msk-text break-all">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-msk-accent transition-colors"
              >
                {shortUrl}
              </a>
            </h1>
            {expired && (
              <p className="inline-flex items-center gap-1.5 text-sm text-msk-danger">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('linkExpired')}
              </p>
            )}
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label={t('kpi.totalClicks')} value={link.click_count.toLocaleString(dateFmt)} highlight />
            <KpiCard label={t('kpi.createdAt')}   value={formatDate(link.created_at, dateFmt)} />
            <KpiCard
              label={t('kpi.expiresAt')}
              value={link.expires_at ? formatDate(link.expires_at, dateFmt) : c('neverExpires')}
            />
            <KpiCard
              label={t('kpi.protection')}
              value={link.password_hash ? c('protectedLink') : c('publicLink')}
            />
          </div>

          {/* Timeline + QR */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-msk-surface/50 border border-msk-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h2 className="text-sm font-medium text-msk-text uppercase tracking-wider">
                    {t('timeline')}
                  </h2>
                </div>

                <div className="flex gap-1 text-xs">
                  {[7, 30, 90].map((d) => (
                    <Link
                      key={d}
                      href={`/stats/${code}?days=${d}`}
                      className={`px-3 py-1.5 rounded-md transition-colors ${
                        days === d
                          ? 'bg-msk-accent text-white'
                          : 'text-msk-muted hover:text-msk-text hover:bg-msk-surface'
                      }`}
                    >
                      {t('rangeDays', { days: d })}
                    </Link>
                  ))}
                </div>
              </div>
              <TimelineChart data={timeline} />
            </div>

            <QRCodeDisplay shortCode={code} />
          </div>

          {/* Aggregations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AggregateBars
              title={t('browser')}
              data={browsers}
              icon={
                <svg className="w-4 h-4 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              }
            />
            <AggregateBars
              title={t('os')}
              data={operatingSystems}
              icon={
                <svg className="w-4 h-4 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            <AggregateBars
              title={t('devices')}
              data={devices}
              icon={
                <svg className="w-4 h-4 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
            />
            <AggregateBars
              title={t('topReferrers')}
              data={referrers}
              icon={
                <svg className="w-4 h-4 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              }
            />
          </div>
        </div>
      </main>

      <footer className="px-6 py-6 border-t border-msk-border/50">
        <div className="max-w-6xl mx-auto text-center text-xs text-msk-muted">
          <p>{t('footerNote')}</p>
        </div>
      </footer>
    </div>
  )
}

function KpiCard({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className={`p-4 rounded-xl border ${
      highlight
        ? 'bg-msk-accent/10 border-msk-accent/30'
        : 'bg-msk-surface/50 border-msk-border'
    }`}>
      <p className="text-xs uppercase tracking-wider text-msk-muted mb-1">{label}</p>
      <p className={`font-heading text-2xl truncate ${
        highlight ? 'text-msk-accent' : 'text-msk-text'
      }`}>
        {value}
      </p>
    </div>
  )
}

function parseDays(value: string | undefined): number {
  if (!value) return 30
  const n = parseInt(value, 10)
  if (isNaN(n) || n < 1)  return 30
  if (n > 365)            return 365
  return n
}

function formatDate(date: Date | string, locale: string): string {
  return new Date(date).toLocaleDateString(locale, {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}
