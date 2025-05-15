import { create } from 'zustand'

type Coordinates = [number, number]

interface LocationStore {
  origin: string
  originCoords: Coordinates | null
  destination: string
  destinationCoords: Coordinates | null

  setOrigin: (address: string, coords: Coordinates) => void
  setDestination: (address: string, coords: Coordinates) => void
  reset: () => void
}

export const useLocationStore = create<LocationStore>((set, get) => ({
  origin: '',
  originCoords: null,
  destination: '',
  destinationCoords: null,

  setOrigin: (address, coords) => {
    const { origin, originCoords } = get()
    const coordsChanged = !originCoords || originCoords[0] !== coords[0] || originCoords[1] !== coords[1]
    if (origin !== address || coordsChanged) {
      set({ origin: address, originCoords: coords })
    }
  },

  setDestination: (address, coords) => {
    const { destination, destinationCoords } = get()
    const coordsChanged = !destinationCoords || destinationCoords[0] !== coords[0] || destinationCoords[1] !== coords[1]
    if (destination !== address || coordsChanged) {
      set({ destination: address, destinationCoords: coords })
    }
  },

  reset: () =>
    set({
      origin: '',
      originCoords: null,
      destination: '',
      destinationCoords: null,
    }),
}))

