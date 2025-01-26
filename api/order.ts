import { ApiResponse, Order } from "@/types/order-types";
import { apiClient } from "@/utils/client";

const endpoint = "/orders";

// get package details
export const orderItemDetails = async (orderId: string) => {
  const response = await apiClient.get<Order>(
    `${endpoint}/${orderId}/delivery-order-details`
  );
  if (!response.ok) {
    throw new Error(response.problem);
  }

  return response.data;
};

// Get all item orders
export const getItemOrders = async () => {
  const response = await apiClient.get<ApiResponse>(
    `${endpoint}/delivery-orders`
  );

  if (!response.ok) {
    throw new Error(response.problem);
  }

  return response.data;
};
