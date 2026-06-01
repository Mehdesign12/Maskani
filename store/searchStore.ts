import { create } from 'zustand'
import type { ListingType, Transaction } from '@/types/listing'
import type { MapBounds, SortOption, ViewMode } from '@/types/search'

interface SearchState {
  query: string
  type: ListingType | null
  transaction: Transaction
  city: string | null
  district: string | null
  priceMin: number | null
  priceMax: number | null
  bedrooms: number | null
  areaMin: number | null
  areaMax: number | null
  features: string[]
  isVerified: boolean
  sort: SortOption
  page: number
  viewMode: ViewMode
  mapBounds: MapBounds | null

  setFilter: <K extends keyof SearchState>(key: K, value: SearchState[K]) => void
  resetFilters: () => void
  setViewMode: (mode: ViewMode) => void
  setPage: (page: number) => void
}

const defaultFilters = {
  query: '',
  type: null as ListingType | null,
  transaction: 'vente' as Transaction,
  city: null as string | null,
  district: null as string | null,
  priceMin: null as number | null,
  priceMax: null as number | null,
  bedrooms: null as number | null,
  areaMin: null as number | null,
  areaMax: null as number | null,
  features: [] as string[],
  isVerified: false,
  sort: 'recent' as SortOption,
  page: 1,
}

export const useSearchStore = create<SearchState>((set) => ({
  ...defaultFilters,
  viewMode: 'grid',
  mapBounds: null,

  setFilter: (key, value) => set({ [key]: value, page: 1 }),

  resetFilters: () => set({ ...defaultFilters }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setPage: (page) => set({ page }),
}))
