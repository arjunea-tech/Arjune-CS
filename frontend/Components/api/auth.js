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
            const response = await api.post('/auth/register', userData);
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
};

export default authAPI;
