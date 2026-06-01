import { create } from 'zustand'
import type { MapBounds } from '@/types/search'

interface MapViewport {
  longitude: number
  latitude: number
  zoom: number
}

interface MapState {
  viewport: MapViewport
  bounds: MapBounds | null
  hoveredListingId: string | null
  selectedListingId: string | null

  setViewport: (viewport: Partial<MapViewport>) => void
  setBounds: (bounds: MapBounds) => void
  setHoveredListing: (id: string | null) => void
  setSelectedListing: (id: string | null) => void
}

export const useMapStore = create<MapState>((set) => ({
  viewport: {
    longitude: -7.09,
    latitude: 31.79,
    zoom: 5.5,
  },
  bounds: null,
  hoveredListingId: null,
  selectedListingId: null,

  setViewport: (viewport) =>
    set((state) => ({ viewport: { ...state.viewport, ...viewport } })),

  setBounds: (bounds) => set({ bounds }),

  setHoveredListing: (id) => set({ hoveredListingId: id }),

  setSelectedListing: (id) => set({ selectedListingId: id }),
}))
