import {
  CompanyProfile,
  CurrentUserDetails,
  Prfile,
  RiderResponse,
  UserDetails,
  UserProfileUpdate,
} from "@/types/user-types";
import { apiClient } from "@/utils/client";
import { ApiResponse } from "apisauce";
import { ErrorResponse } from "./auth";

const BASE_URL = "/users"; // Replace with your actual base URL

// Get current logged in user
export const getCurrentUser = async (): Promise<UserDetails> => {
  try {
    const response: ApiResponse<UserDetails | ErrorResponse> =
      await apiClient.get(`${BASE_URL}/profile}`, {
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
// Get current logged in user riders
export const getCurrentDispatchRiders = async (): Promise<RiderResponse[]> => {
  try {
    const response: ApiResponse<RiderResponse[] | ErrorResponse> =
      await apiClient.get(`${BASE_URL}/riders`, {
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

// Fetch restaurants
export const fetchRestaurants = async (): Promise<CompanyProfile[]> => {
  try {
    const response: ApiResponse<CompanyProfile[] | ErrorResponse> =
      await apiClient.get(`${BASE_URL}/restaurants`, {
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
export const updateCurrentVendorUser = async (
  userData: UserProfileUpdate
): Promise<Prfile> => {
  const data = {
    phone_number: userData.phoneNumber,
    bank_name: userData.bankName,
    bank_account_number: userData.accountNumber,
    business_name: userData.companyName,
    business_registration_number: userData.companyRegNo,
    business_address: userData.location,
    closing_hours: userData.closingHour,
    opening_hours: userData.openingHour,
  };
  try {
    const response: ApiResponse<Prfile | ErrorResponse> = await apiClient.put(
      `${BASE_URL}/profile`,
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
