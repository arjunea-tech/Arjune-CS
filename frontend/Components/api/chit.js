import api from './config';

const chitAPI = {
    // Get all schemes
    getSchemes: async () => {
        try {
            const response = await api.get('/chit/schemes');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get user's enrolled schemes
    getMySchemes: async () => {
        try {
            const response = await api.get('/chit/my');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Request to join a scheme
    requestJoin: async (details) => {
        try {
            const response = await api.post('/chit/request-join', details);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Pay installment
    payInstallment: async (paymentData) => {
        try {
            const response = await api.post('/chit/pay', paymentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default chitAPI;
