import { getLocale, getTranslations } from 'next-intl/server'

import type { TimelinePoint } from '@/types'

/**
 * Clicks per day as bars, hand-written SVG rendered on the server: no chart
 * library, no client script, nothing the CSP has to allow. Every bar names
 * its day and figure (`<title>`), and a table carries the same values for a
 * screen reader, so no value is told by length alone.
 */
export async function TimelineChart({ data }: { data: TimelinePoint[] }) {
  const [t, locale] = await Promise.all([getTranslations('stats'), getLocale()])

  if (data.length === 0 || data.every((d) => d.clicks === 0)) {
    return (
      <div className="flex h-64 items-center justify-center text-small text-muted-foreground">
        {t('noClicksInPeriod')}
      </div>
    )
  }

  const format = new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', { day: '2-digit', month: '2-digit' })
  const points = data.map((p) => ({ ...p, label: format.format(new Date(p.date)) }))
  const max = Math.max(...points.map((p) => p.clicks))

  // A unit per day; bars take 70 % of it, the rest is the gap.
  const width = points.length
  const height = 100
  const bar = 0.7

  // First, middle and last day under the axis.
  const ticks = [0, Math.floor((points.length - 1) / 2), points.length - 1].filter(
    (value, index, all) => all.indexOf(value) === index,
  )

  return (
    <figure className="grid gap-2">
      <p className="text-right text-label text-muted-foreground tabular-nums">{t('chartMax', { count: max })}</p>
      <div className="relative h-60">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          className="h-full w-full overflow-visible"
        >
          <line x1="0" x2={width} y1="0.5" y2="0.5" className="stroke-border" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="0" x2={width} y1={height} y2={height} className="stroke-input" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          {points.map((p, i) => {
            const h = max > 0 ? (p.clicks / max) * (height - 4) : 0
            return (
              <rect
                key={p.date}
                x={i + (1 - bar) / 2}
                y={height - h}
                width={bar}
                height={h}
                className="fill-chart-1"
              >
                <title>{`${p.label}: ${p.clicks}`}</title>
              </rect>
            )
          })}
        </svg>
      </div>
      <div className="relative h-5 text-label text-muted-foreground tabular-nums">
        {ticks.map((i) => (
          <span
            key={i}
            className={
              i === 0
                ? 'absolute left-0'
                : i === points.length - 1
                  ? 'absolute right-0'
                  : 'absolute left-1/2 -translate-x-1/2'
            }
          >
            {points[i]!.label}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>{t('timeline')}</caption>
        <thead>
          <tr>
            <th scope="col">{t('chartDay')}</th>
            <th scope="col">{t('kpi.totalClicks')}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.date}>
              <td>{p.label}</td>
              <td>{p.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
