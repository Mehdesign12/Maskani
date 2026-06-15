import { PRESTATAIRES } from '@/lib/prestataires'
import { createRng, isoDateDaysAgo, pick, randomInt } from './seed'
import { ADMIN_LISTINGS } from './mock-immobilier'
import { ADMIN_PRODUITS } from './mock-ameublement'
import { ADMIN_USERS } from './mock-users'
import type { AdminReport, AdminReview, ReportStatus, ReportTargetType, ReviewStatus } from './types'

const REPORT_REASONS: Record<ReportTargetType, string[]> = {
  annonce: ['Annonce déjà vendue', 'Prix trompeur', 'Photos non conformes au bien', 'Annonce dupliquée'],
  produit: ['Produit non disponible', 'Description trompeuse', 'Prix incorrect', 'Photos non conformes'],
  prestataire: ['Ne répond pas', 'Tarifs non respectés', 'Comportement non professionnel', 'Profil suspect'],
  avis: ['Avis suspecté faux', 'Langage inapproprié', 'Conflit d\'intérêt', 'Hors sujet'],
  utilisateur: ['Profil suspect', 'Usurpation d\'identité', 'Spam répété', 'Comportement abusif'],
}

const REPORT_DETAILS: Record<ReportTargetType, string> = {
  annonce: "L'annonce ne correspond plus à la réalité du bien visité, le signalant demande une vérification.",
  produit: "Le client signale que le produit reçu ne correspond pas aux photos du catalogue.",
  prestataire: "Plusieurs tentatives de contact sans réponse depuis plus d'une semaine.",
  avis: "Cet avis semble avoir été posté par un compte lié au prestataire concerné.",
  utilisateur: "Ce compte a été signalé plusieurs fois pour comportement suspect par d'autres membres.",
}

const STATUS_WEIGHTS: { status: ReportStatus; weight: number }[] = [
  { status: 'en_attente', weight: 55 },
  { status: 'traite', weight: 30 },
  { status: 'rejete', weight: 15 },
]

function pickReportStatus(rng: () => number): ReportStatus {
  const total = STATUS_WEIGHTS.reduce((s, i) => s + i.weight, 0)
  let roll = rng() * total
  for (const item of STATUS_WEIGHTS) {
    if (roll < item.weight) return item.status
    roll -= item.weight
  }
  return 'en_attente'
}

function buildReport(index: number): AdminReport {
  const rng = createRng(8000 + index * 37)
  const targetType = pick(rng, ['annonce', 'produit', 'prestataire', 'avis', 'utilisateur'] as const)
  const reporter = pick(rng, ADMIN_USERS)

  let targetLabel = 'Élément Maskani'
  let targetHref: string | undefined

  switch (targetType) {
    case 'annonce': {
      const listing = pick(rng, ADMIN_LISTINGS)
      targetLabel = listing.title
      targetHref = `/admin/immobilier`
      break
    }
    case 'produit': {
      const produit = pick(rng, ADMIN_PRODUITS)
      targetLabel = produit.name
      targetHref = `/admin/ameublement`
      break
    }
    case 'prestataire': {
      const prestataire = pick(rng, PRESTATAIRES)
      targetLabel = prestataire.name
      targetHref = `/admin/prestataires`
      break
    }
    case 'avis': {
      const prestataire = pick(rng, PRESTATAIRES)
      targetLabel = `Avis sur ${prestataire.name}`
      targetHref = `/admin/prestataires`
      break
    }
    case 'utilisateur': {
      const user = pick(rng, ADMIN_USERS)
      targetLabel = user.name
      targetHref = `/admin/utilisateurs`
      break
    }
  }

  return {
    id: `RPT-${String(index + 1).padStart(4, '0')}`,
    targetType,
    targetLabel,
    targetHref,
    reporterName: reporter.name,
    reason: pick(rng, REPORT_REASONS[targetType]),
    details: REPORT_DETAILS[targetType],
    status: pickReportStatus(rng),
    createdAt: isoDateDaysAgo(randomInt(rng, 0, 60)),
  }
}

export const ADMIN_REPORTS: AdminReport[] = Array.from({ length: 24 }, (_, i) => buildReport(i))

export const REPORT_TYPE_LABELS: Record<ReportTargetType, string> = {
  annonce: 'Annonce',
  produit: 'Produit',
  prestataire: 'Prestataire',
  avis: 'Avis',
  utilisateur: 'Utilisateur',
}

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  en_attente: 'En attente',
  traite: 'Traité',
  rejete: 'Rejeté',
}

// ─────────────────────────────────────────────────────────────────────────
// AVIS (issus des prestataires + avis générés pour produits/agences)
// ─────────────────────────────────────────────────────────────────────────

const REVIEW_STATUS_WEIGHTS: { status: ReviewStatus; weight: number }[] = [
  { status: 'visible', weight: 80 },
  { status: 'signale', weight: 12 },
  { status: 'masque', weight: 8 },
]

function pickReviewStatus(rng: () => number): ReviewStatus {
  const total = REVIEW_STATUS_WEIGHTS.reduce((s, i) => s + i.weight, 0)
  let roll = rng() * total
  for (const item of REVIEW_STATUS_WEIGHTS) {
    if (roll < item.weight) return item.status
    roll -= item.weight
  }
  return 'visible'
}

const PRESTATAIRE_REVIEWS: AdminReview[] = PRESTATAIRES.flatMap((p, pIndex) =>
  p.reviews.map((review, rIndex) => {
    const rng = createRng(9000 + pIndex * 53 + rIndex * 7)
    return {
      id: `REV-P-${pIndex}-${rIndex}`,
      targetType: 'prestataire' as const,
      targetName: p.name,
      targetHref: '/admin/prestataires',
      author: review.author,
      rating: review.rating,
      text: review.text,
      date: review.date,
      status: pickReviewStatus(rng),
    }
  })
)

const PRODUIT_SAMPLE_TEXTS = [
  'Livraison rapide et produit conforme à la description, je recommande.',
  'Très bonne qualité de fabrication, exactement ce que je cherchais pour mon salon.',
  "Le produit est joli mais la livraison a pris plus de temps qu'annoncé.",
  'Le vendeur a été très réactif sur WhatsApp, échange fluide.',
  'Couleur légèrement différente des photos mais globalement satisfait.',
]

const PRODUIT_REVIEWS: AdminReview[] = ADMIN_PRODUITS.slice(0, 16).map((produit, index) => {
  const rng = createRng(9500 + index * 11)
  const reviewer = pick(rng, ADMIN_USERS)
  return {
    id: `REV-PR-${index}`,
    targetType: 'produit' as const,
    targetName: produit.name,
    targetHref: '/admin/ameublement',
    author: reviewer.name,
    rating: randomInt(rng, 3, 5),
    text: pick(rng, PRODUIT_SAMPLE_TEXTS),
    date: new Date(isoDateDaysAgo(randomInt(rng, 1, 120))).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    status: pickReviewStatus(rng),
  }
})

export const ADMIN_REVIEWS: AdminReview[] = [...PRESTATAIRE_REVIEWS, ...PRODUIT_REVIEWS]

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  visible: 'Visible',
  signale: 'Signalé',
  masque: 'Masqué',
}
