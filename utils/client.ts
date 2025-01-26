import { create } from "apisauce";

// import authStorage from "@/storage/authStorage";

export const apiClient = create({
  baseURL: "https://quickpickup.onrender.com/api",
});

// apiClient.addAsyncRequestTransform(async (request) => {
//   const authToken = await authStorage.getToken();
//   if (!authToken) return;
//   request.headers!["Authorization"] = "Bearer " + authToken;
// });
