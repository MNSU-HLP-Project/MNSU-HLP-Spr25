import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const refreshToken = async () => {
    try {
        const refresh_token = localStorage.getItem('refresh_token');
        const response = await axios.post('http://localhost:8000/api/refresh-token/', {
            refresh_token
        });
        
        localStorage.setItem('access_token', response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/';
        throw error;
    }
};

export const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(async (config) => {
        const token = localStorage.getItem('access_token');
        
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                
                if (decoded.exp < currentTime) {
                    const newToken = await refreshToken();
                    config.headers.Authorization = `Bearer ${newToken}`;
                } else {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Token validation failed:', error);
            }
        }
        
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
};