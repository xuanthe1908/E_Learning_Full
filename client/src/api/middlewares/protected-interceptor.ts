import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import CustomApiError from "../../utils/CustomApiError";
import CONFIG_KEYS from "../../config";
import { refreshTokenApi } from "../endpoints/auth/token-refresh";
const api: AxiosInstance = axios.create({
  baseURL: CONFIG_KEYS.API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const tokenString = localStorage.getItem("accessToken");
    if (tokenString) {
      try {
        // Try to parse as JSON first
        const token = JSON.parse(tokenString);
        config.headers.Authorization = `Bearer ${token.accessToken}`;
      } catch (e) {
        // If not JSON, check if it's a mock token string and clear it
        if (tokenString.startsWith('mock.')) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          return config;
        }
        // If it's a plain string token, use it directly
        config.headers.Authorization = `Bearer ${tokenString}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flag to prevent infinite refresh token loop
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Skip refresh token for refresh token endpoint itself
    if (originalRequest?.url?.includes('refresh-token')) {
      if (error.response) {
        const { data, status } = error.response;
        if (status === 401) {
          // Clear tokens and redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.dispatchEvent(new Event("sessionExpired"));
        }
        throw new CustomApiError("Unauthorized", data);
      }
      return Promise.reject(error);
    }

    // Check if the response status is 401 (unauthorized) and it's not a retry request
    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const tokenString = localStorage.getItem("refreshToken");
      let token;
      
      if (!tokenString) {
        isRefreshing = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.dispatchEvent(new Event("sessionExpired"));
        processQueue(error, null);
        return Promise.reject(error);
      }

      try {
        token = JSON.parse(tokenString);
      } catch (e) {
        // If not JSON and it's a mock token, clear it
        if (tokenString.startsWith('mock.')) {
          isRefreshing = false;
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          processQueue(error, null);
          return Promise.reject(error);
        }
        // If it's a plain string, use it directly
        token = { refreshToken: tokenString };
      }

      try {
        const newAccessToken = await refreshTokenApi(token?.refreshToken);
        localStorage.setItem(
          "accessToken",
          JSON.stringify({
            accessToken: newAccessToken,
          })
        );
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        isRefreshing = false;
        processQueue(null, newAccessToken);
        
        return api(originalRequest);
      } catch (err: any) {
        isRefreshing = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.dispatchEvent(new Event("sessionExpired"));
        processQueue(err, null);
        return Promise.reject(err);
      }
    }

    // Check if the response status is 403 (forbidden)
    if (error?.response?.status === 403) {
      window.dispatchEvent(new Event("sessionExpired"));
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    // Handle other errors
    if (error.response) {
      const { data, status } = error.response;
      if (status === 400) {
        throw new CustomApiError("Bad request", data);
      } else if (status === 401) {
        throw new CustomApiError("Unauthorized", data);
      } else if (status === 404) {
        throw new CustomApiError("Not Found", data);
      } else if (status === 409) {
        throw new CustomApiError("Conflict", data);
      } else {
        throw new CustomApiError(`Request failed with status ${status}`, data);
      }
    } else if (error.request) {
      throw new CustomApiError(`No response received`, error.request);
    } else {
      console.log("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;























