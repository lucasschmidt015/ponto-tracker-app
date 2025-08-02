import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL
});

// Export a function to set up interceptors after store is created
export const setupInterceptors = (store, refreshTokenThunk, logout) => {
  const skipInterceptorRoutes = ['/auth/validate', '/auth/login', '/auth/logout', '/auth/refresh'];

  api.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (
        originalRequest?.url &&
        skipInterceptorRoutes.some(route => originalRequest.url.includes(route))
      ) {
        return Promise.reject(error);
      }

      if (
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const result = await store.dispatch(refreshTokenThunk());
          const newToken = result.payload?.token;
          if (newToken) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch {
          await store.dispatch(logout());
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;