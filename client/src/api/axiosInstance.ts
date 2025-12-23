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
        // Global Error Handling
        if (error.response) {
            // Server responded with a status code
            const { status, data } = error.response;

            // Allow component to handle 400/409/401 explicitly if needed, 
            // but we can also attach the formatted message to the error object
            error.message = data.message || error.message;

            if (status === 401) {
                // Auto logout
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
