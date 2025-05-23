import { UserDetails } from "@/types/user-types";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

const profileKey = "userProfile";
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

const storeProfile = async (profile: UserDetails) => {
  try {
    const profileString = JSON.stringify(profile);
    await SecureStore.setItemAsync(profileKey, profileString);
  } catch (error) {
    console.error("Error storing user profile:", error);
    throw new Error("Error storing user profile");
  }
};

const getProfile = async (): Promise<UserDetails | null> => {
  try {
    const profileString = await SecureStore.getItemAsync(profileKey);
    if (!profileString) return null;
    return JSON.parse(profileString) as UserDetails;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

const removeProfile = async () => {
  try {
    await SecureStore.deleteItemAsync(profileKey);
  } catch (error) {
    console.error("Error removing user profile:", error);
    throw new Error("Error removing user profile");
  }
};

export default {
  getToken,
  getUser,
  removeToken,
  storeToken,
  getProfile,
  removeProfile,
  storeProfile,
};
