import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';

export const authService = {
    login: async (credentials: any) => {
        const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
        // API returns { statusCode, message, data: { access_token, user } }
        // We want to store the inner 'data' object
        const result = response.data;
        if (result.data && result.data.access_token) {
            localStorage.setItem('user', JSON.stringify(result.data));
            return result.data;
        }
        return result;
    },

    register: async (userData: any) => {
        const response = await axiosInstance.post(ENDPOINTS.AUTH.REGISTER, userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
};
