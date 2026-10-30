import { getTranslations } from 'next-intl/server'
import { getGlobalStats } from '@/lib/globalStats'
import { PageHead } from '@/components/site/PageHead'
import { SiteFrame } from '@/components/site/SiteFrame'
import { AggregateBars }  from '@/components/AggregateBars'
import { Globe, Monitor, ShieldCheck } from '@/components/icons'

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
    <SiteFrame>
      <PageHead kicker={t('headerLabel')} title={t('title')} lead={t('subtitle')} />
      <div className="container-page py-[var(--space-section)]">
        <div className="grid gap-8">

          {/* Main KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label={t('totalLinks')}  value={stats.totalLinks.toLocaleString()}  highlight />
            <KpiCard label={t('totalClicks')} value={stats.totalClicks.toLocaleString()} highlight />
            <KpiCard label={t('linksToday')}  value={stats.linksToday.toLocaleString()}  />
            <KpiCard label={t('clicksToday')} value={stats.clicksToday.toLocaleString()} />
          </div>

          {/* Sekundäre Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-5 shadow-[var(--shadow-card)]">
              <p className="text-label font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2">
                {t('clicksLast7Days')}
              </p>
              <p className="font-display text-h3 font-[650] tabular-nums text-foreground">
                {stats.clicksLast7Days.toLocaleString()}
              </p>
              <p className="text-small text-muted-foreground mt-1">
                {stats.totalClicks > 0
                  ? t('percentOfTotal', {
                      percent: ((stats.clicksLast7Days / stats.totalClicks) * 100).toFixed(1),
                    })
                  : t('noDataYet')}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-5 shadow-[var(--shadow-card)]">
              <p className="text-label font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2">
                {t('avgClicksPerLink')}
              </p>
              <p className="font-display text-h3 font-[650] tabular-nums text-foreground">
                {stats.totalLinks > 0
                  ? (stats.totalClicks / stats.totalLinks).toFixed(1)
                  : '0'}
              </p>
              <p className="text-small text-muted-foreground mt-1">
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
                <Globe className="w-4 h-4 text-primary" />
              }
            />
            <AggregateBars
              title={t('topOs')}
              data={stats.topOperatingSystems}
              icon={
                <Monitor className="w-4 h-4 text-primary" />
              }
            />
          </div>

          {/* Privacy-Hinweis */}
          <div className="bg-accent-soft border border-primary/30 rounded-xl p-5 text-small text-muted-foreground">
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground font-medium mb-1">{t('privacyTitle')}</p>
                <p className="text-small leading-relaxed">
                  {t('privacyText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteFrame>
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
    <div className={`p-4 rounded-lg border ${
      highlight
        ? 'bg-accent-soft border-primary/40'
        : 'bg-card border-border'
    }`}>
      <p className="text-label font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1">{label}</p>
      <p className={`font-display text-h3 font-[650] tabular-nums truncate ${
        highlight ? 'text-primary' : 'text-foreground'
      }`}>
        {value}
      </p>
    </div>
  )
}
