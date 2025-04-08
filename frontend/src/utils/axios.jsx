import axios from "axios";

// Set base URL
const API = axios.create({
    baseURL: 'http://127.0.0.1:8000'
})

//Setting config for request
API.interceptors.request.use((config) => {
    // publicPaths are the paths that don't need a token
    const publicPaths = ['/user_auth/login/', '/user_auth/signup/'];

    // make a boolean for easy check
    const isPublic = publicPaths.some((path) => config.url.includes(path));
  
    // If it is not public than add the token to the auth header
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
    // These paths are ones that want a success method, action is the action that is displayed in the alert
      const successPaths = [
        { path: '/user_auth/signup/', action: 'Sign Up' },
        { path: '/user_auth/login/', action: 'Login' },
        { path: '/user_auth/edit_org/', action: 'Organization Edit' }
      ];
      
      // Check if the url contains one of these
      const matched = successPaths.find((entry) =>
        response.config.url.includes(entry.path)
      );
      
      // If it does then alert the user
      if (matched) {
        alert(`${matched.action} completed successfully!`);
      }
  
      return response;
    },
    // error handling
    (error) => {
        // Get the error message from response or else just a generic
      const errorMsg = error.response?.data?.message || 'Something went wrong.';
      const status = error.response?.status;
      const url = error.config?.url || '';
        // These public paths should be handled differently, we don't want to redirect
      const publicPaths = ['/user_auth/login/', '/user_auth/signup/'];
      // Make a boolean
      const isPublic = publicPaths.some((path) => url.includes(path));
      // If the status is 401 or 403 we should redirect back and clear the token
      if (!isPublic && (status === 401 || status === 403)) {
        window.localStorage.removeItem('jwtToken'); // Clear token 
        window.location.href = '/'; // force redirect login
      }
      // If it isn't public we should also alert the user
      // TODO: could make this more graceful
      if (!isPublic) {
        alert(`Error: ${errorMsg}`);
      }

      // Have to return the promise for try/catch blocks further up
      return Promise.reject(error);
    }
  );
  
export default API;