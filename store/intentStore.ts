import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserIntent = 'immobilier' | 'prestataires' | 'ameublement'

interface IntentState {
  intent: UserIntent | null
  hasOnboarded: boolean
  setIntent: (intent: UserIntent) => void
  dismiss: () => void
  reopen: () => void
}

export const useIntentStore = create<IntentState>()(
  persist(
    (set) => ({
      intent: null,
      hasOnboarded: false,
      setIntent: (intent) => set({ intent, hasOnboarded: true }),
      dismiss: () => set({ hasOnboarded: true }),
      reopen: () => set({ hasOnboarded: false }),
    }),
    { name: 'maskani-intent' }
  )
)
