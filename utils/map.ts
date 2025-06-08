import { mapboxClient } from "./client";

interface MapboxRoute {
  geometry: {
    coordinates: number[][];
    type: string;
  };
  distance: number;
  duration: number;
}

interface MapboxDirectionsResponse {
  routes: MapboxRoute[];
  waypoints: any[];
  code: string;
  uuid: string;
}

/**
 * Gets directions using Mapbox API with Google-formatted coordinates
 * @param origin Google coordinates [lat, lng]
 * @param destination Google coordinates [lat, lng]
 * @returns Promise<number[][]> Array of coordinates for the route
 */
export const getDirections = async (
  origin: [number, number],
  destination: [number, number]
): Promise<number[][]> => {
  try {
    const mapboxOrigin: [number, number] = [origin[1], origin[0]];
    const mapboxDestination: [number, number] = [
      destination[1],
      destination[0],
    ];

    const response = await mapboxClient.get<MapboxDirectionsResponse>(
      `/directions/v5/mapbox/driving/${mapboxOrigin[0]},${mapboxOrigin[1]};${mapboxDestination[0]},${mapboxDestination[1]}?access_token=${process.env.EXPO_PUBLIC_MAPBOX_KEY}&geometries=geojson`
    );

    if (!response.data?.routes?.[0]?.geometry?.coordinates) {
      throw new Error("No route found");
    }

    return response.data.routes[0].geometry.coordinates.map(
      (coord: number[]): [number, number] => [coord[1], coord[0]]
    );
  } catch (error) {
    console.error("Error fetching directions:", error);
    return [];
  }
};
