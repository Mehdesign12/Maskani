import { PRESTATAIRES } from '@/lib/prestataires'
import { createRng, isoDateDaysAgo, randomInt } from './seed'
import type { AdminPrestataire, AdminPrestataireStatus } from './types'
import type { PresataireCategory } from '@/types/prestataire'

const STATUS_WEIGHTS: { status: AdminPrestataireStatus; weight: number }[] = [
  { status: 'verifie', weight: 70 },
  { status: 'en_attente', weight: 22 },
  { status: 'suspendu', weight: 8 },
]

function pickStatus(rng: () => number): AdminPrestataireStatus {
  const total = STATUS_WEIGHTS.reduce((s, i) => s + i.weight, 0)
  let roll = rng() * total
  for (const item of STATUS_WEIGHTS) {
    if (roll < item.weight) return item.status
    roll -= item.weight
  }
  return 'verifie'
}

export const ADMIN_PRESTATAIRES: AdminPrestataire[] = PRESTATAIRES.map((p, index) => {
  const rng = createRng(6000 + index * 29)
  const status = p.isVerified ? 'verifie' : pickStatus(rng)

  return {
    id: `PST-${String(index + 1).padStart(3, '0')}`,
    slug: p.slug,
    name: p.name,
    title: p.title,
    category: p.category,
    city: p.city,
    district: p.district,
    avatar: p.avatar,
    coverImage: p.coverImage,
    rating: p.rating,
    reviewCount: p.reviewCount,
    responseTime: p.responseTime,
    isVerified: p.isVerified,
    isPremium: p.isPremium,
    availability: p.availability,
    status,
    leadsCount: randomInt(rng, 8, 260),
    completedProjects: p.completedProjects,
    createdAt: isoDateDaysAgo(randomInt(rng, 30, 540)),
  }
})

export const PRESTATAIRE_STATUS_LABELS: Record<AdminPrestataireStatus, string> = {
  verifie: 'Vérifié',
  en_attente: 'En attente',
  suspendu: 'Suspendu',
}

export const PRESTATAIRE_CATEGORY_LABELS: Record<PresataireCategory, string> = {
  notaire: 'Notaire',
  agent: 'Agent immobilier',
  diagnostiqueur: 'Diagnostiqueur',
  architecte: 'Architecte',
  entrepreneur: 'Travaux / Entrepreneur',
  avocat: 'Avocat',
  photographe: 'Photographe',
  demenageur: 'Déménageur',
}
