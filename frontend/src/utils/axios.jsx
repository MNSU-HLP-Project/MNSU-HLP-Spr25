import axios from "axios";
import { toast } from 'react-hot-toast'; // Import toast

// Set base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/",
});

// Setting config for request
API.interceptors.request.use((config) => {
  // Public paths that don't need token
  const publicPaths = ['/user_auth/login/', '/user_auth/signup/'];

  // Check if URL is public
  const isPublic = publicPaths.some((path) => config.url.includes(path));

  // If not public, add Authorization header
  if (!isPublic) {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Config for the response back
API.interceptors.response.use(
  (response) => {
    // Paths where we want success toasts
    const successPaths = [
      { path: '/user_auth/signup/', action: 'Sign Up' },
      { path: '/user_auth/login/', action: 'Login' },
      { path: '/user_auth/edit_org/', action: 'Organization Edit' }
    ];

    // Find if the URL matches a success path
    const matched = successPaths.find((entry) =>
      response.config.url.includes(entry.path)
    );

    // Show success toast if matched
    if (matched) {
      toast.success(`${matched.action} completed successfully!`);
    }

    return response;
  },
  (error) => {
    // Error handling
    const errorMsg = error.response?.data?.message || 'Something went wrong.';
    const status = error.response?.status;
    const url = error.config?.url || '';

    // Public paths
    const publicPaths = ['/user_auth/login/', '/user_auth/signup/'];
    const isPublic = publicPaths.some((path) => url.includes(path));

    // If not public and 401 or 403, clear token and redirect
    if (!isPublic && (status === 401 || status === 403)) {
      window.localStorage.removeItem('jwtToken');
      window.location.href = '/';
    }

    // Show error toast if not public
    if (!isPublic) {
      toast.error(` Error: ${errorMsg} `);
    }

    return Promise.reject(error);
  }
);

export default API;
