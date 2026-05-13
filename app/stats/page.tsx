import { getTranslations } from 'next-intl/server'
import { getGlobalStats } from '@/lib/globalStats'
import { Header }         from '@/components/Header'
import { AggregateBars }  from '@/components/AggregateBars'

export const dynamic   = 'force-dynamic'
export const revalidate = 300

export async function generateMetadata() {
  const t = await getTranslations('globalStats')
  return {
    title:       t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function GlobalStatsPage() {
  const stats = await getGlobalStats()
  const t     = await getTranslations('globalStats')

  return (
    <div className="min-h-screen flex flex-col">
      <Header backLink={{ href: '/' }} />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Title */}
          <div className="text-center space-y-3 animate-fade-in">
            <p className="text-xs uppercase tracking-wider text-msk-muted">
              {t('headerLabel')}
            </p>
            <h1 className="font-heading text-3xl md:text-4xl text-msk-text">
              {t('title')}
            </h1>
            <p className="text-msk-muted text-sm max-w-xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          {/* Main KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label={t('totalLinks')}  value={stats.totalLinks.toLocaleString()}  highlight />
            <KpiCard label={t('totalClicks')} value={stats.totalClicks.toLocaleString()} highlight />
            <KpiCard label={t('linksToday')}  value={stats.linksToday.toLocaleString()}  />
            <KpiCard label={t('clicksToday')} value={stats.clicksToday.toLocaleString()} />
          </div>

          {/* Sekundäre Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-msk-surface/50 border border-msk-border rounded-xl p-5">
              <p className="text-xs uppercase tracking-wider text-msk-muted mb-2">
                {t('clicksLast7Days')}
              </p>
              <p className="font-heading text-3xl text-msk-text">
                {stats.clicksLast7Days.toLocaleString()}
              </p>
              <p className="text-xs text-msk-dim mt-1">
                {stats.totalClicks > 0
                  ? t('percentOfTotal', {
                      percent: ((stats.clicksLast7Days / stats.totalClicks) * 100).toFixed(1),
                    })
                  : t('noDataYet')}
              </p>
            </div>

            <div className="bg-msk-surface/50 border border-msk-border rounded-xl p-5">
              <p className="text-xs uppercase tracking-wider text-msk-muted mb-2">
                {t('avgClicksPerLink')}
              </p>
              <p className="font-heading text-3xl text-msk-text">
                {stats.totalLinks > 0
                  ? (stats.totalClicks / stats.totalLinks).toFixed(1)
                  : '0'}
              </p>
              <p className="text-xs text-msk-dim mt-1">
                {t('avgClicksHint')}
              </p>
            </div>
          </div>

          {/* Aggregations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AggregateBars
              title={t('topBrowsers')}
              data={stats.topBrowsers}
              icon={
                <svg className="w-4 h-4 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              }
            />
            <AggregateBars
              title={t('topOs')}
              data={stats.topOperatingSystems}
              icon={
                <svg className="w-4 h-4 text-msk-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>

          {/* Privacy-Hinweis */}
          <div className="bg-msk-accent/5 border border-msk-accent/20 rounded-xl p-5 text-sm text-msk-muted">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-msk-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-msk-text font-medium mb-1">{t('privacyTitle')}</p>
                <p className="text-xs leading-relaxed">
                  {t('privacyText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
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
