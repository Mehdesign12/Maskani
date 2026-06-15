import { createRng, randomFloat, randomInt } from './seed'
import { ADMIN_LISTINGS } from './mock-immobilier'
import { ADMIN_PRODUITS } from './mock-ameublement'
import { ADMIN_PRESTATAIRES } from './mock-prestataires'
import type { CityStat, MonthlyMetric } from './types'

const MONTH_NAMES = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

const CURRENT_MONTH = 5 // Juin (0-indexé)
const CURRENT_YEAR = 2026

function buildMonth(index: number): MonthlyMetric {
  const offset = 11 - index
  let monthIdx = CURRENT_MONTH - offset
  let year = CURRENT_YEAR
  while (monthIdx < 0) {
    monthIdx += 12
    year -= 1
  }

  const rng = createRng(2000 + index * 41)
  const growth = index / 11

  const visites = Math.round(28000 + growth * 42000) + randomInt(rng, -3000, 3000)
  const revenuImmobilier = Math.round(1800000 + growth * 2600000) + randomInt(rng, -150000, 150000)
  const revenuAmeublement = Math.round(620000 + growth * 980000) + randomInt(rng, -60000, 60000)
  const revenuPrestataires = Math.round(340000 + growth * 510000) + randomInt(rng, -40000, 40000)
  const nouveauxUtilisateurs = Math.round(180 + growth * 420) + randomInt(rng, -20, 20)
  const conversionRate = 0.018 + growth * 0.01 + randomFloat(rng, -0.002, 0.002, 4)
  const conversions = Math.round(visites * conversionRate)

  return {
    month: `${MONTH_NAMES[monthIdx]} ${year}`,
    visites,
    revenuImmobilier,
    revenuAmeublement,
    revenuPrestataires,
    nouveauxUtilisateurs,
    conversions,
  }
}

export const MONTHLY_METRICS: MonthlyMetric[] = Array.from({ length: 12 }, (_, i) => buildMonth(i))

const ALL_CITIES = Array.from(new Set([
  ...ADMIN_LISTINGS.map((l) => l.city),
  ...ADMIN_PRODUITS.map((p) => p.city),
  ...ADMIN_PRESTATAIRES.map((p) => p.city),
]))

function buildCityStat(city: string, index: number): CityStat {
  const rng = createRng(2500 + index * 17)
  const listings = ADMIN_LISTINGS.filter((l) => l.city === city).length
  const produits = ADMIN_PRODUITS.filter((p) => p.city === city).length
  const prestataires = ADMIN_PRESTATAIRES.filter((p) => p.city === city).length
  const activity = listings * 3 + produits * 2 + prestataires * 4
  const visites = activity * randomInt(rng, 180, 420) + randomInt(rng, 500, 5000)

  return { city, listings, produits, prestataires, visites }
}

export const CITY_STATS: CityStat[] = ALL_CITIES
  .map((city, index) => buildCityStat(city, index))
  .sort((a, b) => b.visites - a.visites)
