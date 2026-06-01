import type { ListingType, Transaction } from './listing'

export type SortOption = 'recent' | 'price_asc' | 'price_desc' | 'area_desc'
export type ViewMode = 'grid' | 'list' | 'map' | 'split'

export interface SearchFilters {
  q?: string
  type?: ListingType
  transaction?: Transaction
  city?: string
  district?: string
  price_min?: number
  price_max?: number
  bedrooms?: number
  area_min?: number
  area_max?: number
  is_verified?: boolean
  features?: string[]
  lat?: number
  lng?: number
  radius_km?: number
  sort?: SortOption
  page?: number
  limit?: number
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface SearchResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
