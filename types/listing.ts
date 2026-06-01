export type ListingType =
  | 'appartement'
  | 'villa'
  | 'riad'
  | 'terrain'
  | 'bureau'
  | 'local'
  | 'ferme'
  | 'fond_commerce'

export type Transaction = 'vente' | 'location'

export type ListingStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'rejected'
  | 'sold'
  | 'rented'
  | 'expired'
  | 'archived'

export type ListingFeatures = {
  parking?: boolean
  pool?: boolean
  elevator?: boolean
  garden?: boolean
  security?: boolean
  furnished?: boolean
  terrace?: boolean
  [key: string]: boolean | undefined
}

export interface Listing {
  id: string
  slug: string
  title: string
  title_ar?: string | null
  description?: string | null
  description_ar?: string | null
  type: ListingType
  transaction: Transaction
  price: number
  price_negotiable: boolean
  area?: number | null
  bedrooms?: number | null
  bathrooms?: number | null
  floor?: number | null
  total_floors?: number | null
  year_built?: number | null
  city: string
  district?: string | null
  address?: string | null
  features: ListingFeatures
  status: ListingStatus
  is_premium: boolean
  is_featured: boolean
  is_verified: boolean
  quality_score: number
  views_count: number
  contacts_count: number
  favorites_count: number
  owner_id: string
  agency_id?: string | null
  created_at: string
  updated_at: string
  published_at?: string | null
  expires_at?: string | null
  listing_images?: ListingImage[]
}

export interface ListingImage {
  id: string
  listing_id: string
  url: string
  storage_path: string
  position: number
  is_primary: boolean
  width?: number | null
  height?: number | null
  created_at: string
}

export interface ListingCard
  extends Pick<
    Listing,
    | 'id'
    | 'slug'
    | 'title'
    | 'title_ar'
    | 'price'
    | 'area'
    | 'bedrooms'
    | 'bathrooms'
    | 'city'
    | 'district'
    | 'type'
    | 'transaction'
    | 'is_premium'
    | 'is_featured'
    | 'is_verified'
    | 'quality_score'
    | 'published_at'
    | 'views_count'
  > {
  listing_images?: Pick<ListingImage, 'url' | 'position' | 'is_primary'>[]
}
