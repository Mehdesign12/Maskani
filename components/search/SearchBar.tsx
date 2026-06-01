'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

export function SearchBar() {
  const [city, setCity] = useState('')
  const [transaction, setTransaction] = useState('vente')
  const locale = useLocale()
  const router = useRouter()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (city.trim()) params.set('city', city.trim())
    params.set('transaction', transaction)
    router.push(`/annonces?${params.toString()}`)
  }

  const isAR = locale === 'ar'

  return (
    <div
      className="flex items-center bg-white rounded-[20px] w-full max-w-2xl"
      style={{
        boxShadow:
          'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 4px 8px 0px',
      }}
    >
      {/* Où */}
      <div className="flex-1 min-w-0 px-5 py-3.5">
        <p className="text-[11px] font-semibold text-[#222222] tracking-[0.04em] uppercase">
          {isAR ? 'أين' : 'Où'}
        </p>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={isAR ? 'المدينة، الحي...' : 'Ville, quartier...'}
          className="w-full text-[14px] text-[#222222] bg-transparent outline-none placeholder:text-[#6a6a6a] mt-0.5"
        />
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-[#ebebeb] shrink-0" />

      {/* Type */}
      <div className="px-5 py-3.5 shrink-0">
        <p className="text-[11px] font-semibold text-[#222222] tracking-[0.04em] uppercase">
          {isAR ? 'نوع' : 'Type'}
        </p>
        <select
          value={transaction}
          onChange={(e) => setTransaction(e.target.value)}
          className="text-[14px] text-[#222222] bg-transparent outline-none mt-0.5 cursor-pointer"
        >
          <option value="vente">{isAR ? 'شراء' : 'Acheter'}</option>
          <option value="location">{isAR ? 'إيجار' : 'Louer'}</option>
        </select>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-[#ebebeb] shrink-0" />

      {/* Budget */}
      <div className="hidden sm:block px-5 py-3.5 shrink-0">
        <p className="text-[11px] font-semibold text-[#222222] tracking-[0.04em] uppercase">
          {isAR ? 'الميزانية' : 'Budget'}
        </p>
        <p className="text-[14px] text-[#6a6a6a] mt-0.5">
          {isAR ? 'كل الأسعار' : 'Tous les prix'}
        </p>
      </div>

      {/* Search button */}
      <div className="ps-2 pe-3">
        <button
          onClick={handleSearch}
          aria-label="Rechercher"
          className="w-12 h-12 bg-[#E05C1A] rounded-full flex items-center justify-center hover:bg-[#B84A12] transition-colors active:scale-95"
        >
          <Search className="w-5 h-5 text-white" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
