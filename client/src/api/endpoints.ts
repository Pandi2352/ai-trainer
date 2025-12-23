export const API_BASE_URL = 'http://localhost:3000';

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/auth/profile',
    },
    USERS: {
        LIST: '/users',
        UPDATE_ROLE: (id: string) => `/users/${id}/role`,
        PROFILE: '/users/profile',
    },
    INVITE: {
        SEND: '/invite',
    },
};
