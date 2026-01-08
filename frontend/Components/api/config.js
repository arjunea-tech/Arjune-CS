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
    return 'http://192.168.1.38:5000/api/v1';
};

const API_BASE_URL = getBaseURL();

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
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
            }
        } else if (error.request) {
            // Request made but no response
            errorMessage = 'Network error. Please check your connection.';
        } else {
            // Something else happened
            errorMessage = error.message || 'Something went wrong';
        }

        return Promise.reject(new Error(errorMessage));
    }
);

export default api;
