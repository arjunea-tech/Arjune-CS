import api from './config';

const categoriesAPI = {
    // Get all categories
    getCategories: async () => {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single category
    getCategory: async (id) => {
        try {
            const response = await api.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new category with image
    createCategory: async (formData) => {
        try {
            const response = await api.post('/categories', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update category
    updateCategory: async (id, formData) => {
        try {
            const response = await api.put(`/categories/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete category
    deleteCategory: async (id) => {
        try {
            const response = await api.delete(`/categories/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default categoriesAPI;
