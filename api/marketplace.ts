import { apiClient } from "@/utils/client";
import { ApiResponse } from "apisauce";
import { ErrorResponse } from "./auth";
import { BuyItemResponse, BuyItem } from "@/types/marketplace";

const BASE_URL = "/marketplace";

// Fetch Vendor Items
export const fetchVendorItems = async (
  Vendor_id: string
): Promise<MenuItem[]> => {
  try {
    const response: ApiResponse<MenuItem[] | ErrorResponse> =
      await apiClient.get(`/items/${Vendor_id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error fetching vendour items.";
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

// Fetch items
export const buyItem = async (
  productId: string
): Promise<BuyItemResponse[]> => {
  try {
    const response: ApiResponse<BuyItemResponse[] | ErrorResponse> =
      await apiClient.get(`${BASE_URL}/${productId}/buy`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error fetching categories.";
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
