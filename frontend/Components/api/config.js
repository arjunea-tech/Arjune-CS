import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

// Base URL for your backend API
// For Android Emulator: use 10.0.2.2
// For iOS Simulator: use localhost
// For Physical Device: use your computer's IP address (e.g., 192.168.x.x)
const getBaseURL = () => {
    if (Platform.OS === 'web') {
        return 'http://localhost:5000/api/v1';
    }
    // For Physical Device/Emulator
    return 'http://192.168.1.41:5000/api/v1';
};

const API_BASE_URL = getBaseURL();

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 20000, // Increased from 10000ms to 20000ms (20 seconds)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                if (user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            }
        } catch (error) {
            console.error('Error getting token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        let errorMessage = 'An error occurred';

        if (error.response) {
            // Server responded with error
            const { status, data } = error.response;
            errorMessage = data.error || data.message || `Error: ${status}`;

            if (status === 401) {
                await AsyncStorage.removeItem('user');
                // Log detailed error for debugging
                console.error('[API 401] Unauthorized:', {
                    endpoint: error.config?.url,
                    message: errorMessage,
                    timestamp: new Date().toISOString()
                });
            } else if (status === 403) {
                console.error('[API 403] Forbidden:', {
                    endpoint: error.config?.url,
                    message: errorMessage,
                    timestamp: new Date().toISOString()
                });
            } else if (status >= 500) {
                console.error('[API 5XX] Server Error:', {
                    endpoint: error.config?.url,
                    status: status,
                    message: errorMessage,
                    timestamp: new Date().toISOString()
                });
            }
        } else if (error.request) {
            // Request made but no response - likely network issue
            errorMessage = 'Network error. Please check your connection and server is running.';
            console.error('[API Network Error]:', {
                message: errorMessage,
                baseURL: API_BASE_URL,
                timeout: api.defaults.timeout,
                timestamp: new Date().toISOString()
            });
        } else {
            // Something else happened
            errorMessage = error.message || 'Something went wrong';
            console.error('[API Error]:', {
                message: errorMessage,
                timestamp: new Date().toISOString()
            });
        }

        return Promise.reject(new Error(errorMessage));
    }
);

export { API_BASE_URL };
export default api;
