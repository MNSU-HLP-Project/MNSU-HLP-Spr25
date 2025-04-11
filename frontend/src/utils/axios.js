import axios from 'axios';

// Create an axios instance with default config
const API = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to add the auth token to every request
API.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('jwtToken');

    // Log the request for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('Request data:', config.data);
    console.log('Token:', token ? 'Present' : 'Missing');

    // If token exists, add it to the request headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
API.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`API Response Success: ${response.config.method.toUpperCase()} ${response.config.url}`);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    // Log detailed error information
    console.error(`API Response Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear the token and redirect to login
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('role');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default API;
