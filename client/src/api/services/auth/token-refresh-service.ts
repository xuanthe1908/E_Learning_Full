import axios from "axios";
import CONFIG_KEYS from "../../../config";

// Use a separate axios instance for refresh token to avoid interceptor loop
const refreshApi = axios.create({
  baseURL: CONFIG_KEYS.API_BASE_URL,
});

export const refreshTokenService = async (
  endpoint: string,
  refreshToken: string
) => {
  const response = await refreshApi.post(
    `${CONFIG_KEYS.API_BASE_URL}/${endpoint}`,
    {
      refreshToken: refreshToken.startsWith('Bearer ') ? refreshToken : `Bearer ${refreshToken}`
    }
  );
  return response.data.accessToken
};
























