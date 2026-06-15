'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface Series {
  key: string
  label: string
  color: string
}

export function SimpleBarChart<T>({
  data,
  xKey,
  series,
  height = 260,
  valueFormatter,
  horizontal = false,
}: {
  data: T[]
  xKey: string
  series: Series[]
  height?: number
  valueFormatter?: (value: number) => string
  horizontal?: boolean
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ebebeb" vertical={horizontal} horizontal={!horizontal} />
        {horizontal ? (
          <>
            <XAxis type="number" tick={{ fontSize: 11, fill: '#888888' }} axisLine={false} tickLine={false} tickFormatter={valueFormatter} />
            <YAxis type="category" dataKey={xKey} tick={{ fontSize: 11, fill: '#888888' }} axisLine={false} tickLine={false} width={100} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#888888' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#888888' }} axisLine={false} tickLine={false} tickFormatter={valueFormatter} width={48} />
          </>
        )}
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #ebebeb', fontSize: 12 }}
          formatter={(value, name) => [valueFormatter ? valueFormatter(Number(value)) : String(value), String(name)]}
        />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[6, 6, 6, 6]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
