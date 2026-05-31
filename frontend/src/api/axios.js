import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      // Optional: dispatch logout or simply redirect
      window.location.href = "/student/login"; // Or determine role from local state
      return Promise.reject(error);
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
