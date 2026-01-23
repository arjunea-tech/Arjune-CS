import api from './config';

const settingsAPI = {
    // Get all settings
    getSettings: async () => {
        try {
            const response = await api.get('/settings');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update all settings
    updateSettings: async (data) => {
        try {
            const response = await api.put('/settings', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get About Us
    getAboutUs: async () => {
        try {
            const response = await api.get('/settings/about-us');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get Shipping Details
    getShipping: async () => {
        try {
            const response = await api.get('/settings');
            return response.data?.data?.shipping || {};
        } catch (error) {
            throw error;
        }
    },

    // Get Fees Details
    getFees: async () => {
        try {
            const response = await api.get('/settings');
            return response.data?.data?.fees || {};
        } catch (error) {
            throw error;
        }
    },

    // Get Order Settings (including minimum order amount)
    getOrderSettings: async () => {
        try {
            const response = await api.get('/settings/order-settings');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Admin: Update About Us
    updateAboutUs: async (data) => {
        try {
            const response = await api.put('/settings/about-us', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Admin: Update Shipping
    updateShipping: async (data) => {
        try {
            const response = await api.put('/settings/shipping', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Admin: Update Fees
    updateFees: async (data) => {
        try {
            const response = await api.put('/settings/fees', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Admin: Update Order Settings
    updateOrderSettings: async (data) => {
        try {
            const response = await api.put('/settings/order-settings', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default settingsAPI;
