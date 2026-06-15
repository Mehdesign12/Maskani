import type {
  AdminListingStatus,
  AdminPrestataireStatus,
  AdminProduitStatus,
  AdminUserStatus,
  ReportStatus,
  ReviewStatus,
} from './types'

export type StatusTone = 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'gray'

export const LISTING_STATUS_TONES: Record<AdminListingStatus, StatusTone> = {
  publiee: 'green',
  en_attente: 'amber',
  refusee: 'red',
  vendue: 'blue',
  louee: 'purple',
  archivee: 'gray',
}

export const USER_STATUS_TONES: Record<AdminUserStatus, StatusTone> = {
  actif: 'green',
  en_attente: 'amber',
  suspendu: 'red',
}

export const PRODUIT_STATUS_TONES: Record<AdminProduitStatus, StatusTone> = {
  en_ligne: 'green',
  en_attente: 'amber',
  masque: 'gray',
}

export const PRESTATAIRE_STATUS_TONES: Record<AdminPrestataireStatus, StatusTone> = {
  verifie: 'green',
  en_attente: 'amber',
  suspendu: 'red',
}

export const REPORT_STATUS_TONES: Record<ReportStatus, StatusTone> = {
  en_attente: 'amber',
  traite: 'green',
  rejete: 'gray',
}

export const REVIEW_STATUS_TONES: Record<ReviewStatus, StatusTone> = {
  visible: 'green',
  signale: 'amber',
  masque: 'gray',
}
