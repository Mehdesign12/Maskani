const BASE_DATE = new Date('2026-06-15T09:00:00Z')

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-MA').format(Math.round(value))
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('fr-MA', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export function formatMAD(value: number): string {
  return `${formatNumber(value)} MAD`
}

export function formatCompactMAD(value: number): string {
  return `${formatCompactNumber(value)} MAD`
}

export function formatPriceFromCentimes(value: number): string {
  return formatMAD(Math.round(value / 100))
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  const days = Math.floor((BASE_DATE.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (days <= 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  if (days < 30) return `Il y a ${days} jours`

  const months = Math.floor(days / 30)
  if (months < 12) return `Il y a ${months} mois`

  const years = Math.floor(months / 12)
  return `Il y a ${years} an${years > 1 ? 's' : ''}`
}
