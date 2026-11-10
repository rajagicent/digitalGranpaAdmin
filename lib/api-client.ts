import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken, removeAuthToken, isTokenExpired } from './auth';

let isLoggingOut = false;

export const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    return '/api/v1';
  }

  const serverUrl =
    process.env.BACKEND_URL ||
    process.env.BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL;

  if (serverUrl && typeof serverUrl === 'string' && serverUrl.trim().length > 0) {
    return serverUrl.trim().replace(/\/+$/, '');
  }

  return '';
};

export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer token and check expiration before request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.baseURL = getBaseUrl();
    const url = config.url || '';
    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/forgot-password');

    const token = getAuthToken();

    if (!isAuthEndpoint) {
      if (!token || isTokenExpired(token)) {
        removeAuthToken();
        if (typeof window !== 'undefined' && !isLoggingOut) {
          isLoggingOut = true;
          window.location.replace('/login?expired=1');
        }
        return Promise.reject(
          new ApiError('Authentication token is required. Please log in.', 401)
        );
      }

      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global errors & 401 unauthenticated
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/login') && !isLoggingOut) {
          isLoggingOut = true;
          removeAuthToken();
          window.location.replace('/login?expired=1');
        }
      }
    }

    const errorData: any = error.response?.data;
    const errorMessage =
      (typeof errorData === 'string' ? errorData : null) ||
      errorData?.error ||
      errorData?.message ||
      (Array.isArray(errorData?.errors) ? errorData.errors.join(', ') : null) ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(
      new ApiError(errorMessage, error.response?.status, error.response?.data)
    );
  }
);

