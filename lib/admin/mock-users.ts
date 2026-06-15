import { createRng, isoDateDaysAgo, pick, randomFloat, randomInt } from './seed'
import type { AdminUser, AdminUserRole, AdminUserStatus, SubscriptionPlan } from './types'

const FIRST_NAMES = [
  'Yassine', 'Sara', 'Mehdi', 'Imane', 'Omar', 'Leila', 'Hamza', 'Nadia', 'Karim', 'Salma',
  'Rachid', 'Sofia', 'Anas', 'Lina', 'Younes', 'Houda', 'Adil', 'Zineb', 'Tarik', 'Meryem',
  'Bilal', 'Asmae', 'Walid', 'Hajar', 'Reda', 'Khadija', 'Amine', 'Fatima Zahra', 'Soufiane', 'Ghita',
  'Othmane', 'Nawal', 'Ismail', 'Rania', 'Driss', 'Ibtissam', 'Fouad', 'Chaima', 'Nabil', 'Yasmine',
]

const LAST_NAMES = [
  'El Mansouri', 'Benali', 'Tazi', 'Alaoui', 'Bennani', 'Idrissi', 'Chraibi', 'Berrada', 'El Fassi', 'Lahlou',
  'Saidi', 'Benkirane', 'Moussaoui', 'Cherkaoui', 'El Amrani', 'Ouazzani', 'Ziani', 'Belhaj', 'Squalli', 'Toumi',
]

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir', 'Meknès', 'Oujda', 'Salé', 'Kénitra']

const ROLE_WEIGHTS: { role: AdminUserRole; weight: number }[] = [
  { role: 'particulier', weight: 46 },
  { role: 'agence', weight: 14 },
  { role: 'prestataire', weight: 12 },
  { role: 'vendeur', weight: 10 },
  { role: 'promoteur', weight: 4 },
  { role: 'admin', weight: 2 },
]

const STATUS_WEIGHTS: { status: AdminUserStatus; weight: number }[] = [
  { status: 'actif', weight: 80 },
  { status: 'en_attente', weight: 12 },
  { status: 'suspendu', weight: 8 },
]

const SUBSCRIPTION_WEIGHTS: { plan: SubscriptionPlan; weight: number }[] = [
  { plan: 'free', weight: 60 },
  { plan: 'basic', weight: 20 },
  { plan: 'pro', weight: 15 },
  { plan: 'enterprise', weight: 5 },
]

function weightedPick<T extends { weight: number }>(rng: () => number, items: T[]): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0)
  let roll = rng() * total
  for (const item of items) {
    if (roll < item.weight) return item
    roll -= item.weight
  }
  return items[items.length - 1]
}

function buildUser(index: number): AdminUser {
  const rng = createRng(1000 + index * 17)
  const firstName = pick(rng, FIRST_NAMES)
  const lastName = pick(rng, LAST_NAMES)
  const name = `${firstName} ${lastName}`
  const role = weightedPick(rng, ROLE_WEIGHTS).role
  const status = weightedPick(rng, STATUS_WEIGHTS).status
  const subscription = weightedPick(rng, SUBSCRIPTION_WEIGHTS).plan
  const city = pick(rng, CITIES)
  const joinedDaysAgo = randomInt(rng, 5, 720)
  const lastActiveDaysAgo = randomInt(rng, 0, Math.min(joinedDaysAgo, 30))

  return {
    id: `USR-${String(index + 1).padStart(4, '0')}`,
    name,
    email: `${firstName.toLowerCase().replace(/\s+/g, '.')}.${lastName.toLowerCase().replace(/\s+/g, '')}@${role === 'admin' ? 'maskani.ma' : 'gmail.com'}`,
    phone: `+212 6${randomInt(rng, 10, 99)} ${randomInt(rng, 100, 999)} ${randomInt(rng, 100, 999)}`,
    avatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
    role,
    status,
    isVerified: role === 'admin' ? true : rng() > 0.4,
    city,
    subscription: role === 'particulier' ? 'free' : subscription,
    joinedAt: isoDateDaysAgo(joinedDaysAgo),
    lastActiveAt: isoDateDaysAgo(lastActiveDaysAgo),
    listingsCount: role === 'agence' || role === 'promoteur' ? randomInt(rng, 2, 48) : role === 'particulier' ? randomInt(rng, 0, 3) : 0,
    produitsCount: role === 'vendeur' ? randomInt(rng, 4, 60) : 0,
    servicesCount: role === 'prestataire' ? randomInt(rng, 1, 6) : 0,
    rating: role === 'agence' || role === 'prestataire' || role === 'vendeur' ? randomFloat(rng, 3.8, 5.0) : undefined,
  }
}

export const ADMIN_USERS: AdminUser[] = Array.from({ length: 64 }, (_, i) => buildUser(i))

export const ROLE_LABELS: Record<AdminUserRole, string> = {
  particulier: 'Particulier',
  agence: 'Agence',
  promoteur: 'Promoteur',
  prestataire: 'Prestataire',
  vendeur: 'Vendeur ameublement',
  admin: 'Admin',
}

export const STATUS_LABELS: Record<AdminUserStatus, string> = {
  actif: 'Actif',
  suspendu: 'Suspendu',
  en_attente: 'En attente',
}
