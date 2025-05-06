import axios from "axios";

// Create an Axios instance
const devMode = true;

export const axiosInstance = axios.create({
  baseURL: devMode
    ? "http://localhost:4000/api/v1"
    : "https://task-management-app-oll7.onrender.com/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await axiosInstance.get("/users/refresh-token"); // Your refresh route
        return axiosInstance(originalRequest); // Retry original request
      } catch (refreshError) {
        console.log("Refresh failed:", refreshError);
        // Handle logout or redirect to login
      }
    }

    return Promise.reject(error);
  }
);
