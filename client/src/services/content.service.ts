import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';

export const contentService = {
    uploadFile: async (file: File, domainId?: string) => {
        const formData = new FormData();
        formData.append('file', file);
        if (domainId) formData.append('domainId', domainId);

        const response = await axiosInstance.post('/content/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getAllContent: async () => {
        const response = await axiosInstance.get('/content');
        return response.data;
    },

    getContentById: async (id: string) => {
        const response = await axiosInstance.get(`/content/${id}`);
        return response.data;
    },
};
