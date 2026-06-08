'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Handshake, Sofa, X, ArrowRight, Check } from 'lucide-react'
import { useIntentStore, type UserIntent } from '@/store/intentStore'

const INTENTS = [
  {
    id: 'immobilier' as UserIntent,
    icon: Building2,
    iconBg: 'bg-[#fdf4e7]',
    iconColor: 'text-[#B19272]',
    accentBorder: 'border-[#B19272]',
    accentBg: 'bg-[#fefbf7]',
    accentRing: 'shadow-[0_0_0_4px_rgba(177,146,114,0.12)]',
    accentText: 'text-[#B19272]',
    label: 'Acheter · Louer · Vendre',
    description: 'Trouvez ou publiez un bien immobilier vérifié partout au Maroc.',
    comingSoon: false,
  },
  {
    id: 'prestataires' as UserIntent,
    icon: Handshake,
    iconBg: 'bg-[#EEF2FF]',
    iconColor: 'text-[#4F6AE8]',
    accentBorder: 'border-[#4F6AE8]',
    accentBg: 'bg-[#f7f8ff]',
    accentRing: 'shadow-[0_0_0_4px_rgba(79,106,232,0.10)]',
    accentText: 'text-[#4F6AE8]',
    label: 'Trouver un prestataire',
    description: 'Notaires, agents, diagnostiqueurs, architectes et plus.',
    comingSoon: false,
  },
  {
    id: 'ameublement' as UserIntent,
    icon: Sofa,
    iconBg: 'bg-[#F0FDF4]',
    iconColor: 'text-[#16A34A]',
    accentBorder: 'border-[#16A34A]',
    accentBg: 'bg-[#f7fef9]',
    accentRing: 'shadow-[0_0_0_4px_rgba(22,163,74,0.10)]',
    accentText: 'text-[#16A34A]',
    label: 'Meubler mon bien',
    description: 'Mobilier, artisans et décorateurs d\'intérieur certifiés.',
    comingSoon: true,
  },
]

export function OnboardingOverlay() {
  const { hasOnboarded, setIntent, dismiss } = useIntentStore()
  const [mounted, setMounted] = useState(false)
  const [selected, setSelected] = useState<UserIntent | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const handleSelect = (id: UserIntent) => {
    setSelected(id)
    setTimeout(() => setIntent(id), 380)
  }

  const show = mounted && !hasOnboarded

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="onboarding-backdrop"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.62)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          {/* Subtle noise grain on the backdrop */}
          <div className="absolute inset-0 backdrop-blur-[3px]" />

          <motion.div
            className="relative z-10 w-full max-w-[900px] overflow-hidden rounded-[28px] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.22)] p-8 sm:p-10 md:p-12"
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Dismiss button */}
            <button
              onClick={dismiss}
              aria-label="Passer"
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-[#9a9a9a] transition-all hover:bg-[#f0f0f0] hover:text-[#222222]"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="mb-8 sm:mb-10">
              <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#B19272]">
                Bienvenue sur Maskani
              </p>
              <h2 className="text-[24px] font-bold leading-[1.1] tracking-[-0.03em] text-[#222222] sm:text-[30px]">
                Que souhaitez-vous<br className="hidden sm:block" /> faire sur Maskani ?
              </h2>
              <p className="mt-2.5 text-[14px] leading-[1.55] text-[#6a6a6a]">
                Choisissez votre espace — vous pourrez en changer à tout moment.
              </p>
            </div>

            {/* Cards */}
            <div className="grid gap-3 sm:grid-cols-3">
              {INTENTS.map(({
                id, icon: Icon, iconBg, iconColor,
                accentBorder, accentBg, accentRing, accentText,
                label, description, comingSoon,
              }, i) => {
                const isSelected = selected === id
                return (
                  <motion.button
                    key={id}
                    onClick={() => handleSelect(id)}
                    className={[
                      'group relative text-left rounded-[20px] border-2 p-6 transition-all duration-200',
                      isSelected
                        ? `${accentBorder} ${accentBg} ${accentRing}`
                        : 'border-[#ebebeb] bg-white hover:border-[#d0d0d0] hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)]',
                    ].join(' ')}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.07, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.985 }}
                  >
                    {/* Coming soon badge */}
                    {comingSoon && (
                      <span className="absolute right-4 top-4 rounded-[32px] bg-[#f3f3f3] px-2.5 py-1 text-[11px] font-semibold text-[#888888]">
                        Bientôt
                      </span>
                    )}

                    {/* Icon */}
                    <div className={[
                      'mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl transition-transform duration-200',
                      iconBg,
                      'group-hover:scale-105',
                    ].join(' ')}>
                      <Icon className={`h-6 w-6 ${iconColor}`} strokeWidth={1.7} />
                    </div>

                    {/* Label */}
                    <p className="text-[15px] font-bold leading-[1.2] tracking-[-0.01em] text-[#222222]">
                      {label}
                    </p>

                    {/* Description */}
                    <p className="mt-2 text-[13px] leading-[1.5] text-[#6a6a6a]">
                      {description}
                    </p>

                    {/* CTA row */}
                    <div className={[
                      'mt-4 flex items-center gap-1 text-[12px] font-semibold transition-colors duration-150',
                      isSelected ? accentText : 'text-[#aaaaaa] group-hover:text-[#222222]',
                    ].join(' ')}>
                      {isSelected ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Sélectionné
                        </>
                      ) : (
                        <>
                          Choisir
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Skip */}
            <div className="mt-7 flex justify-end">
              <button
                onClick={dismiss}
                className="text-[13px] text-[#aaaaaa] transition-colors hover:text-[#555555]"
              >
                Passer pour l&apos;instant
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
