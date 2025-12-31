import api from './config';

const bannersAPI = {
    // Get all banners
    getBanners: async () => {
        try {
            const response = await api.get('/banners');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new banner with image
    createBanner: async (formData) => {
        try {
            const response = await api.post('/banners', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update banner
    updateBanner: async (id, formData) => {
        try {
            const response = await api.put(`/banners/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete banner
    deleteBanner: async (id) => {
        try {
            const response = await api.delete(`/banners/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default bannersAPI;
