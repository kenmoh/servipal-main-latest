import * as SecureStore from "expo-secure-store";
import jwtDecode from "jwt-decode";

const key = "authToken";

const storeToken = async (authToken: string) => {
  try {
    await SecureStore.setItemAsync(key, authToken);
  } catch (error) {
    throw new Error("Error storing auth token", error!);
  }
};

const getUser = async () => {
  const token = await getToken();
  return token ? jwtDecode.jwtDecode(token) : null;
};

const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(key);
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
