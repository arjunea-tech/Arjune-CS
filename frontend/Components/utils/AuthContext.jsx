import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from storage on app start
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            setUser(null);
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    const value = {
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isCustomer: user?.role === 'customer',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
