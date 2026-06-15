import { FEATURED_LISTINGS } from '@/lib/listings'
import { createRng, isoDateDaysAgo, pick, randomInt } from './seed'
import { ADMIN_USERS } from './mock-users'
import type { AdminAgency, AdminListing, AdminListingStatus } from './types'

const STATUS_WEIGHTS: { status: AdminListingStatus; weight: number }[] = [
  { status: 'publiee', weight: 45 },
  { status: 'en_attente', weight: 18 },
  { status: 'vendue', weight: 12 },
  { status: 'louee', weight: 10 },
  { status: 'refusee', weight: 8 },
  { status: 'archivee', weight: 7 },
]

const REJECTION_REASONS = [
  'Photos de mauvaise qualité',
  'Prix incohérent avec le marché du quartier',
  "Adresse non vérifiable",
  'Annonce dupliquée',
  'Informations manquantes (surface, titre foncier)',
]

const DISTRICTS: Record<string, string[]> = {
  Casablanca: ['Racine', 'Maârif', 'Bourgogne', 'Anfa', 'Sidi Belyout', 'CFC'],
  Marrakech: ['Guéliz', 'Hivernage', 'Palmeraie', 'Médina', 'Targa'],
  Rabat: ['Hay Riad', 'Agdal', 'Souissi', 'Aviation'],
  Tanger: ['Malabata', 'Iberia', 'California'],
  Fès: ['Ville Nouvelle', 'Médina', 'Saiss'],
  Agadir: ['Founty', 'Talborjt', 'Sonaba'],
}

const TYPES = ['appartement', 'villa', 'riad', 'terrain', 'bureau', 'local', 'studio'] as const

const TYPE_LABELS: Record<string, string> = {
  appartement: 'Appartement',
  villa: 'Villa',
  riad: 'Riad',
  terrain: 'Terrain',
  bureau: 'Bureau',
  local: 'Local commercial',
  studio: 'Studio',
}

const TYPE_DESCRIPTORS = ['lumineux', 'rénové', 'avec terrasse', 'vue dégagée', 'standing', 'au calme', 'avec parking', 'meublé']

const IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&h=450&fit=crop',
]

const AGENCY_OWNERS = ADMIN_USERS.filter((u) => u.role === 'agence')
const PARTICULIER_OWNERS = ADMIN_USERS.filter((u) => u.role === 'particulier')

