// Deterministic pseudo-random generator — keeps mock data stable between
// server and client renders (avoids hydration mismatches from Math.random()).
export function createRng(seed: number) {
  let state = seed % 2147483647
  if (state <= 0) state += 2147483646

  return function next(): number {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

export function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]
}

export function pickMany<T>(rng: () => number, items: readonly T[], count: number): T[] {
  const pool = [...items]
  const result: T[] = []
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length)
    result.push(pool[idx])
    pool.splice(idx, 1)
  }
  return result
}

export function randomInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

export function randomFloat(rng: () => number, min: number, max: number, decimals = 1): number {
  const value = rng() * (max - min) + min
  return Number(value.toFixed(decimals))
}

export function isoDateDaysAgo(daysAgo: number): string {
  const date = new Date('2026-06-15T09:00:00Z')
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}
