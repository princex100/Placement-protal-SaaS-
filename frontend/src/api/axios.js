import axios from "axios";
import { toast } from "react-hot-toast";
import { store } from "../redux/store";
import { clearCredentials } from "../redux/features/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's an authorization error and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If it's a logout request, we don't care if it fails with 401
      if (originalRequest.url?.includes('/logout')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        const state = store.getState();
        const role = state.auth?.role;

        if (role !== 'college-admin') {
          // No refresh endpoint for students right now
          throw new Error("No refresh token endpoint for students");
        }

        // Attempt to hit the refresh endpoint
        await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/colleges/refresh-token`,
          {},
          { withCredentials: true }
        );

        // If successful, retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed (e.g. refresh token is also expired)
        const state = store.getState();
        const role = state.auth?.role;
        store.dispatch(clearCredentials());
        
        // Prevent aggressive redirects if the user is already on a public page
        const publicRoutes = ['/', '/college/auth', '/student/auth', '/college/register'];
        if (!publicRoutes.includes(window.location.pathname)) {
          toast.error("Session expired. Please log in again.");
          if (role === 'college-admin' || window.location.pathname.startsWith('/college')) {
            window.location.href = "/college/auth";
          } else {
            window.location.href = "/student/auth";
          }
        }
        
        return Promise.reject(refreshError);
      }
    }

    const data = error.response?.data;
    
    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      // If the backend provided an array of specific errors, show them
      data.errors.forEach((err) => {
        const errMsg = typeof err === 'string' ? err : err.message || err.msg || JSON.stringify(err);
        toast.error(errMsg);
      });
    } else {
      // Otherwise, fallback to the main message
      const message = data?.message || error.message || "An unexpected error occurred";
      if (error.response?.status !== 401) {
        toast.error(message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