function buildGeneratedListing(index: number): AdminListing {
  const rng = createRng(5000 + index * 23)
  const city = pick(rng, Object.keys(DISTRICTS))
  const district = pick(rng, DISTRICTS[city])
  const type = pick(rng, TYPES)
  const transaction = type === 'terrain' || type === 'riad' ? 'vente' : pick(rng, ['vente', 'location'] as const)
  const descriptor = pick(rng, TYPE_DESCRIPTORS)
  const status = (() => {
    const total = STATUS_WEIGHTS.reduce((s, i) => s + i.weight, 0)
    let roll = rng() * total
    for (const item of STATUS_WEIGHTS) {
      if (roll < item.weight) return item.status
      roll -= item.weight
    }
    return 'publiee' as AdminListingStatus
  })()

  const area = type === 'terrain' ? randomInt(rng, 200, 2000) : randomInt(rng, 45, 380)
  const basePrice = transaction === 'vente'
    ? randomInt(rng, 60, 950) * 10000 * 100
    : randomInt(rng, 4000, 25000) * 100

  const useAgency = rng() > 0.5 && AGENCY_OWNERS.length > 0
  const owner = useAgency ? pick(rng, AGENCY_OWNERS) : pick(rng, PARTICULIER_OWNERS)
  const createdDaysAgo = randomInt(rng, 1, 200)

  return {
    id: `LST-${String(index + 1).padStart(4, '0')}`,
    slug: `${type}-${descriptor.replace(/\s+/g, '-')}-${district.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    title: `${TYPE_LABELS[type]} ${descriptor} — ${district}`,
    city,
    district,
    price: basePrice,
    area,
    bedrooms: type === 'terrain' || type === 'local' || type === 'bureau' ? undefined : randomInt(rng, 1, 6),
    type,
    transaction,
    imageUrl: pick(rng, IMAGES),
    status,
    isPremium: rng() > 0.78,
    isVerified: status !== 'refusee' && rng() > 0.35,
    isFeatured: rng() > 0.85,
    qualityScore: randomInt(rng, 55, 99),
    views: randomInt(rng, 20, 3200),
    contacts: randomInt(rng, 0, 140),
    favorites: randomInt(rng, 0, 220),
    ownerName: owner?.name ?? 'Utilisateur Maskani',
    ownerId: owner?.id ?? 'USR-0001',
    agency: useAgency ? owner?.name : undefined,
    createdAt: isoDateDaysAgo(createdDaysAgo),
    updatedAt: isoDateDaysAgo(Math.max(0, createdDaysAgo - randomInt(rng, 0, createdDaysAgo))),
    rejectionReason: status === 'refusee' ? pick(rng, REJECTION_REASONS) : undefined,
  }
}

const FEATURED_AS_ADMIN: AdminListing[] = FEATURED_LISTINGS.map((listing, index) => ({
  id: `LST-${String(9000 + index).padStart(4, '0')}`,
  slug: listing.slug,
  title: listing.title,
  city: listing.city,
  district: listing.district,
  price: listing.price,
  area: listing.area,
  bedrooms: listing.bedrooms,
  type: listing.type,
  transaction: listing.transaction,
  imageUrl: listing.imageUrl,
  status: 'publiee',
  isPremium: Boolean(listing.isPremium),
  isVerified: Boolean(listing.isVerified),
  isFeatured: Boolean(listing.isPremium),
  qualityScore: listing.qualityScore,
  views: listing.views,
  contacts: Math.round(listing.views * 0.04),
  favorites: listing.saved,
  ownerName: listing.agentName,
  ownerId: `USR-${String((index % ADMIN_USERS.length) + 1).padStart(4, '0')}`,
  agency: listing.agency,
  createdAt: isoDateDaysAgo(30 + index * 4),
  updatedAt: isoDateDaysAgo(index),
}))

export const ADMIN_LISTINGS: AdminListing[] = [
  ...FEATURED_AS_ADMIN,
  ...Array.from({ length: 30 }, (_, i) => buildGeneratedListing(i)),
]

export const LISTING_STATUS_LABELS: Record<AdminListingStatus, string> = {
  en_attente: 'En attente',
  publiee: 'Publiée',
  refusee: 'Refusée',
  vendue: 'Vendue',
  louee: 'Louée',
  archivee: 'Archivée',
}

const AGENCY_NAMES = ['Kensington Maroc', 'Atlas Living', 'Médina Patrimoine', 'Urban Keys', 'Riviera Immo', 'Sud Habitat', 'Capital Résidences', 'Prestige Maroc']

function buildAgency(index: number): AdminAgency {
  const rng = createRng(7000 + index * 31)
  const owner = pick(rng, AGENCY_OWNERS.length ? AGENCY_OWNERS : ADMIN_USERS)
  const name = AGENCY_NAMES[index] ?? `Agence ${index + 1}`
  const city = pick(rng, Object.keys(DISTRICTS))

  return {
    id: `AGY-${String(index + 1).padStart(3, '0')}`,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    logo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=D9BB9C`,
    city,
    isVerified: rng() > 0.3,
    subscription: pick(rng, ['free', 'basic', 'pro', 'enterprise'] as const),
    listingsCount: randomInt(rng, 3, 64),
    rating: Number((4 + rng()).toFixed(1)) > 5 ? 5 : Number((4 + rng()).toFixed(1)),
    reviewsCount: randomInt(rng, 5, 220),
    leadsCount: randomInt(rng, 10, 480),
    createdAt: isoDateDaysAgo(randomInt(rng, 60, 600)),
    ownerName: owner?.name ?? 'Propriétaire Maskani',
    ownerEmail: owner?.email ?? 'contact@maskani.ma',
    phone: `+212 5${randomInt(rng, 22, 39)} ${randomInt(rng, 10, 99)} ${randomInt(rng, 10, 99)} ${randomInt(rng, 10, 99)}`,
  }
}

export const ADMIN_AGENCIES: AdminAgency[] = AGENCY_NAMES.map((_, i) => buildAgency(i))
