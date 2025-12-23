import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const authService = {
    login: async (email: string, password: string) => {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        if (response.data.access_token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    register: async (name: string, email: string, password: string) => {
        return axios.post(`${API_URL}/auth/register`, {
            name,
            email,
            password,
        });
    }
};
