import type { ReactNode } from 'react'

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-[20px] font-bold leading-[1.25] tracking-[-0.009em] text-[#222222]">{title}</h2>
        {description && <p className="mt-1 text-[13px] text-[#6a6a6a]">{description}</p>}
      </div>
      {action}
    </div>
  )
}
