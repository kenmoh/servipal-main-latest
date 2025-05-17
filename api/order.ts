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


/*


{
  "delivery": {
    "id": "5626efcf-60c8-4fec-b2f6-76d53477ef52",
    "delivery_type": "package",
    "delivery_status": "pending",
    "sender_id": "b7142dd0-4570-4a5b-9831-1f3df6e43388",
    "vendor_id": "b7142dd0-4570-4a5b-9831-1f3df6e43388",
    "dispatch_id": null,
    "rider_id": null,
    "distance": "30",
    "duration": "12",
    "pickup_coordinates": [
      5.66,
      8.99
    ],
    "dropoff_coordinates": [
      3,
      5.9
    ],
    "delivery_fee": "7500.00",
    "amount_due_dispatch": "6375.0000",
    "created_at": "2025-05-17T19:01:15.717270"
  },
  "order": {
    "id": "6551c4f2-5a38-4fb2-be86-9fa85e14807d",
    "user_id": "b7142dd0-4570-4a5b-9831-1f3df6e43388",
    "vendor_id": "b7142dd0-4570-4a5b-9831-1f3df6e43388",
    "order_type": "package",
    "total_price": "7500.00",
    "order_payment_status": "pending",
    "order_status": "pending",
    "amount_due_vendor": "0",
    "payment_link": "https://checkout-v2.dev-flutterwave.com/v3/hosted/pay/1167543ab6cc19b0d5b4",
    "order_items": [
      {
        "id": "7ffacb1c-a21c-4844-a388-3cab04c9d9c8",
        "user_id": "b7142dd0-4570-4a5b-9831-1f3df6e43388",
        "name": "string",
        "price": "0",
        "images": [
          {
            "id": "a4dd7e4c-04d8-47d9-baaf-282ae6982211",
            "item_id": "7ffacb1c-a21c-4844-a388-3cab04c9d9c8",
            "url": "https://mohdelivery.s3.amazonaws.com/6d313d98dfddca7efd8ff52e3dhand.jpg"
          }
        ],
        "description": "string",
        "quantity": 1
      }
    ]
  }
}
Response headers

*/
