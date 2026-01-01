import api from './config';

const notificationsAPI = {
    /**
     * Get all notifications for the current user
     */
    getNotifications: async () => {
        try {
            const response = await api.get('/notifications');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mark a single notification as read
     */
    markAsRead: async (id) => {
        try {
            const response = await api.put(`/notifications/${id}/read`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async () => {
        try {
            const response = await api.put('/notifications/read-all');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete a notification
     */
    deleteNotification: async (id) => {
        try {
            const response = await api.delete(`/notifications/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default notificationsAPI;
