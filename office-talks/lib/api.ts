import axios from "axios";

// base URL for all API requests; allows overriding via environment variable
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://office-talks.onrender.com";

// an axios instance pre-configured with the base URL
export const apiClient = axios.create({
  baseURL: API_BASE,
});
