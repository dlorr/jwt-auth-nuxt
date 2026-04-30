import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let axiosInstance: AxiosInstance;

export function useAxios(): AxiosInstance {
  return axiosInstance;
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  axiosInstance = axios.create({
    baseURL: config.public.apiBase as string,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => response.data,

    async (error) => {
      const originalRequest = error.config as RetryableRequestConfig;

      const is401 = error.response?.status === 401;
      const alreadyRetried = originalRequest._retry === true;
      const isRefreshCall = originalRequest.url?.includes("/auth/refresh");

      if (is401 && !alreadyRetried && !isRefreshCall) {
        originalRequest._retry = true;

        try {
          await axiosInstance.get("/auth/refresh");

          return axiosInstance(originalRequest);
        } catch {
          const authStore = useAuthStore();
          authStore.clearAuth();
          await navigateTo("/login");
          return Promise.reject(error);
        }
      }

      const message =
        error.response?.data?.message ??
        error.message ??
        "An unexpected error occurred";

      return Promise.reject(new Error(message));
    },
  );

  return {
    provide: {
      axios: axiosInstance,
    },
  };
});
