import { PRODUITS } from '@/lib/produits'
import { CATEGORY_META } from '@/lib/category-meta'
import { createRng, isoDateDaysAgo, pick, randomInt } from './seed'
import type { AdminProduit, AdminProduitStatus, AdminVendor } from './types'

const STATUS_WEIGHTS: { status: AdminProduitStatus; weight: number }[] = [
  { status: 'en_ligne', weight: 70 },
  { status: 'en_attente', weight: 18 },
  { status: 'masque', weight: 12 },
]

function pickStatus(rng: () => number): AdminProduitStatus {
  const total = STATUS_WEIGHTS.reduce((s, i) => s + i.weight, 0)
  let roll = rng() * total
  for (const item of STATUS_WEIGHTS) {
    if (roll < item.weight) return item.status
    roll -= item.weight
  }
  return 'en_ligne'
}

const BRAND_NAMES = Array.from(new Set(PRODUITS.map((p) => p.brand)))
const BRAND_TO_VENDOR_ID = new Map(BRAND_NAMES.map((brand, i) => [brand, `VND-${String(i + 1).padStart(3, '0')}`]))

export const ADMIN_PRODUITS: AdminProduit[] = PRODUITS.map((produit, index) => {
  const rng = createRng(3000 + index * 13)

  return {
    id: `PRD-${String(index + 1).padStart(4, '0')}`,
    slug: produit.slug,
    name: produit.name,
    category: produit.category,
    style: produit.style,
    brand: produit.brand,
    city: produit.city,
    price: produit.price,
    oldPrice: produit.oldPrice,
    images: produit.images,
    inStock: produit.inStock,
    stockQty: produit.inStock ? randomInt(rng, 1, 80) : 0,
    isNew: produit.isNew,
    isBestSeller: produit.isBestSeller,
    rating: produit.rating,
    reviewCount: produit.reviewCount,
    salesCount: randomInt(rng, 0, 340),
    status: pickStatus(rng),
    vendorId: BRAND_TO_VENDOR_ID.get(produit.brand) ?? 'VND-000',
    vendorName: produit.brand,
    createdAt: isoDateDaysAgo(randomInt(rng, 5, 380)),
  }
})

export const PRODUIT_STATUS_LABELS: Record<AdminProduitStatus, string> = {
  en_ligne: 'En ligne',
  en_attente: 'En attente',
  masque: 'Masqué',
}

const CITIES = ['Casablanca', 'Marrakech', 'Rabat', 'Fès', 'Safi', 'Tanger', 'Agadir']

function buildVendor(name: string, index: number): AdminVendor {
  const rng = createRng(4000 + index * 19)
  const id = BRAND_TO_VENDOR_ID.get(name)!
  const products = ADMIN_PRODUITS.filter((p) => p.vendorId === id)
  const mainCategory = products[0]?.category ?? pick(rng, Object.keys(CATEGORY_META))

  return {
    id,
    name,
    city: pick(rng, CITIES),
    mainCategory,
    productsCount: products.length,
    rating: Number((4 + rng() * 0.9).toFixed(1)),
    isVerified: rng() > 0.35,
    salesTotal: products.reduce((sum, p) => sum + p.salesCount * p.price, 0),
    createdAt: isoDateDaysAgo(randomInt(rng, 60, 500)),
  }
}

export const ADMIN_VENDORS: AdminVendor[] = BRAND_NAMES.map((name, i) => buildVendor(name, i))
