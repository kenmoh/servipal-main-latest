import { apiClient } from "@/utils/client";
import { ApiResponse } from "apisauce";

export interface LoginSuccessResponse {
  access_token: string;
  token_type: string;
}

interface LoginErrorResponse {
  detail: string;
}
export const loginApi = async (
  username: string,
  password: string
): Promise<LoginSuccessResponse> => {
  const data = new FormData();
  data.append("username", username.trim());
  data.append("password", password.trim());

  const response: ApiResponse<LoginSuccessResponse | LoginErrorResponse> =
    await apiClient.post("/login", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

  if (!response.ok || !response.data || "detail" in response.data) {
    const errorMessage =
      response.data && "detail" in response.data
        ? response.data.detail.split(":")[1]
        : "Something went wrong. Please try again.";
    console.log(errorMessage, "=====================");
    throw new Error(errorMessage);
  }
  //   if (!response.ok) {
  //     throw new Error(response.data?.detail);
  //   }

  return response.data;
};
