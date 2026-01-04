import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosInstance } from "axios";
import { AUTH_ROUTES, USER_ROUTES } from "@/constants/apiRoutes";

// Service URLs from environment variables
const AUTH_URL = import.meta.env.VITE_AUTH_SERVICE_BASE_URL || "http://127.0.0.1:8000";
const USER_URL = import.meta.env.VITE_USER_SERVICE_BASE_URL || "http://127.0.0.1:8000";
const BLOG_URL = import.meta.env.VITE_BLOG_SERVICE_BASE_URL || "http://127.0.0.1:8000";
const DIARY_URL = import.meta.env.VITE_DIARY_SERVICE_BASE_URL || "http://127.0.0.1:8000";
const CDN_URL = import.meta.env.VITE_CDN_SERVICE_BASE_URL || "http://127.0.0.1:8000";

// Fallback for legacy calls (if any)
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export interface TokenResponse {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds
}

const ACCESS_KEY = "auth_access_token";
const REFRESH_KEY = "auth_refresh_token";
const EXPIRES_AT_KEY = "auth_expires_at";

// Helpers
export const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);
const setTokens = (payload: TokenResponse) => {
  localStorage.setItem(ACCESS_KEY, payload.access_token);
  localStorage.setItem(REFRESH_KEY, payload.refresh_token);
  // store expiry timestamp (ms). subtract small buffer (e.g. 30s) to be safe
  const expiresAt = Date.now() + (payload.expires_in - 30) * 1000;
  localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
};
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
};

// Refresh handling: queue to avoid multiple refresh calls
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (err?: unknown) => void;
  config: InternalAxiosRequestConfig;
  instance: AxiosInstance; // Need to know which instance to retry with
}[] = [];

const processQueue = (error: unknown | null, token?: string) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else {
      if (token && p.config.headers) p.config.headers["Authorization"] = "Bearer " + token;
      p.resolve(p.instance(p.config));
    }
  });
  failedQueue = [];
};

// Create a factory for API instances
const createApiClient = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    headers: {
      Accept: "application/json",
    },
  });

  // Attach Authorization header
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor to handle 401
  instance.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Prevent infinite loops on refresh endpoint itself
      if (!originalRequest || originalRequest.url?.includes(AUTH_ROUTES.REFRESH)) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // queue request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest, instance });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        // We use the AUTH service for refreshing
        refreshPromise = doRefresh()
          .then(() => {
            const newToken = getAccessToken();
            processQueue(null, newToken || undefined);
          })
          .catch((err) => {
            processQueue(err, undefined);
            clearTokens();
            throw err;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });

        return refreshPromise.then(() => {
          const newToken = getAccessToken();
          if (newToken && originalRequest.headers) {
            originalRequest.headers["Authorization"] = "Bearer " + newToken;
          }
          return instance(originalRequest);
        });
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create instances for each service
export const authApi = createApiClient(AUTH_URL);
export const userApi = createApiClient(USER_URL);
export const blogApi = createApiClient(BLOG_URL);
export const diaryApi = createApiClient(DIARY_URL);
export const cdnApi = createApiClient(CDN_URL);

// Default instance (for backward compatibility or unspecified services)
const defaultApi = createApiClient(API_BASE);

// Export all instances for interceptors
export const apiInstances = [authApi, userApi, blogApi, diaryApi, cdnApi, defaultApi];

const doRefresh = async (): Promise<void> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  // Refresh token endpoint is on AUTH service
  const res = await axios.post(`${AUTH_URL}${AUTH_ROUTES.REFRESH}`, {
    refresh_token: refreshToken,
  });

  const body = (res.data && (res.data.data ?? res.data)) as any;

  const tokenResp: TokenResponse = {
    token_type:
      body?.token_type ?? body?.tokenType ?? body?.type ?? "Bearer",
    access_token:
      body?.access_token ??
      body?.accessToken ??
      body?.access ??
      body?.token ??
      "",
    refresh_token:
      body?.refresh_token ?? body?.refreshToken ?? body?.refresh ?? "",
    expires_in:
      body?.expires_in ?? body?.expiresIn ?? Number(body?.expires) ?? 0,
  };

  if (!tokenResp.access_token) throw new Error("Refresh response missing access_token");

  setTokens(tokenResp);
};

// Exposed API helpers
export const login = async (username: string, password: string) => {
  // Login endpoint is on AUTH service
  const res = await axios.post(`${AUTH_URL}${AUTH_ROUTES.LOGIN}`, {
    username,
    password,
  });

  // normalize response shape (handle res.data or res.data.data and different key names)
  const body = (res.data && (res.data.data ?? res.data)) as any;

  const tokenResp: TokenResponse = {
    token_type:
      body?.token_type ?? body?.tokenType ?? body?.type ?? "Bearer",
    access_token:
      body?.access_token ??
      body?.accessToken ??
      body?.access ??
      body?.token ??
      "",
    refresh_token:
      body?.refresh_token ?? body?.refreshToken ?? body?.refresh ?? "",
    expires_in:
      body?.expires_in ?? body?.expiresIn ?? Number(body?.expires) ?? 0,
  };

  if (!tokenResp.access_token) {
    // helpful error for debugging if backend shape is unexpected
    throw new Error("Login response missing access_token");
  }

  setTokens(tokenResp);
  return tokenResp;
};

export const fetchProfile = async () => {
  // Profile endpoint is on USER service
  const res = await userApi.get(USER_ROUTES.PROFILE);
  return res.data;
};

export const logout = async () => {
  try {
    // Logout endpoint is on AUTH service
    await authApi.post(AUTH_ROUTES.LOGOUT);
  } catch (err) {
    // ignore server logout errors, we'll clear tokens locally anyway
  } finally {
    clearTokens();
  }
};

export const fetchSettings = async () => {
  // Settings might be on USER or AUTH, assuming USER for now based on context
  const res = await userApi.get(USER_ROUTES.SETTINGS);
  return res.data;
};

export default defaultApi;