import { apiClient } from "@/utils/client";
import { ApiResponse } from "apisauce";
import { ErrorResponse } from "./auth";
import {
  CreateReview,
  DeliveryDetail,
  OrderFoodOLaundry,
  OrderResponse,
  SendItem,
} from "@/types/order-types";

const BASE_URL = "/orders";

export type DeliveryType = "food" | "laundry" | "package";

interface FetchDeliveriesParams {
  deliveryType?: DeliveryType;
  skip?: number;
  limit?: number;
}

// Fetch Deliveries
export const fetchDeliveries = async ({
  deliveryType,
  skip = 0,
  limit = 25,
}: FetchDeliveriesParams = {}): Promise<DeliveryDetail[]> => {
  const params = new URLSearchParams();

  if (deliveryType) {
    params.append("delivery_type", deliveryType.toString());
  }
  if (typeof skip === "number") {
    params.append("skip", skip.toString());
  }
  if (typeof limit === "number") {
    params.append("limit", limit.toString());
  }
  try {
    const response: ApiResponse<DeliveryDetail[] | ErrorResponse> =
      await apiClient.get(
        `${BASE_URL}/deliveries${
          params.toString() ? `?${params.toString()}` : ""
        }`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error fetching deliveries.";
      throw new Error(errorMessage);
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Fetch Delivery
export const fetchDelivery = async (
  deliveryId: string
): Promise<DeliveryDetail> => {
  try {
    const response: ApiResponse<DeliveryDetail | ErrorResponse> =
      await apiClient.get(`${BASE_URL}/${deliveryId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error fetching delivery.";
      throw new Error(errorMessage);
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Send Item
export const sendItem = async (itemData: SendItem): Promise<DeliveryDetail> => {
  const data = new FormData();
  data.append("name", itemData.name);
  data.append("description", itemData.description);
  data.append("origin", itemData.origin);
  data.append("destination", itemData.destination);
  data.append("duration", itemData.duration);

  // Format coordinates without array brackets
  if (itemData.pickup_coordinates) {
    const [lat, lng] = itemData.pickup_coordinates;
    data.append("pickup_coordinates", `${lat}, ${lng}`);
  }

  if (itemData.dropoff_coordinates) {
    const [lat, lng] = itemData.dropoff_coordinates;
    data.append("dropoff_coordinates", `${lat}, ${lng}`);
  }
  data.append("distance", itemData.distance?.toString());

  // Handle image
  if (itemData.imageUrl) {
    const imageInfo = {
      uri: itemData.imageUrl,
      type: "image/jpeg",
      name: `image-${Date.now()}.jpg`,
    };
    data.append("image_url", imageInfo as any);
  }

  try {
    const response: ApiResponse<DeliveryDetail | ErrorResponse> =
      await apiClient.post(`${BASE_URL}/send-item`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error creating item. Please try again later.";
      throw new Error(errorMessage);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Order Food/Laundry
export const createOrder = async (
  vendorId: string,
  orderData: OrderFoodOLaundry
): Promise<DeliveryDetail> => {
  const data = {
    order_items: orderData.order_items,
    pickup_coordinates: orderData.pickup_coordinates,
    dropoff_coordinates: orderData.dropoff_coordinates,
    distance: orderData.distance,
    require_delivery: orderData.require_delivery,
    duration: orderData.duration,
    origin: orderData.origin,
    destination: orderData.destination,
    additional_info: orderData.additional_info,
  };
  try {
    const response: ApiResponse<DeliveryDetail | ErrorResponse> =
      await apiClient.post(`${BASE_URL}/${vendorId}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error creating category.";
      throw new Error(errorMessage);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Confirm Item Received by sender
export const senderConirmDeliveryReceived = async (
  deliveryId: string
): Promise<DeliveryDetail> => {
  try {
    const response: ApiResponse<DeliveryDetail | ErrorResponse> =
      await apiClient.put(`${BASE_URL}/${deliveryId}/confirm-delivery`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error confirming delivery.";
      throw new Error(errorMessage);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Rider Update delivery status
export const riderUpdateDeliveryStatus = async (
  deliveryId: string
): Promise<DeliveryDetail> => {
  try {
    const response: ApiResponse<DeliveryDetail | ErrorResponse> =
      await apiClient.put(`${BASE_URL}/${deliveryId}/update-delivery-status`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error updating delivery.";
      throw new Error(errorMessage);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Rider Update delivery status
export const cancelDelivery = async (
  deliveryId: string
): Promise<DeliveryDetail> => {
  try {
    const response: ApiResponse<DeliveryDetail | ErrorResponse> =
      await apiClient.put(`${BASE_URL}/${deliveryId}/cancel-delivery`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error canelling delivery.";
      throw new Error(errorMessage);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Create review
export const createReview = async (
  orderId: string,
  revData: CreateReview
): Promise<CreateReview> => {
  const data = {
    rating: revData.rating,
    comment: revData.comment,
  };
  try {
    const response: ApiResponse<CreateReview | ErrorResponse> =
      await apiClient.post(`${BASE_URL}/${orderId}/review`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error creating review. Please try again";
      throw new Error(errorMessage);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};
interface DistanceResponse {
  distance: number;
  duration: string;
}

export const getTravelDistance = async (
  userLat: number,
  userLng: number,
  destinationLat: number,
  destinationLng: number
): Promise<number | null> => {
  try {
    const origin = `${userLat},${userLng}`;
    const destination = `${destinationLat},${destinationLng}`;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&units=metric&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    const distanceInMeters = data?.rows?.[0]?.elements?.[0]?.distance?.value;

    if (distanceInMeters) {
      // Convert meters to kilometers
      return distanceInMeters / 1000;
    }

    console.log(distanceInMeters, "================");

    return null;
  } catch (error) {
    console.error("Error calculating travel distance:", error);
    return null;
  }
};
