import api from './config';

const productsAPI = {
    // Get all products
    getProducts: async (limit = 100, page = 1) => {
        try {
            const response = await api.get('/products', {
                params: {
                    limit,
                    page
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single product
    getProduct: async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new product with image
    createProduct: async (formData) => {
        try {
            const response = await api.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update product
    updateProduct: async (id, formData) => {
        try {
            const response = await api.put(`/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete product
    deleteProduct: async (id) => {
        try {
            const response = await api.delete(`/products/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default productsAPI;
