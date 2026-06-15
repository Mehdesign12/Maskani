import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  accent?: string
  trend?: { value: string; direction: 'up' | 'down' }
  helper?: string
}

export function StatCard({ label, value, icon: Icon, accent = '#B19272', trend, helper }: StatCardProps) {
  return (
    <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-[#6a6a6a]">{label}</p>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[10px]"
          style={{ backgroundColor: `${accent}1A` }}
        >
          <Icon className="h-4 w-4" style={{ color: accent }} strokeWidth={1.8} />
        </div>
      </div>
      <p className="mt-3 text-[28px] font-bold leading-[1.18] tracking-[-0.02em] text-[#222222]">{value}</p>
      {(trend || helper) && (
        <div className="mt-2 flex items-center gap-1.5">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-[12px] font-semibold',
                trend.direction === 'up' ? 'text-[#16A34A]' : 'text-[#DC2626]'
              )}
            >
              {trend.direction === 'up' ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {trend.value}
            </span>
          )}
          {helper && <span className="text-[12px] text-[#b0b0b0]">{helper}</span>}
        </div>
      )}
    </div>
  )
}
