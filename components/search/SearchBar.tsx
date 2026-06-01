'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

const QUICK_AREAS = ['Maarif', 'Guéliz', 'Hay Riad', 'Californie']

export function SearchBar() {
  const [city, setCity] = useState('')
  const [transaction, setTransaction] = useState('vente')
  const locale = useLocale()
  const router = useRouter()
  const isAR = locale === 'ar'

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (city.trim()) params.set('city', city.trim())
    params.set('transaction', transaction)
    router.push(`/annonces?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-3 flex items-center justify-center gap-1.5">
        {[
          { value: 'vente', label: isAR ? 'شراء' : 'Acheter' },
          { value: 'location', label: isAR ? 'إيجار' : 'Louer' },
          { value: 'neuf', label: isAR ? 'جديد' : 'Neuf' },
        ].map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTransaction(value)}
            className={`rounded-[32px] px-4 py-2 text-[13px] font-semibold transition-colors ${
              transaction === value
                ? 'bg-[#222222] text-white'
                : 'bg-white text-[#222222] hover:bg-[#f7f7f7]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        className="flex flex-col bg-white sm:flex-row sm:items-center rounded-[20px]"
        style={{
          boxShadow:
            'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 4px 8px 0px',
        }}
      >
        <label className="flex-1 min-w-0 px-5 py-4">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#222222]">
            {isAR ? 'أين' : 'Où'}
          </span>
          <input
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
            placeholder={isAR ? 'المدينة، الحي...' : 'Ville, quartier, adresse...'}
            className="mt-1 w-full bg-transparent text-[15px] text-[#222222] outline-none placeholder:text-[#6a6a6a]"
          />
        </label>

        <div className="hidden h-10 w-px shrink-0 bg-[#ebebeb] sm:block" />

        <button
          type="button"
          className="mx-3 mb-3 flex items-center justify-between rounded-[14px] border border-[#ebebeb] px-4 py-3 text-start text-[13px] font-semibold text-[#222222] transition-colors hover:border-[#222222] sm:mx-0 sm:mb-0 sm:border-0 sm:px-5 sm:py-4"
        >
          <span>
            <span className="block text-[11px] uppercase tracking-[0.04em]">Budget</span>
            <span className="mt-1 block text-[14px] font-normal text-[#6a6a6a]">Tous les prix</span>
          </span>
          <SlidersHorizontal className="ms-6 h-4 w-4" strokeWidth={1.8} />
        </button>

        <div className="px-3 pb-3 sm:ps-2 sm:pe-3 sm:pb-0">
          <button
            onClick={handleSearch}
            aria-label="Rechercher"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[32px] bg-[#E05C1A] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#B84A12] active:scale-[0.98] sm:w-12 sm:px-0"
          >
            <Search className="h-5 w-5" strokeWidth={2.5} />
            <span className="sm:hidden">Rechercher</span>
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {QUICK_AREAS.map((area) => (
          <button
            key={area}
            type="button"
            onClick={() => setCity(area)}
            className="rounded-[32px] border border-[#ebebeb] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#222222] transition-colors hover:border-[#222222]"
          >
            {area}
          </button>
        ))}
      </div>
    </div>
  )
}
