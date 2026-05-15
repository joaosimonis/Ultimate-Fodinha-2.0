import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://ultimate-fodinha-api.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
