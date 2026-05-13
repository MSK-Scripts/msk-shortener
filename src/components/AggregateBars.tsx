import { getTranslations } from 'next-intl/server'
import type { AggregateEntry } from '@/types'

interface AggregateBarsProps {
  title:   string
  data:    AggregateEntry[]
  icon?:   React.ReactNode
}

/**
 * Zeigt eine Liste aggregierter Daten als horizontale Bars.
 * (Server Component – läuft auf dem Server)
 */
export async function AggregateBars({ title, data, icon }: AggregateBarsProps) {
  const t = await getTranslations('stats')
  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="bg-msk-surface/50 border border-msk-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-sm font-medium text-msk-text uppercase tracking-wider">
          {title}
        </h3>
      </div>

      {data.length === 0 ? (
        <p className="text-xs text-msk-muted text-center py-6">
          {t('noData')}
        </p>
      ) : (
        <ul className="space-y-2.5">
          {data.map((entry) => {
            const percent = total > 0 ? (entry.count / total) * 100 : 0
            return (
              <li key={entry.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-msk-text truncate pr-2">{entry.name}</span>
                  <span className="text-msk-muted flex-shrink-0">
                    {entry.count.toLocaleString()}{' '}
                    <span className="text-msk-dim">({percent.toFixed(1)}%)</span>
                  </span>
                </div>
                <div className="h-1.5 bg-msk-surface2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-msk-accent rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
