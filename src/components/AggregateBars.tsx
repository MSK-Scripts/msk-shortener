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
    <div className="bg-card border border-border rounded-lg p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-display text-lead font-[650] text-foreground">
          {title}
        </h3>
      </div>

      {data.length === 0 ? (
        <p className="text-small text-muted-foreground text-center py-6">
          {t('noData')}
        </p>
      ) : (
        <ul className="space-y-2.5">
          {data.map((entry) => {
            const percent = total > 0 ? (entry.count / total) * 100 : 0
            return (
              <li key={entry.name} className="space-y-1">
                <div className="flex items-center justify-between text-small">
                  <span className="text-foreground truncate pr-2">{entry.name}</span>
                  <span className="text-muted-foreground flex-shrink-0 tabular-nums">
                    {entry.count.toLocaleString()}{' '}
                    <span className="text-muted-foreground">({percent.toFixed(1)}%)</span>
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
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
