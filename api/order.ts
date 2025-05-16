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

type DeliveryType = "food" | "laundry" | "package";

// Fetch Deliveries
export const fetchDeliveries = async (
  deliveryType: DeliveryType,
  skip: number = 0,
  limit: number = 25
): Promise<DeliveryDetail[]> => {
  const params = new URLSearchParams({
    delivery_type: deliveryType?.toString(),
    skip: skip.toString(),
    limit: limit.toString(),
  });
  try {
    const response: ApiResponse<DeliveryDetail[] | ErrorResponse> =
      await apiClient.get(`${BASE_URL}/deliveries?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

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
  data.append("duration", itemData.duration);
  data.append("pickup_coordinates", itemData.pickup_coordinates.toString());
  data.append("dropoff_coordinates", itemData.dropoff_coordinates.toString());
  data.append("distance", itemData.distance.toString());

  // Handle multiple images
  if (itemData.imageUrl && itemData.imageUrl.length > 0) {
    itemData.imageUrl.forEach((image, index) => {
      data.append("images", {
        uri: image.url,
        type: "image/jpeg",
        name: `image_${index}.jpg`,
      } as any);
    });
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
export const createCategory = async (
  vendorId: string,
  orderData: OrderFoodOLaundry
): Promise<OrderResponse> => {
  const data = {
    order_items: orderData.order_items,
    pickup_coordinates: orderData.pickup_coordinates,
    dropoff_coordinates: orderData.dropoff_coordinates,
    distance: orderData.distance,
    require_delivery: orderData.require_delivery,
    duration: orderData.duration,
    additional_info: orderData.additional_info,
  };
  try {
    const response: ApiResponse<OrderResponse | ErrorResponse> =
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
