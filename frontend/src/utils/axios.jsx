import axios from "axios";

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000'
})

API.interceptors.request.use((config) => {
    const publicPaths = ['/user_auth/login/', '/user_auth/signup/'];
    const isPublic = publicPaths.some((path) => config.url.includes(path));
  
    if (!isPublic) {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  
    return config;
  });

  API.interceptors.response.use(
    (response) => {
      const successPaths = [
        { path: '/user_auth/signup/', action: 'Sign Up' },
        { path: '/user_auth/login/', action: 'Login' },
        { path: '/user_auth/edit_org/', action: 'Organization Edit' }
      ];
  
      const matched = successPaths.find((entry) =>
        response.config.url.includes(entry.path)
      );
  
      if (matched) {
        alert(`${matched.action} completed successfully!`);
      }
  
      return response;
    },
    (error) => {
      const errorMsg = error.response?.data?.message || 'Something went wrong.';
      const status = error.response?.status;
      const url = error.config?.url || '';

      const publicPaths = ['/user_auth/login/', '/user_auth/signup/'];
      const isPublic = publicPaths.some((path) => url.includes(path));
      if (!isPublic && (status === 401 || status === 403)) {
        window.localStorage.removeItem('jwtToken'); // Clear token (optional)
        window.location.href = '/'; // force redirect login
      }
      if (!isPublic) {
        alert(`Error: ${errorMsg}`);
      }
      return Promise.reject(error);
    }
  );
  
export default API;