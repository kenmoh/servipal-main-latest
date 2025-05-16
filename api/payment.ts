import { apiClient } from "@/utils/client";
import { ApiResponse } from "apisauce";
import { ErrorResponse } from "./auth";

interface Amount {
  amount: number;
}

export const fundWallet = async (payData: Amount): Promise<Amount> => {
  const data = {
    amount: payData.amount,
  };
  try {
    const response: ApiResponse<Amount | ErrorResponse> = await apiClient.post(
      "/payment/und-wallet",
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
