// import { create } from "zustand";
// import * as Location from "expo-location";

// type Coordinates = [number, number];

// interface LocationStore {
//   origin: string;
//   originCoords: Coordinates | null;
//   destination: string;
//   destinationCoords: Coordinates | null;

//   setOrigin: (address: string, coords: Coordinates) => void;
//   setDestination: (address: string, coords: Coordinates) => void;
//   reset: () => void;
//   getCurrentLocation: () => Promise<{
//     coords: Coordinates;
//     address: string;
//   } | null>;
// }

// export const useLocationStore = create<LocationStore>((set, get) => ({
//   origin: "",
//   originCoords: null,
//   destination: "",
//   destinationCoords: null,

//   setOrigin: (address, coords) => {
//     const { origin, originCoords } = get();
//     const coordsChanged =
//       !originCoords ||
//       originCoords[0] !== coords[0] ||
//       originCoords[1] !== coords[1];
//     if (origin !== address || coordsChanged) {
//       set({ origin: address, originCoords: coords });
//     }
//   },

//   setDestination: (address, coords) => {
//     const { destination, destinationCoords } = get();
//     const coordsChanged =
//       !destinationCoords ||
//       destinationCoords[0] !== coords[0] ||
//       destinationCoords[1] !== coords[1];
//     if (destination !== address || coordsChanged) {
//       set({ destination: address, destinationCoords: coords });
//     }
//   },

//   reset: () =>
//     set({
//       origin: "",
//       originCoords: null,
//       destination: "",
//       destinationCoords: null,
//     }),

//   getCurrentLocation: async () => {
//     try {
//       // Request permission
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         return null;
//       }

//       // Get current position
//       const location = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude } = location.coords;

//       // Reverse geocode to get address
//       const [result] = await Location.reverseGeocodeAsync({
//         latitude,
//         longitude,
//       });

//       if (result) {
//         const address = [
//           result.street,
//           result.city,
//           result.region,
//           result.country,
//         ]
//           .filter(Boolean)
//           .join(", ");

//         console.log(address);

//         return {
//           coords: [latitude, longitude],
//           address,
//         };
//       }
//       return null;
//     } catch (error) {
//       console.error("Error getting location:", error);
//       return null;
//     }
//   },
// }));

import { create } from "zustand";
import * as Location from "expo-location";

interface LocationStore {
  origin: string | null;
  destination: string | null;
  originCoords: [number, number] | null;
  destinationCoords: [number, number] | null;
  setOrigin: (address: string, coords: [number, number]) => void;
  setDestination: (address: string, coords: [number, number]) => void;
  getCurrentLocation: () => Promise<{
    coords: [number, number];
    address: string;
  } | null>;
}

export const useLocationStore = create<LocationStore>((set) => ({
  origin: null,
  destination: null,
  originCoords: null,
  destinationCoords: null,

  setOrigin: (address, coords) => {
    set({ origin: address, originCoords: coords });
  },

  setDestination: (address, coords) => {
    set({ destination: address, destinationCoords: coords });
  },

  getCurrentLocation: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return null;

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const [result] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result) {
        const address = [
          result.street,
          result.district,
          result.city,
          result.region,
        ]
          .filter(Boolean)
          .join(", ");

        return {
          coords: [latitude, longitude],
          address,
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  },
}));
