import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../Components/ui/theme';

export default function Settings() {
    const navigation = useNavigation();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const SettingItem = ({ icon, label, subLabel, onPress, isSwitch, switchValue, onSwitchChange, isDestructive }) => (
        <TouchableOpacity
            onPress={isSwitch ? () => onSwitchChange && onSwitchChange(!switchValue) : onPress}
            className="mb-1 flex-row items-center justify-between border-b border-gray-50 bg-white px-4 py-4 active:bg-gray-50 last:border-0"
            disabled={isSwitch}
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

            {isSwitch ? (
                <Switch
                    trackColor={{ false: '#E5E7EB', true: '#FF6B00' }}
                    thumbColor={'#FFFFFF'}
                    ios_backgroundColor="#E5E7EB"
                    onValueChange={onSwitchChange}
                    value={switchValue}
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            )}
        </TouchableOpacity>
    );

    const SectionHeader = ({ title }) => (
        <Text className="mb-2 mt-6 px-4 text-xs font-bold uppercase text-gray-500">{title}</Text>
    );

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center gap-2 bg-white p-3">
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
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' }}
                            className="h-24 w-24 rounded-full"
                        />
                        <TouchableOpacity className="absolute bottom-0 right-0 rounded-full bg-orange-500 p-2 border-2 border-white">
                            <Ionicons name="camera" size={14} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-xl font-bold text-gray-800">Admin User</Text>
                    <Text className="text-gray-500">admin@crackershop.com</Text>
                    <View className="mt-3 rounded-full bg-orange-100 px-3 py-1">
                        <Text className="text-xs font-bold text-orange-700">Super Admin</Text>
                    </View>
                </View>

                {/* Account Settings */}
                <View>
                    <SectionHeader title="Account" />
                    <View className="mx-4 overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                        <SettingItem
                            icon={<Ionicons name="person-outline" size={20} color="#4B5563" />}
                            label="Edit Profile"
                            subLabel="Name, Email, Profile Photo"
                            onPress={() => { }}
                        />
                        <SettingItem
                            icon={<Ionicons name="lock-closed-outline" size={20} color="#4B5563" />}
                            label="Change Password"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                {/* App Settings */}
                <View>
                    <SectionHeader title="Preferences" />
                    <View className="mx-4 overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                        <SettingItem
                            icon={<Ionicons name="notifications-outline" size={20} color="#4B5563" />}
                            label="Push Notifications"
                            isSwitch
                            switchValue={notificationsEnabled}
                            onSwitchChange={setNotificationsEnabled}
                        />
                        <SettingItem
                            icon={<Ionicons name="moon-outline" size={20} color="#4B5563" />}
                            label="Dark Mode"
                            isSwitch
                            switchValue={isDarkMode}
                            onSwitchChange={setIsDarkMode}
                        />
                        <SettingItem
                            icon={<Ionicons name="globe-outline" size={20} color="#4B5563" />}
                            label="Language"
                            subLabel="English (US)"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                {/* Support */}
                <View>
                    <SectionHeader title="Support" />
                    <View className="mx-4 overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                        <SettingItem
                            icon={<MaterialIcons name="help-outline" size={20} color="#4B5563" />}
                            label="Help Center"
                            onPress={() => { }}
                        />
                        <SettingItem
                            icon={<MaterialIcons name="privacy-tip" size={20} color="#4B5563" />}
                            label="Privacy Policy"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                {/* Logout */}
                <View className="mx-4 mt-8 mb-10">
                    <TouchableOpacity className="flex-row items-center justify-center rounded-xl bg-red-50 py-4 active:bg-red-100">
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" className="mr-2" />
                        <Text className="font-bold text-red-500">Log Out</Text>
                    </TouchableOpacity>
                    <Text className="mt-4 text-center text-xs text-gray-400">Version 1.0.0 (Build 124)</Text>
                </View>

            </ScrollView>
        </View>
    );
}
