'use client'

import { useMemo, useState } from 'react'
import {
  Briefcase, Building2, Camera, CheckSquare, ChevronDown, Hammer, Scale, Truck, Users,
} from 'lucide-react'
import { PresataireCard } from './PresataireCard'
import type { PresataireCardData } from '@/types/prestataire'

const CATEGORIES = [
  { id: 'all',            label: 'Tous',            icon: null },
  { id: 'notaire',        label: 'Notaires',        icon: Scale },
  { id: 'agent',          label: 'Agents',          icon: Building2 },
  { id: 'architecte',     label: 'Architectes',     icon: Users },
  { id: 'entrepreneur',   label: 'Travaux',         icon: Hammer },
  { id: 'diagnostiqueur', label: 'Diagnostics',     icon: CheckSquare },
  { id: 'avocat',         label: 'Avocats',         icon: Briefcase },
  { id: 'photographe',    label: 'Photographes',    icon: Camera },
  { id: 'demenageur',     label: 'Déménageurs',     icon: Truck },
]

const CITIES = ['Toutes les villes', 'Casablanca', 'Marrakech', 'Rabat', 'Tanger']

type Sort = 'rating' | 'reviews' | 'experience'

export function PresatairesDirectory({ profiles }: { profiles: PresataireCardData[] }) {
  const [category, setCategory]  = useState('all')
  const [city, setCity]          = useState('Toutes les villes')
  const [sort, setSort]          = useState<Sort>('rating')

  const filtered = useMemo(() => {
    let list = profiles
    if (category !== 'all')            list = list.filter((p) => p.category === category)
    if (city !== 'Toutes les villes')  list = list.filter((p) => p.city === city)
    return [...list].sort((a, b) => {
      if (sort === 'rating')     return b.rating - a.rating || b.reviewCount - a.reviewCount
      if (sort === 'reviews')    return b.reviewCount - a.reviewCount
      return b.completedProjects - a.completedProjects
    })
  }, [profiles, category, city, sort])

  const activeCat = CATEGORIES.find((c) => c.id === category)

  return (
    <section className="mx-auto max-w-[1760px] px-6 pb-16">
      {/* ── Category chips ───────────────────────────────────────────── */}
      <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-1">
        {CATEGORIES.map(({ id, label, icon: Icon }) => {
          const active = category === id
          return (
            <button
              key={id}
              onClick={() => setCategory(id)}
              className={[
                'flex shrink-0 items-center gap-1.5 rounded-[32px] px-4 py-2 text-[13px] font-semibold transition-all duration-150',
                active
                  ? 'bg-[#222222] text-white'
                  : 'border border-[#ebebeb] bg-white text-[#222222] hover:border-[#c8c8c8]',
              ].join(' ')}
            >
              {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />}
              {label}
            </button>
          )
        })}
      </div>

      {/* ── Filter / sort bar ────────────────────────────────────────── */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        {/* City tabs */}
        <div className="no-scrollbar flex gap-1 overflow-x-auto">
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={[
                'shrink-0 rounded-[32px] px-3.5 py-1.5 text-[13px] transition-colors',
                city === c
                  ? 'bg-[#f7f7f7] font-semibold text-[#222222]'
                  : 'font-medium text-[#6a6a6a] hover:text-[#222222]',
              ].join(' ')}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative shrink-0">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="appearance-none rounded-[32px] border border-[#ebebeb] bg-white py-1.5 pl-3.5 pr-8 text-[13px] font-medium text-[#222222] outline-none"
          >
            <option value="rating">Mieux notés</option>
            <option value="reviews">Plus d&apos;avis</option>
            <option value="experience">Plus expérimentés</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#888888]" />
        </div>
      </div>

      {/* ── Results count ────────────────────────────────────────────── */}
      <p className="mb-6 mt-5 text-[13px] text-[#6a6a6a]">
        <span className="font-semibold text-[#222222]">{filtered.length}</span>{' '}
        prestataire{filtered.length !== 1 ? 's' : ''}
        {category !== 'all' && (
          <span className="text-[#aaaaaa]"> · {activeCat?.label}</span>
        )}
        {city !== 'Toutes les villes' && (
          <span className="text-[#aaaaaa]"> à {city}</span>
        )}
      </p>

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <PresataireCard key={p.slug} prestataire={p} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f7f7]">
            <Users className="h-6 w-6 text-[#aaaaaa]" strokeWidth={1.5} />
          </div>
          <p className="text-[15px] font-semibold text-[#222222]">Aucun prestataire trouvé</p>
          <p className="mt-1 text-[13px] text-[#6a6a6a]">
            Essayez une autre catégorie ou ville.
          </p>
          <button
            onClick={() => { setCategory('all'); setCity('Toutes les villes') }}
            className="mt-4 rounded-[32px] border border-[#ebebeb] px-4 py-2 text-[13px] font-semibold text-[#222222] hover:border-[#c8c8c8]"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </section>
  )
}
