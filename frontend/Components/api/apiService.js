import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../../environment';

const ENV = getEnvVars();

// Create axios instance
const apiClient = axios.create({
    baseURL: ENV.apiUrl,
    timeout: ENV.timeout,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error fetching token from storage:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        // Success response
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 - Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Try to refresh token or redirect to login
                await AsyncStorage.removeItem('authToken');
                await AsyncStorage.removeItem('user');
                
                // Redirect to login
                if (global.navigationRef) {
                    global.navigationRef.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                }
            } catch (refreshError) {
                console.error('Token refresh error:', refreshError);
            }
        }

        // Handle 403 - Forbidden
        if (error.response?.status === 403) {
            console.error('Access forbidden:', error.response.data.error);
        }

        // Handle 429 - Too many requests
        if (error.response?.status === 429) {
            console.error('Too many requests. Please try again later.');
        }

        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message);
        }

        // Log error details
        console.error('API Error:', {
            status: error.response?.status,
            message: error.response?.data?.error || error.message,
            path: error.config?.url,
            method: error.config?.method,
        });

        return Promise.reject({
            status: error.response?.status || 500,
            message: error.response?.data?.error || 'An error occurred',
            details: error.response?.data?.details,
            originalError: error
        });
    }
);

// API methods
export const apiService = {
    // Auth endpoints
    register: (userData) => apiClient.post('/auth/register', userData),
    login: (email, password) => apiClient.post('/auth/login', { email, password }),
    getCurrentUser: () => apiClient.get('/auth/me'),
    updateProfile: (userData) => apiClient.put('/auth/updatedetails', userData),
    resetPassword: (email) => apiClient.post('/auth/resetpassword', { email }),

    // Products
    getProducts: (filters = {}) => apiClient.get('/products', { params: filters }),
    getProductById: (id) => apiClient.get(`/products/${id}`),
    createProduct: (productData) => apiClient.post('/products', productData),
    updateProduct: (id, productData) => apiClient.put(`/products/${id}`, productData),
    deleteProduct: (id) => apiClient.delete(`/products/${id}`),

    // Categories
    getCategories: () => apiClient.get('/categories'),
    getCategoryById: (id) => apiClient.get(`/categories/${id}`),
    createCategory: (categoryData) => apiClient.post('/categories', categoryData),
    updateCategory: (id, categoryData) => apiClient.put(`/categories/${id}`, categoryData),
    deleteCategory: (id) => apiClient.delete(`/categories/${id}`),

    // Orders
    getOrders: (filters = {}) => apiClient.get('/orders', { params: filters }),
    getOrderById: (id) => apiClient.get(`/orders/${id}`),
    createOrder: (orderData) => apiClient.post('/orders', orderData),
    updateOrder: (id, orderData) => apiClient.put(`/orders/${id}`, orderData),
    cancelOrder: (id) => apiClient.delete(`/orders/${id}`),

    // Banners
    getBanners: () => apiClient.get('/banners'),
    createBanner: (bannerData) => apiClient.post('/banners', bannerData),

    // Notifications
    getNotifications: () => apiClient.get('/notifications'),
    markNotificationAsRead: (id) => apiClient.put(`/notifications/${id}/read`),

    // Addresses
    addAddress: (addressData) => apiClient.post('/auth/addresses', addressData),
    setDefaultAddress: (id) => apiClient.put(`/auth/addresses/${id}/default`),
    deleteAddress: (id) => apiClient.delete(`/auth/addresses/${id}`),

    // Chit (Installment)
    getChitSchemes: () => apiClient.get('/chit'),
    registerForChit: (chitData) => apiClient.post('/chit/register', chitData),
};

export default apiClient;
