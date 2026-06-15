import type { LucideIcon } from 'lucide-react'

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[#dddddd] bg-white px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f7f7]">
        <Icon className="h-5 w-5 text-[#b0b0b0]" strokeWidth={1.8} />
      </div>
      <p className="mt-3 text-[14px] font-semibold text-[#222222]">{title}</p>
      {description && <p className="mt-1 max-w-sm text-[13px] text-[#6a6a6a]">{description}</p>}
    </div>
  )
}
