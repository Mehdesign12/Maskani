'use client'

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
}) {
  const button = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
        checked ? 'bg-[#B19272]' : 'bg-[#dddddd]',
      ].join(' ')}
    >
      <span
        className={[
          'inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-[22px]' : 'translate-x-[3px]',
        ].join(' ')}
      />
    </button>
  )

  if (!label && !description) return button

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        {label && <p className="text-[13px] font-semibold text-[#222222]">{label}</p>}
        {description && <p className="mt-0.5 text-[12px] text-[#888888]">{description}</p>}
      </div>
      {button}
    </div>
  )
}
