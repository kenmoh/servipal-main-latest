import {
  CompanyProfile,
  Profile,
  RiderResponse,
  UserProfileUpdate,
} from "@/types/user-types";
import { apiClient } from "@/utils/client";
import { ApiResponse } from "apisauce";
import { ErrorResponse } from "./auth";

export interface ImageData {
  uri: string;
  type: string;
  name: string;
}

interface ImageUpload {
  profile_image_url?: ImageData | null;
  backdrop_image_url?: ImageData | null;
}


const BASE_URL = "/users"; // Replace with your actual base URL

// Get current logged in user
export const getCurrentUser = async (userId: string): Promise<Profile> => {
  try {
    const response: ApiResponse<Profile | ErrorResponse> = await apiClient.get(
      `${BASE_URL}/${userId}/profile`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
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
  userData: UserProfileUpdate,
): Promise<Profile> => {
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
    const response: ApiResponse<Profile | ErrorResponse> = await apiClient.put(
      `${BASE_URL}/profile`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
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


// upload profile
export const uploadProfileImage = async (
  imageData: ImageUpload
): Promise<ImageUpload> => {
  const formData = new FormData();
  
  // Only append images that exist
  if (imageData.profile_image_url) {
    formData.append('profile_image_url', {
      uri: imageData.profile_image_url.uri,
      type: imageData.profile_image_url.type,
      name: imageData.profile_image_url.name,
    } as any);
  }
  
  if (imageData.backdrop_image_url) {
    formData.append('backdrop_image_url', {
      uri: imageData.backdrop_image_url.uri,
      type: imageData.backdrop_image_url.type,
      name: imageData.backdrop_image_url.name,
    } as any);
  }

  try {
    const response: ApiResponse<ImageUpload | ErrorResponse> = await apiClient.put(
      `${BASE_URL}/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": 'multipart/form-data',
        },
      },
    );
    
    if (!response.ok || !response.data || "detail" in response.data) {
      const errorMessage =
        response.data && "detail" in response.data
          ? response.data.detail
          : "Error uploading images.";
      throw new Error(errorMessage);
    }
    
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};
