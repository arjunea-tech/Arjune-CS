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

    // Get single scheme
    getScheme: async (id) => {
        return api.get(`/chit/schemes/${id}`);
    },

    // Get participants for a scheme
    getSchemeParticipants: async (id) => {
        return api.get(`/chit/schemes/${id}/participants`);
    },

    // Update scheme details
    updateScheme: async (id, data) => {
        return api.put(`/chit/schemes/${id}`, data);
    },

    // Get user's enrolled schemes
    getMySchemes: async () => {
        return api.get('/chit/my');
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

    // Pay installment (User self-pay)
    payInstallment: async (paymentData) => {
        return api.post('/chit/pay', paymentData);
    },

    // Record payment for user (Admin)
    recordUserPayment: async (data) => {
        return api.post('/chit/admin/pay', data);
    },

    // Approve join request (Admin)
    approveJoinRequest: async (data) => {
        return api.post('/chit/admin/approve', data);
    },

    // Reject join request (Admin)
    rejectJoinRequest: async (data) => {
        return api.post('/chit/admin/reject', data);
    }
};

export default chitAPI;
