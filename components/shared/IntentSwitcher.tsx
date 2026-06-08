'use client'

import { useEffect, useRef, useState } from 'react'
import { Building2, Handshake, Sofa, ChevronDown, Check, type LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIntentStore, type UserIntent } from '@/store/intentStore'

const INTENTS: {
  id: UserIntent
  icon: LucideIcon
  label: string
  color: string
  comingSoon: boolean
}[] = [
  { id: 'immobilier', icon: Building2, label: 'Immobilier', color: 'text-[#B19272]', comingSoon: false },
  { id: 'prestataires', icon: Handshake, label: 'Prestataires', color: 'text-[#4F6AE8]', comingSoon: true },
  { id: 'ameublement', icon: Sofa, label: 'Ameublement', color: 'text-[#16A34A]', comingSoon: true },
]

export function IntentSwitcher() {
  const { intent, setIntent, reopen } = useIntentStore()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!open) return
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open])

  if (!mounted || !intent) return null

  const current = INTENTS.find((i) => i.id === intent) ?? INTENTS[0]
  const CurrentIcon = current.icon

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        onClick={() => setOpen((v) => !v)}
        className={[
          'flex items-center gap-2 rounded-[32px] border px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-150',
          open
            ? 'border-[#222222] bg-white text-[#222222]'
            : 'border-[#e5e5e5] bg-[#f7f7f7] text-[#222222] hover:border-[#cccccc] hover:bg-white',
        ].join(' ')}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <CurrentIcon className={`h-3.5 w-3.5 ${current.color}`} strokeWidth={1.8} />
        <span>{current.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#888888] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="intent-dropdown"
            className="absolute left-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-[16px] border border-[#ebebeb] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
          >
            <div className="px-3 pb-1.5 pt-3">
              <p className="px-1 text-[10px] font-bold uppercase tracking-[0.07em] text-[#aaaaaa]">
                Mon espace
              </p>
            </div>

            {INTENTS.map(({ id, icon: ItemIcon, label, color, comingSoon }) => (
              <button
                key={id}
                role="option"
                aria-selected={intent === id}
                onClick={() => {
                  setIntent(id)
                  setOpen(false)
                }}
                className={[
                  'flex w-full items-center gap-2.5 px-3 py-2.5 text-[13px] transition-colors',
                  intent === id ? 'bg-[#fafafa] font-semibold' : 'font-medium hover:bg-[#f7f7f7]',
                ].join(' ')}
              >
                <div className={[
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                  id === 'immobilier' ? 'bg-[#fdf4e7]' : id === 'prestataires' ? 'bg-[#EEF2FF]' : 'bg-[#F0FDF4]',
                ].join(' ')}>
                  <ItemIcon className={`h-3.5 w-3.5 ${color}`} strokeWidth={1.8} />
                </div>

                <span className="flex-1 text-left text-[#222222]">{label}</span>

                <div className="flex items-center gap-1.5">
                  {comingSoon && (
                    <span className="rounded-[32px] bg-[#f3f3f3] px-1.5 py-0.5 text-[10px] font-semibold text-[#888888]">
                      Bientôt
                    </span>
                  )}
                  {intent === id && <Check className="h-3.5 w-3.5 text-[#B19272]" />}
                </div>
              </button>
            ))}

            <div className="border-t border-[#f0f0f0] px-3 py-2.5">
              <button
                onClick={() => { reopen(); setOpen(false) }}
                className="w-full text-left text-[11px] text-[#aaaaaa] transition-colors hover:text-[#555555]"
              >
                Revoir l&apos;onboarding
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
