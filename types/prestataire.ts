export type PresataireCategory =
  | 'notaire'
  | 'agent'
  | 'diagnostiqueur'
  | 'architecte'
  | 'entrepreneur'
  | 'avocat'
  | 'photographe'
  | 'demenageur'

export type Availability = 'disponible' | 'occupe' | 'sur_rdv'

export interface PresataireReview {
  id: string
  author: string
  authorInitials: string
  rating: number
  date: string
  text: string
  projectType: string
}

export interface PresatairePortfolioItem {
  url: string
  caption: string
}

export interface Prestataire {
  slug: string
  name: string
  title: string
  category: PresataireCategory
  city: string
  district: string
  bio: string
  avatar: string
  coverImage: string
  rating: number
  reviewCount: number
  responseTime: string
  isVerified: boolean
  isPremium: boolean
  services: string[]
  priceInfo: string
  completedProjects: number
  yearsExperience: number
  languages: string[]
  specializations: string[]
  portfolio: PresatairePortfolioItem[]
  reviews: PresataireReview[]
  phone: string
  email: string
  website?: string
  certifications: string[]
  availability: Availability
}

export type PresataireCardData = Pick<
  Prestataire,
  | 'slug'
  | 'name'
  | 'title'
  | 'category'
  | 'city'
  | 'district'
  | 'avatar'
  | 'coverImage'
  | 'rating'
  | 'reviewCount'
  | 'responseTime'
  | 'isVerified'
  | 'isPremium'
  | 'services'
  | 'priceInfo'
  | 'completedProjects'
  | 'availability'
>
