'use client'

import { useMemo, useState } from 'react'
import { SlidersHorizontal, X, Search, ChevronDown } from 'lucide-react'
import { ProduitCard } from './ProduitCard'
import { CATEGORY_META } from '@/lib/category-meta'
import type { ProduitCardData, ProduitCategory, ProduitStyle } from '@/types/produit'

interface ProduitsDirectoryProps {
  produits: ProduitCardData[]
}

const STYLES: { id: ProduitStyle; label: string }[] = [
  { id: 'moderne',       label: 'Moderne' },
  { id: 'marocain',      label: 'Marocain' },
  { id: 'boheme',        label: 'Bohème' },
  { id: 'industriel',    label: 'Industriel' },
  { id: 'scandinave',    label: 'Scandinave' },
  { id: 'contemporain',  label: 'Contemporain' },
]

const SORT_OPTIONS = [
  { id: 'popular',   label: 'Les plus populaires' },
  { id: 'price-asc', label: 'Prix croissant' },
  { id: 'price-desc',label: 'Prix décroissant' },
  { id: 'rating',    label: 'Mieux notés' },
  { id: 'newest',    label: 'Nouveautés' },
]

type SortId = 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'newest'

export function ProduitsDirectory({ produits }: ProduitsDirectoryProps) {
  const [activeCategory, setActiveCategory] = useState<ProduitCategory | 'all'>('all')
  const [activeStyle, setActiveStyle] = useState<ProduitStyle | 'all'>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortId>('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const categories = Object.entries(CATEGORY_META) as [ProduitCategory, { bg: string; text: string; label: string; emoji: string }][]

  const filtered = useMemo(() => {
    let list = [...produits]

    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory)
    }
    if (activeStyle !== 'all') {
      list = list.filter((p) => p.style === activeStyle)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      )
    }

    switch (sort) {
      case 'price-asc':  return list.sort((a, b) => a.price - b.price)
      case 'price-desc': return list.sort((a, b) => b.price - a.price)
      case 'rating':     return list.sort((a, b) => b.rating - a.rating)
      case 'newest':     return list.filter((p) => p.isNew).concat(list.filter((p) => !p.isNew))
      default:           return list.sort((a, b) => b.reviewCount - a.reviewCount)
    }
  }, [produits, activeCategory, activeStyle, search, sort])

  const currentSort = SORT_OPTIONS.find((s) => s.id === sort) ?? SORT_OPTIONS[0]
  const hasActiveFilters = activeCategory !== 'all' || activeStyle !== 'all' || search.trim()

  const resetFilters = () => {
    setActiveCategory('all')
    setActiveStyle('all')
    setSearch('')
  }

  return (
    <section>
      {/* Search bar */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaaaaa]" />
        <input
          type="text"
          placeholder="Rechercher un produit, une marque..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-[14px] border border-[#e5e5e5] bg-white py-3 pl-11 pr-4 text-[14px] text-[#222222] placeholder:text-[#aaaaaa] focus:border-[#B19272] focus:outline-none focus:ring-2 focus:ring-[#B19272]/15"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[#aaaaaa] hover:text-[#555555]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={[
            'rounded-[32px] border px-4 py-1.5 text-[13px] font-semibold transition-all duration-150',
            activeCategory === 'all'
              ? 'border-[#222222] bg-[#222222] text-white'
              : 'border-[#e5e5e5] text-[#555555] hover:border-[#c0c0c0]',
          ].join(' ')}
        >
          Tout voir
        </button>
        {categories.map(([id, meta]) => (
          <button
            key={id}
            onClick={() => setActiveCategory(activeCategory === id ? 'all' : id)}
            className={[
              'rounded-[32px] border px-4 py-1.5 text-[13px] font-semibold transition-all duration-150',
              activeCategory === id
                ? `${meta.bg} ${meta.text} border-transparent`
                : 'border-[#e5e5e5] text-[#555555] hover:border-[#c0c0c0]',
            ].join(' ')}
          >
            {meta.emoji} {meta.label}
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Toggle style filters */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={[
              'flex items-center gap-2 rounded-[32px] border px-3.5 py-1.5 text-[13px] font-semibold transition-all',
              showFilters
                ? 'border-[#222222] bg-[#222222] text-white'
                : 'border-[#e5e5e5] text-[#555555] hover:border-[#c0c0c0]',
            ].join(' ')}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Style
          </button>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 rounded-[32px] border border-[#ffcdd2] bg-[#fff5f5] px-3 py-1.5 text-[12px] font-semibold text-red-500 transition-colors hover:bg-[#ffebee]"
            >
              <X className="h-3 w-3" />
              Réinitialiser
            </button>
          )}
        </div>

        {/* Result count + sort */}
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-[#888888]">
            {filtered.length} produit{filtered.length !== 1 ? 's' : ''}
          </span>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-2 rounded-[32px] border border-[#e5e5e5] px-3.5 py-1.5 text-[13px] font-semibold text-[#222222] transition-all hover:border-[#c0c0c0]"
            >
              {currentSort.label}
              <ChevronDown className={`h-3.5 w-3.5 text-[#888888] transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>

            {sortOpen && (
              <div className="absolute right-0 top-full z-30 mt-1.5 w-52 overflow-hidden rounded-[14px] border border-[#ebebeb] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)]">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setSort(opt.id as SortId); setSortOpen(false) }}
                    className={[
                      'w-full px-4 py-2.5 text-left text-[13px] transition-colors',
                      sort === opt.id
                        ? 'bg-[#fafafa] font-semibold text-[#222222]'
                        : 'font-medium text-[#555555] hover:bg-[#f7f7f7]',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Style filter row */}
      {showFilters && (
        <div className="mb-6 flex flex-wrap gap-2 rounded-[16px] border border-[#ebebeb] bg-[#fafafa] p-4">
          <p className="mb-2 w-full text-[11px] font-bold uppercase tracking-[0.07em] text-[#aaaaaa]">Style</p>
          <button
            onClick={() => setActiveStyle('all')}
            className={[
              'rounded-[32px] border px-3.5 py-1 text-[12px] font-semibold transition-all',
              activeStyle === 'all'
                ? 'border-[#222222] bg-[#222222] text-white'
                : 'border-[#e5e5e5] text-[#555555] hover:border-[#c0c0c0]',
            ].join(' ')}
          >
            Tous les styles
          </button>
          {STYLES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveStyle(activeStyle === id ? 'all' : id)}
              className={[
                'rounded-[32px] border px-3.5 py-1 text-[12px] font-semibold transition-all',
                activeStyle === id
                  ? 'border-[#B19272] bg-[#B19272] text-white'
                  : 'border-[#e5e5e5] text-[#555555] hover:border-[#c0c0c0]',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((produit, i) => (
            <ProduitCard key={produit.slug} produit={produit} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-[48px]">🔍</p>
          <p className="mt-4 text-[16px] font-semibold text-[#222222]">Aucun produit trouvé</p>
          <p className="mt-1 text-[14px] text-[#888888]">
            Essayez d&apos;autres filtres ou élargissez votre recherche
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 rounded-[32px] bg-[#222222] px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#444444]"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </section>
  )
}
