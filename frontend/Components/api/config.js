import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

// Base URL for your backend API
// For Android Emulator: use 10.0.2.2
// For iOS Simulator: use localhost
// For Physical Device: use your computer's IP address (e.g., 192.168.x.x)
const getBaseURL = () => {
    // Using IP address for physical device - works for all platforms
    return 'http://192.168.1.53:5000/api/v1';

    // Uncomment below for emulators only:
    // if (Platform.OS === 'android') {
    //     return 'http://10.0.2.2:5000/api/v1'; // Android emulator
    // }
    // return 'http://localhost:5000/api/v1'; // iOS simulator
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
        if (error.response) {
            // Server responded with error
            const { status, data } = error.response;

            if (status === 401) {
                // Unauthorized - clear user data and redirect to login
                await AsyncStorage.removeItem('user');
                // You can emit an event here to trigger logout in your app
            }

            return Promise.reject(data.error || 'An error occurred');
        } else if (error.request) {
            // Request made but no response
            return Promise.reject('Network error. Please check your connection.');
        } else {
            // Something else happened
            return Promise.reject(error.message);
        }
    }
);

export default api;
