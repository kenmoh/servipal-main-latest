import * as SecureStore from "expo-secure-store";
import jwtDecode from "jwt-decode";

const key = "authToken";

interface JWTPayload {
  exp: number;
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
    const decoded = jwtDecode.jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

const getUser = async () => {
  const token = await getToken();
  return token ? jwtDecode.jwtDecode(token) : null;
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
