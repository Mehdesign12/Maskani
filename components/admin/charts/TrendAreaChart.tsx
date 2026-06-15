'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface Series {
  key: string
  label: string
  color: string
}

export function TrendAreaChart<T>({
  data,
  xKey,
  series,
  height = 280,
  valueFormatter,
}: {
  data: T[]
  xKey: string
  series: Series[]
  height?: number
  valueFormatter?: (value: number) => string
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`gradient-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ebebeb" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#888888' }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: '#888888' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={valueFormatter}
          width={48}
        />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #ebebeb', fontSize: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
          formatter={(value, name) => [valueFormatter ? valueFormatter(Number(value)) : String(value), String(name)]}
        />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            fill={`url(#gradient-${s.key})`}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}
