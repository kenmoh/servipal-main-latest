import { CompanyResponse } from "@/types/user-types";
import { apiClient } from "@/utils/client";

const endpoint = "/users";
export const getUsersByMealCategory = async () => {
  const response = await apiClient.get<CompanyResponse>(
    `${endpoint}/get-user-by-meal-category`
  );
  if (!response.ok) {
    throw new Error(response.problem);
  }

  return response.data;
};
