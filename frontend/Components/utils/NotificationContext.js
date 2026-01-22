import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { notificationsAPI } from '../api';
import { useAuth } from './AuthContext';

// Configure how notifications behave when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

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

    const registerForPushNotificationsAsync = async () => {
        // Android Push Notification support was removed from Expo Go in SDK 53.
        // We must skip this setup if running in Expo Go to avoid the crash.
        if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
            console.log("Push notifications are not supported in Expo Go (SDK 53+). Using local polling only.");
            return;
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }
    };
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
