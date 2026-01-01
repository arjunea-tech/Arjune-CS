import api from './config';

const authAPI = {
    // Login user
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Register new user
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get current user profile
    getMe: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update user profile details
    updateDetails: async (userData) => {
        try {
            const response = await api.put('/auth/updatedetails', userData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Add new address
    addAddress: async (addressData) => {
        try {
            const response = await api.post('/auth/addresses', addressData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete address
    deleteAddress: async (addressId) => {
        try {
            const response = await api.delete(`/auth/addresses/${addressId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Set default address
    setDefaultAddress: async (addressId) => {
        try {
            const response = await api.put(`/auth/addresses/${addressId}/default`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default authAPI;
