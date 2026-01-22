import { MaterialCommunityIcons } from '@expo/vector-icons'
import LottieView from 'lottie-react-native'
import { Text, TextInput, View, TouchableOpacity } from 'react-native'
import { COLORS } from '../../constant/theme'
import { useRouter } from 'expo-router'
import { useState, useCallback } from 'react'
import { notificationsAPI } from '../../Components/api'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function HomeHeader({ searchValue = '', onChangeText = () => { } }) {
    const router = useRouter();
    const [unreadCount, setUnreadCount] = useState(0);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchUnreadCount = async () => {
                try {
                    const userData = await AsyncStorage.getItem('user');
                    if (!userData || !isActive) return;

                    const res = await notificationsAPI.getNotifications();
                    if (res.success && isActive) {
                        const count = res.data.filter(n => !n.isRead).length;
                        setUnreadCount(count);
                    }
                } catch (error) {
                    // Silently fail for "Network error" or "Not authorized" to keep the console clean
                    // This clears the visible error for the user while they are not logged in
                    if (error.message && !error.message.includes('Network error') && !error.message.includes('401')) {
                        console.error('Error fetching unread count:', error);
                    }
                }
            };

            fetchUnreadCount();

            return () => {
                isActive = false;
            };
        }, [])
    );

    return (
        <View>
            {/* Header */}
            <View
                className="w-full h-36 rounded-b-3xl px-6 pt-2 pb-4 justify-between overflow-hidden"
                style={{ backgroundColor: COLORS.primary }}
            >
                {/* 🎆 LOTTIE BACKGROUND */}
                <LottieView
                    source={require('../../assets/images/Fireworks Teal and Red.json')}
                    autoPlay
                    loop
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.65,
                    }}
                />

                {/* CONTENT ABOVE LOTTIE */}
                <View className="flex-row w-full items-center justify-between mt-2">
                    <Text className="text-white text-2xl font-bold">3BEE CRACKER</Text>
                    <TouchableOpacity
                        className="w-12 h-12 bg-white rounded-full items-center justify-center"
                        onPress={() => router.push('/Notifications')}
                    >
                        <MaterialCommunityIcons name="bell-outline" size={28} color={COLORS.primary} />
                        {unreadCount > 0 && (
                            <View className="absolute top-1 right-1 bg-orange-600 rounded-full h-5 w-5 items-center justify-center border-2 border-white">
                                <Text className="text-white text-[10px] font-bold">{unreadCount > 9 ? '9+' : unreadCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>



                <View className="w-full h-12 bg-white rounded-xl flex-row items-center px-4 shadow-md ">
                    <MaterialCommunityIcons name="magnify" size={24} color="#999" />
                    <TextInput
                        placeholder="Search products..."
                        placeholderTextColor="#999"
                        className="flex-1 ml-2 text-gray-800 font-medium"
                        value={searchValue}
                        onChangeText={onChangeText}
                    />
                </View>
            </View>
        </View>
    )
}
