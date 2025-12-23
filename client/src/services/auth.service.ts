import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';

export const authService = {
    login: async (credentials: any) => {
        const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
        if (response.data.access_token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
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
