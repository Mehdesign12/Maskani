export type UserRole = 'user' | 'agency' | 'promoter' | 'admin' | 'superadmin'
export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise'

export interface Profile {
  id: string
  full_name?: string | null
  avatar_url?: string | null
  phone?: string | null
  role: UserRole
  is_verified: boolean
  subscription: SubscriptionPlan
  stripe_customer_id?: string | null
  created_at: string
  updated_at: string
}

export interface Agency {
  id: string
  owner_id: string
  name: string
  slug: string
  logo_url?: string | null
  cover_url?: string | null
  description?: string | null
  city?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  is_verified: boolean
  subscription: SubscriptionPlan
  subscription_ends_at?: string | null
  rating: number
  reviews_count: number
  listings_count: number
  created_at: string
  updated_at: string
}
