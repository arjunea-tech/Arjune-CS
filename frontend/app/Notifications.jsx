import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    RefreshControl
} from 'react-native';
import { notificationsAPI } from '../Components/api';
import { THEME } from '../Components/ui/theme';
import { useAuth } from '../Components/utils/AuthContext';

export default function Notifications() {
    const router = useRouter();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await notificationsAPI.getNotifications();
            if (res.success) {
                setNotifications(res.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const markAsRead = async (id) => {
        try {
            const res = await notificationsAPI.markAsRead(id);
            if (res.success) {
                setNotifications(notifications.map(n =>
                    n._id === id ? { ...n, isRead: true } : n
                ));
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllRead = async () => {
        try {
            const res = await notificationsAPI.markAllAsRead();
            if (res.success) {
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            }
        } catch (error) {
            Alert.alert("Error", "Failed to mark all as read");
        }
    };

    const deleteNotification = async (id) => {
        try {
            const res = await notificationsAPI.deleteNotification(id);
            if (res.success) {
                setNotifications(notifications.filter(n => n._id !== id));
            }
        } catch (error) {
            Alert.alert("Error", "Failed to delete notification");
        }
    };

    const handleNotificationPress = (item) => {
        if (!item.isRead) markAsRead(item._id);

        if (!item.data) return;

        const isAdmin = user?.role === 'admin';

        switch (item.type) {
            case 'order':
                if (item.data.orderId) {
                    router.push({
                        pathname: isAdmin ? '/(admin)/OrderDetails' : '/OrderDetail',
                        params: { id: item.data.orderId }
                    });
                }
                break;
            case 'chit':
                if (item.data.schemeId) {
                    router.push({
                        pathname: isAdmin ? '/(admin)/ChitDetails' : '/(tabs)/Chit',
                        params: isAdmin ? { id: item.data.schemeId } : {}
                    });
                }
                break;
            case 'promotion':
                if (item.data.productId) {
                    router.push({
                        pathname: '/ProductView',
                        params: { id: item.data.productId }
                    });
                }
                break;
            default:
                break;
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'order': return 'cart-outline';
            case 'chit': return 'wallet-outline';
            case 'promotion': return 'megaphone-outline';
            default: return 'notifications-outline';
        }
    };

    const renderNotification = ({ item }) => (
        <TouchableOpacity
            onPress={() => handleNotificationPress(item)}
            className={`flex-row items-center p-4 border-b border-gray-100 ${item.isRead ? 'bg-white' : 'bg-orange-50'}`}
        >
            <View className={`h-12 w-12 rounded-full items-center justify-center ${item.isRead ? 'bg-gray-100' : 'bg-orange-100'}`}>
                <Ionicons
                    name={getIcon(item.type)}
                    size={24}
                    color={item.isRead ? '#6B7280' : THEME.colors.primary}
                />
            </View>

            <View className="flex-1 ml-3">
                <View className="flex-row justify-between items-center">
                    <Text className={`text-base ${item.isRead ? 'text-gray-600 font-medium' : 'text-gray-900 font-bold'}`}>
                        {item.title}
                    </Text>
                    <TouchableOpacity onPress={() => deleteNotification(item._id)}>
                        <Ionicons name="close-outline" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
                <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
                    {item.message}
                </Text>
                <Text className="text-[10px] text-gray-400 mt-2">
                    {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>

            {!item.isRead && (
                <View className="h-3 w-3 rounded-full bg-orange-500 ml-2" />
            )}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color={THEME.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-3">
                        <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold" style={{ color: THEME.colors.primary }}>Notifications</Text>
                </View>

                {notifications.some(n => !n.isRead) && (
                    <TouchableOpacity onPress={markAllRead}>
                        <Text className="text-orange-600 font-semibold text-sm">Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* List */}
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={item => item._id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={THEME.colors.primary} />
                }
                ListEmptyComponent={() => (
                    <View className="flex-1 items-center justify-center mt-20 px-10">
                        <View className="h-24 w-24 bg-gray-50 rounded-full items-center justify-center mb-4">
                            <Ionicons name="notifications-off-outline" size={48} color="#D1D5DB" />
                        </View>
                        <Text className="text-xl font-bold text-gray-800">No Notifications</Text>
                        <Text className="text-gray-500 text-center mt-2">
                            We'll notify you when something important happens!
                        </Text>
                    </View>
                )}
                contentContainerStyle={notifications.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
            />
        </SafeAreaView>
    );
}
