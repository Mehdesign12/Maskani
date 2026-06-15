import { cn } from '@/lib/utils'
import type { StatusTone } from '@/lib/admin/status-colors'

const TONE_STYLES: Record<StatusTone, string> = {
  green: 'bg-[#F0FDF4] text-[#16A34A]',
  amber: 'bg-[#FFFBEB] text-[#B45309]',
  red: 'bg-[#FEF2F2] text-[#DC2626]',
  blue: 'bg-[#EEF2FF] text-[#4F6AE8]',
  purple: 'bg-[#F5F3FF] text-[#7C3AED]',
  gray: 'bg-[#F7F7F7] text-[#6a6a6a]',
}

export function StatusPill({ label, tone }: { label: string; tone: StatusTone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-[4px] px-2 py-0.5 text-[11px] font-semibold leading-[1.29] tracking-[0.04em]',
        TONE_STYLES[tone]
      )}
    >
      {label}
    </span>
  )
}
