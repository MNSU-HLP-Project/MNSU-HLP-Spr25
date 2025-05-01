import axios from "axios";
import { toast } from "react-hot-toast";

// Base URL for API
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/",
});

// Public paths that don't require a token
const publicPaths = ["/user_auth/login/", "/user_auth/signup/"];

// Request interceptor to attach token
API.interceptors.request.use((config) => {
  const isPublic = publicPaths.some((path) => config.url.includes(path));

  if (!isPublic) {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Response interceptor to handle success and errors
API.interceptors.response.use(
  (response) => {
    const successPaths = [
      { path: "/user_auth/signup/", action: "Sign Up" },
      { path: "/user_auth/login/", action: "Login" },
      { path: "/user_auth/edit_org/", action: "Organization Edit" },
    ];

    const matched = successPaths.find((entry) =>
      response.config.url.includes(entry.path)
    );

    if (matched) {
      toast.success(`${matched.action} completed successfully!`);
    }

    return response;
  },
  (error) => {
    const url = error.config?.url || "";
    const status = error.response?.status;
    const isPublic = publicPaths.some((path) => url.includes(path));

    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong.";

    // Always show error toast
    toast.error(`Error: ${errorMsg}`);

    // Redirect only on protected 401/403
    if (!isPublic && (status === 401 || status === 403)) {
      setTimeout(() => {
        localStorage.removeItem("jwtToken");
        window.location.href = "/";
      }, 1500);
    }

    return Promise.reject(error);
  }
);

export default API;
