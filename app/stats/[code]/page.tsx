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
import { PageHead } from '@/components/site/PageHead'
import { SiteFrame } from '@/components/site/SiteFrame'
import { TimelineChart }   from '@/components/TimelineChart'
import { AggregateBars }   from '@/components/AggregateBars'
import { QRCodeDisplay }   from '@/components/QRCodeDisplay'
import { ChartBar, DeviceMobile, Globe, LinkSimple, Monitor, WarningCircle } from '@/components/icons'

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
    <SiteFrame>
      <PageHead
        kicker={t('subtitle')}
        title={
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            translate="no"
            className="font-mono text-[0.8em] break-all hover:text-band-accent"
          >
            {shortUrl}
          </a>
        }
        lead={
          expired ? (
            <span className="inline-flex items-center gap-1.5 text-band-foreground">
              <WarningCircle className="h-5 w-5 text-band-accent" />
              {t('linkExpired')}
            </span>
          ) : undefined
        }
      />
      <div className="container-page py-[var(--space-section)]">
        <div className="grid gap-6">

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
            <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ChartBar className="w-4 h-4 text-primary" />
                  <h2 className="font-display text-lead font-[650] text-foreground">
                    {t('timeline')}
                  </h2>
                </div>

                <div className="flex gap-1 text-small">
                  {[7, 30, 90].map((d) => (
                    <Link
                      key={d}
                      href={`/stats/${code}?days=${d}`}
                      className={`inline-flex min-h-11 items-center px-3 rounded-md transition-colors ${
                        days === d
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
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
                <Globe className="w-4 h-4 text-primary" />
              }
            />
            <AggregateBars
              title={t('os')}
              data={operatingSystems}
              icon={
                <Monitor className="w-4 h-4 text-primary" />
              }
            />
            <AggregateBars
              title={t('devices')}
              data={devices}
              icon={
                <DeviceMobile className="w-4 h-4 text-primary" />
              }
            />
            <AggregateBars
              title={t('topReferrers')}
              data={referrers}
              icon={
                <LinkSimple className="w-4 h-4 text-primary" />
              }
            />
          </div>
        </div>
      </div>

      <p className="container-page pb-[var(--space-section)] text-small text-muted-foreground">{t('footerNote')}</p>
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
