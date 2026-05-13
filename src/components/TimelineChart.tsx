'use client'

import {
  AreaChart, Area,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTranslations, useLocale } from 'next-intl'
import type { TimelinePoint } from '@/types'

interface TimelineChartProps {
  data: TimelinePoint[]
}

export function TimelineChart({ data }: TimelineChartProps) {
  const t      = useTranslations('stats')
  const locale = useLocale()

  if (data.length === 0 || data.every((d) => d.clicks === 0)) {
    return (
      <div className="flex items-center justify-center h-64 text-msk-muted text-sm">
        {t('noClicksInPeriod')}
      </div>
    )
  }

  const chartData = data.map((p) => ({
    ...p,
    label: new Date(p.date).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', {
      day:   '2-digit',
      month: '2-digit',
    }),
  }))

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="msk-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#5eb131" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#5eb131" stopOpacity={0}   />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#3d3d3f" vertical={false} />

          <XAxis
            dataKey="label"
            stroke="#8d9096"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#3d3d3f' }}
          />
          <YAxis
            stroke="#8d9096"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />

          <Tooltip
            contentStyle={{
              background:   '#242526',
              border:       '1px solid #3d3d3f',
              borderRadius: '8px',
              color:        '#e3e3e3',
              fontSize:     '12px',
            }}
            labelStyle={{ color: '#8d9096' }}
            cursor={{ stroke: '#5eb131', strokeWidth: 1, strokeDasharray: '3 3' }}
          />

          <Area
            type="monotone"
            dataKey="clicks"
            name={t('kpi.totalClicks')}
            stroke="#5eb131"
            strokeWidth={2}
            fill="url(#msk-gradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
