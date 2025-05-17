import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

const key = "authToken";

interface JWTPayload {
  exp: number;
  iat: number;
  sub: string;
  account_status: "pending" | "confirmed";
  user_type: string;
}

const storeToken = async (authToken: string) => {
  try {
    await SecureStore.setItemAsync(key, authToken);
  } catch (error) {
    throw new Error("Error storing auth token", error!);
  }
};

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime + 60;
  } catch (error) {
    console.error("Token validation error:", error);
    return true;
  }
};

const getUser = async (): Promise<JWTPayload | null> => {
  const token = await getToken();
  try {
    return token ? jwtDecode<JWTPayload>(token) : null;
  } catch (error) {
    console.error("Error decoding user token:", error);
    return null;
  }
};

const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(key);
    if (!token) return null;

    // Check if token is expired
    if (isTokenExpired(token)) {
      await removeToken();
      return null;
    }

    return token;
  } catch (error) {
    throw new Error("Error getting auth token", error!);
  }
};

const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    throw new Error("Error deleting auth token", error!);
  }
};

export default {
  getToken,
  getUser,
  removeToken,
  storeToken,
};
