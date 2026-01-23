import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../Components/ui/theme';
import { useAuth } from '../../Components/utils/AuthContext';
import { resolveImageUrl } from '../../Components/utils/imageUrl';

export default function Settings() {
    const navigation = useNavigation();
    const router = useRouter();
    const { user, logout } = useAuth();

    const SettingItem = ({ icon, label, subLabel, onPress, isDestructive }) => (
        <TouchableOpacity
            onPress={onPress}
            className="mb-1 flex-row items-center justify-between border-b border-gray-50 bg-white px-4 py-4 active:bg-gray-50 last:border-0"
        >
            <View className="flex-row items-center">
                <View className={`mr-4 items-center justify-center rounded-full p-2 ${isDestructive ? 'bg-red-50' : 'bg-gray-50'}`}>
                    {icon}
                </View>
                <View>
                    <Text className={`text-base font-medium ${isDestructive ? 'text-red-500' : 'text-gray-800'}`}>{label}</Text>
                    {subLabel && <Text className="text-xs text-gray-400">{subLabel}</Text>}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </TouchableOpacity>
    );

    const SectionHeader = ({ title }) => (
        <Text className="mb-2 mt-6 px-4 text-xs font-bold uppercase text-gray-500">{title}</Text>
    );

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center gap-2 bg-white p-3 shadow-sm z-10">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold" style={{ color: THEME.colors.primary }}>
                    Settings
                </Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <View className="m-4 items-center rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <View className="relative mb-3">
                        {user?.avatar ? (
                            <Image
                                source={{ uri: resolveImageUrl(user.avatar) }}
                                className="h-24 w-24 rounded-full"
                            />
                        ) : (
                            <View className="h-24 w-24 rounded-full bg-gray-200 items-center justify-center">
                                <Ionicons name="person" size={40} color="#aaa" />
                            </View>
                        )}
                        <TouchableOpacity
                            className="absolute bottom-0 right-0 rounded-full bg-orange-500 p-2 border-2 border-white"
                            onPress={() => router.push('/EditProfile')}
                        >
                            <Ionicons name="camera" size={14} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-xl font-bold text-gray-800">{user?.name || 'Admin User'}</Text>
                    <Text className="text-gray-500">{user?.email || 'admin@crackershop.com'}</Text>
                    <View className="mt-3 rounded-full bg-orange-100 px-3 py-1">
                        <Text className="text-xs font-bold text-orange-700 uppercase">{user?.role || 'Admin'}</Text>
                    </View>
                </View>

                {/* Account Settings */}
                <View>
                    <SectionHeader title="Account" />
                    <View className="mx-4 overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                        <SettingItem
                            icon={<Ionicons name="person-outline" size={20} color="#4B5563" />}
                            label="Edit Profile"
                            subLabel="Name, Address, Mobile Number"
                            onPress={() => router.push('/EditProfile')}
                        />
                        <SettingItem
                            icon={<Ionicons name="lock-closed-outline" size={20} color="#4B5563" />}
                            label="Change Password"
                            onPress={() => router.push('/(auth)/ForgetPassword')}
                        />
                    </View>
                </View>

                {/* Content Management */}
                <View>
                    <SectionHeader title="Content Management" />
                    <View className="mx-4 overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                        <SettingItem
                            icon={<Ionicons name="information-circle-outline" size={20} color="#4B5563" />}
                            label="About Us"
                            subLabel="Manage company information for users"
                            onPress={() => router.push('/(admin)/ManageAboutUs')}
                        />
                        <SettingItem
                            icon={<Ionicons name="card-outline" size={20} color="#4B5563" />}
                            label="Shipping & Fees"
                            subLabel="Manage shipping charges and fees"
                            onPress={() => router.push('/(admin)/ManageShippingFees')}
                        />
                    </View>
                </View>


                {/* Logout */}
                <View className="mx-4 mt-8 mb-10">
                    <TouchableOpacity
                        className="flex-row items-center justify-center rounded-xl bg-red-50 py-4 active:bg-red-100"
                        onPress={logout}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                        <Text className="font-bold text-red-500">Log Out</Text>
                    </TouchableOpacity>
                    <Text className="mt-4 text-center text-xs text-gray-400">Version 1.0.1 (Stable)</Text>
                </View>

            </ScrollView>
        </View>
    );
}
