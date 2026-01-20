import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { notificationsAPI } from '../api';
import { useAuth } from './AuthContext';

// Configure how notifications behave when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
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
    const router = useRouter();
    // Keep track of seen notification IDs to avoid showing same popup multiple times in a session
    const seenIdsRef = useRef(new Set());
    const isFirstLoad = useRef(true);
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync();

        // Listener for when user taps on a notification
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;
            if (data && data.notificationId) {
                handleNotificationTap(data);
            }
        });

        return () => {
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

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

                    // Trigger System Notification
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: newNotification.title,
                            body: newNotification.message,
                            data: {
                                notificationId: newNotification._id,
                                type: newNotification.type,
                                data: newNotification.data
                            },
                        },
                        trigger: null, // show immediately
                    });
                }
            }
        } catch (error) {
            // Silent fail for polling errors
        }
    };

    const handleNotificationTap = async (payload) => {
        const { notificationId, type, data } = payload;

        // Mark as read
        try {
            if (notificationId) await notificationsAPI.markAsRead(notificationId);
        } catch (e) { console.error(e); }

        // Navigate
        if (!data) {
            router.push('/Notifications');
            return;
        }

        const isAdmin = user?.role === 'admin';

        switch (type) {
            case 'order':
                if (data.orderId) {
                    const path = isAdmin ? '/(admin)/OrderDetails' : '/OrderDetail';
                    router.push({ pathname: path, params: { id: data.orderId } });
                }
                break;
            case 'chit':
                if (data.schemeId) {
                    const path = isAdmin ? '/(admin)/ChitDetails' : '/(tabs)/Chit';
                    router.push({ pathname: path, params: isAdmin ? { id: data.schemeId } : {} });
                }
                break;
            case 'promotion':
                if (data.productId) {
                    router.push({ pathname: '/ProductView', params: { id: data.productId } });
                }
                break;
            default:
                router.push('/Notifications');
                break;
        }
    };

    return (
        <NotificationContext.Provider value={{ checkNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
