import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { notificationsAPI } from '../api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const seenIdsRef = useRef(new Set());
    const isFirstLoad = useRef(true);

    // Poll for notifications
    useEffect(() => {
        if (!isAuthenticated) return;

        console.log('[NotificationSystem] Starting polling...');

        // Initial fetch
        checkNotifications();

        const intervalId = setInterval(() => {
            if (AppState.currentState === 'active') {
                checkNotifications();
            }
        }, 15000); // Poll every 15 seconds

        return () => clearInterval(intervalId);
    }, [isAuthenticated, user?.role]);

    const checkNotifications = async () => {
        try {
            const res = await notificationsAPI.getNotifications();
            if (res.success && Array.isArray(res.data)) {
                const notifications = res.data;
                const unread = notifications.filter(n => !n.isRead);

                if (isFirstLoad.current) {
                    unread.forEach(n => seenIdsRef.current.add(n._id));
                    isFirstLoad.current = false;
                    return;
                }

                // Check for ANY new unread notification that we haven't seen yet
                const newNotification = unread.find(n => !seenIdsRef.current.has(n._id));

                if (newNotification) {
                    console.log('[NotificationSystem] New notification found:', newNotification.title);
                    seenIdsRef.current.add(newNotification._id);
                }
            }
        } catch (error) {
            // Silent fail for polling errors
        }
    };

    return (
        <NotificationContext.Provider value={{ checkNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
