export type AdminUserRole = 'particulier' | 'agence' | 'promoteur' | 'prestataire' | 'vendeur' | 'admin'
export type AdminUserStatus = 'actif' | 'suspendu' | 'en_attente'
export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise'

export interface AdminUser {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  role: AdminUserRole
  status: AdminUserStatus
  isVerified: boolean
  city: string
  subscription: SubscriptionPlan
  joinedAt: string
  lastActiveAt: string
  listingsCount: number
  produitsCount: number
  servicesCount: number
  rating?: number
}

export type AdminListingStatus = 'en_attente' | 'publiee' | 'refusee' | 'vendue' | 'louee' | 'archivee'

export interface AdminListing {
  id: string
  slug: string
  title: string
  city: string
  district?: string
  price: number
  area?: number
  bedrooms?: number
  type: string
  transaction: 'vente' | 'location'
  imageUrl?: string
  status: AdminListingStatus
  isPremium: boolean
  isVerified: boolean
  isFeatured: boolean
  qualityScore: number
  views: number
  contacts: number
  favorites: number
  ownerName: string
  ownerId: string
  agency?: string
  createdAt: string
  updatedAt: string
  rejectionReason?: string
}

export interface AdminAgency {
  id: string
  name: string
  slug: string
  logo: string
  city: string
  isVerified: boolean
  subscription: SubscriptionPlan
  listingsCount: number
  rating: number
  reviewsCount: number
  leadsCount: number
  createdAt: string
  ownerName: string
  ownerEmail: string
  phone: string
}

export type AdminProduitStatus = 'en_ligne' | 'en_attente' | 'masque'

export interface AdminProduit {
  id: string
  slug: string
  name: string
  category: string
  style: string
  brand: string
  city: string
  price: number
  oldPrice?: number
  images: string[]
  inStock: boolean
  stockQty: number
  isNew: boolean
  isBestSeller: boolean
  rating: number
  reviewCount: number
  salesCount: number
  status: AdminProduitStatus
  vendorId: string
  vendorName: string
  createdAt: string
}

export interface AdminVendor {
  id: string
  name: string
  city: string
  mainCategory: string
  productsCount: number
  rating: number
  isVerified: boolean
  salesTotal: number
  createdAt: string
}

export type AdminPrestataireStatus = 'verifie' | 'en_attente' | 'suspendu'

export interface AdminPrestataire {
  id: string
  slug: string
  name: string
  title: string
  category: string
  city: string
  district: string
  avatar: string
  coverImage: string
  rating: number
  reviewCount: number
  responseTime: string
  isVerified: boolean
  isPremium: boolean
  availability: 'disponible' | 'occupe' | 'sur_rdv'
  status: AdminPrestataireStatus
  leadsCount: number
  completedProjects: number
  createdAt: string
}

export type ReportTargetType = 'annonce' | 'produit' | 'prestataire' | 'avis' | 'utilisateur'
export type ReportStatus = 'en_attente' | 'traite' | 'rejete'

export interface AdminReport {
  id: string
  targetType: ReportTargetType
  targetLabel: string
  targetHref?: string
  reporterName: string
  reason: string
  details: string
  status: ReportStatus
  createdAt: string
}

export type ReviewTargetType = 'prestataire' | 'produit' | 'agence'
export type ReviewStatus = 'visible' | 'signale' | 'masque'

export interface AdminReview {
  id: string
  targetType: ReviewTargetType
  targetName: string
  targetHref?: string
  author: string
  rating: number
  text: string
  date: string
  status: ReviewStatus
}

export interface MonthlyMetric {
  month: string
  visites: number
  revenuImmobilier: number
  revenuAmeublement: number
  revenuPrestataires: number
  nouveauxUtilisateurs: number
  conversions: number
}

export interface CityStat {
  city: string
  listings: number
  produits: number
  prestataires: number
  visites: number
}
