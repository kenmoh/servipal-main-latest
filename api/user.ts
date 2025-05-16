import { CurrentUserDetails, Prfile } from "@/types/user-types";
import { apiClient } from "@/utils/client";
import { ApiResponse } from "apisauce";
import { ErrorResponse } from "./auth";

// Get current logged in user
export const getCurrentUser = async (): Promise<CurrentUserDetails> => {
  try {
    const response: ApiResponse<CurrentUserDetails | ErrorResponse> =
      await apiClient.get("/users/profile", {
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error loading user profile.";
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

// Update current user
export const updateCurrentUser = async (userData: Prfile): Promise<Prfile> => {
  const data = {
    full_name: userData.full_name || "",
    phone_number: userData.phone_number,
    bank_name: userData.bank_name || "",
    bank_account_number: userData.bank_account_number || "",
    bike_number: userData.bike_number || "",
    business_name: userData.business_name || "",
    business_redistration_number: userData.business_redistration_number || "",
    business_address: userData.business_address || "",
    closing_hours: userData.closing_hours || "",
    openning_hours: userData.openning_hours || "",
  };
  try {
    const response: ApiResponse<Prfile | ErrorResponse> = await apiClient.put(
      "/users/profile",
      data,
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
          : "Error loading user profile.";
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
