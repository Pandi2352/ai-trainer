import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';

export const usersService = {
    getAllUsers: async () => {
        const response = await axiosInstance.get(ENDPOINTS.USERS.LIST);
        const body = response.data;
        // Handle paginated response: { data: { data: [], meta: {} } }
        if (body.data && body.data.data && Array.isArray(body.data.data)) {
            return body.data.data;
        }
        return body.data || [];
    },

    updateRole: async (id: string, role: string) => {
        const response = await axiosInstance.patch(ENDPOINTS.USERS.UPDATE_ROLE(id), { role });
        return response.data;
    },

    getProfile: async () => {
        const response = await axiosInstance.get(ENDPOINTS.USERS.PROFILE);
        return response.data.data || response.data;
    },

    updateProfile: async (data: any) => {
        const response = await axiosInstance.patch(ENDPOINTS.USERS.PROFILE, data);
        return response.data;
    },

    inviteUser: async (email: string, role: string) => {
        const response = await axiosInstance.post(ENDPOINTS.INVITE.SEND, { email, role });
        return response.data;
    },

    changePassword: async (password: string) => {
        const response = await axiosInstance.patch(`${ENDPOINTS.USERS.PROFILE}/password`, { password });
        return response.data;
    },
};
