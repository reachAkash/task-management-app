import axios from "axios";

// Create an Axios instance
const devMode = true;

export const axiosInstance = axios.create({
  baseURL: devMode ? "http://localhost:4000/api/v1" : "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
