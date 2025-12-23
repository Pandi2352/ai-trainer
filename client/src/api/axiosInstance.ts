import axios from 'axios';
import { API_BASE_URL } from './endpoints';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user?.access_token) {
                config.headers.Authorization = `Bearer ${user.access_token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors (Optional)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // We can handle 401 Unauthorized logout logic here if needed
        if (error.response && error.response.status === 401) {
            // localStorage.removeItem('user');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
