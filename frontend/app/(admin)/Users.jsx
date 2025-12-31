import { Image } from 'expo-image';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../Components/ui/theme';

export default function Users() {
    const router = useRouter();
    const [search, setSearch] = useState('');

    // Mock User Data
    const users = [
        {
            id: '1',
            name: 'Aarav Patel',
            email: 'aarav.patel@example.com',
            status: 'Active',
            role: 'Customer',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80',
            joinDate: '12 Oct, 2023'
        },
        {
            id: '2',
            name: 'Priya Sharma',
            email: 'priya.sharma@example.com',
            status: 'Active',
            role: 'Customer',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
            joinDate: '05 Nov, 2023'
        },
        {
            id: '3',
            name: 'Rohan Gupta',
            email: 'rohan.g@example.com',
            status: 'Inactive',
            role: 'Customer',
            avatar: null, // No image to test initials/placeholder
            joinDate: '20 Sep, 2023'
        },
        {
            id: '4',
            name: 'Ananya Singh',
            email: 'ananya.singh@example.com',
            status: 'Blocked',
            role: 'Reseller',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80',
            joinDate: '01 Dec, 2023'
        },
        {
            id: '5',
            name: 'Vikram Malhotra',
            email: 'vikram.m@example.com',
            status: 'Active',
            role: 'Customer',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
            joinDate: '15 Jan, 2024'
        },
    ];

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Inactive': return 'bg-gray-100 text-gray-700';
            case 'Blocked': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const renderUserItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => router.push('/(admin)/UserDetails')}
            className="mb-4 flex-row items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
            <View className="flex-row items-center flex-1">
                {/* Avatar */}
                <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-orange-100 overflow-hidden">
                    {item.avatar ? (
                        <Image
                            source={{ uri: item.avatar }}
                            className="h-full w-full"
                            contentFit="cover"
                            transition={200}
                        />
                    ) : (
                        <Text className="text-lg font-bold text-orange-600">{item.name.charAt(0)}</Text>
                    )}
                </View>

                {/* Info */}
                <View className="flex-1">
                    <Text className="text-base font-bold text-gray-800" numberOfLines={1}>{item.name}</Text>
                    <Text className="text-xs text-gray-500" numberOfLines={1}>{item.email}</Text>
                </View>
            </View>

            {/* Status & Action */}
            <View className="items-end">
                <View className={`mb-1 rounded px-2 py-0.5 ${getStatusColor(item.status)}`}>
                    <Text className="text-[10px] font-bold">{item.status}</Text>
                </View>
                <TouchableOpacity>
                    <MaterialIcons name="more-horiz" size={20} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center gap-2 bg-white p-3">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold" style={{ color: THEME.colors.primary }}>
                    Manage Users
                </Text>
            </View>

            {/* Stats Header */}
            <View className="flex-row justify-between px-5 pt-4 pb-2">
                <View className="items-center bg-white p-3 rounded-xl flex-1 mr-2 shadow-sm border border-gray-100">
                    <Text className="text-gray-500 text-xs font-bold uppercase">Total</Text>
                    <Text className="text-xl font-bold text-gray-800">{users.length}</Text>
                </View>
                <View className="items-center bg-white p-3 rounded-xl flex-1 mr-2 shadow-sm border border-gray-100">
                    <Text className="text-green-600 text-xs font-bold uppercase">Active</Text>
                    <Text className="text-xl font-bold text-gray-800">
                        {users.filter(u => u.status === 'Active').length}
                    </Text>
                </View>
                <View className="items-center bg-white p-3 rounded-xl flex-1 shadow-sm border border-gray-100">
                    <Text className="text-red-500 text-xs font-bold uppercase">Blocked</Text>
                    <Text className="text-xl font-bold text-gray-800">
                        {users.filter(u => u.status === 'Blocked').length}
                    </Text>
                </View>
            </View>

            {/* Search Bar */}
            <View className="px-5 py-2">
                <View className="flex-row items-center rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search name or email..."
                        className="ml-2 flex-1 text-gray-800"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            {/* User List */}
            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                renderItem={renderUserItem}
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View className="mt-10 items-center justify-center">
                        <Text className="text-gray-400">No users found</Text>
                    </View>
                )}
            />
        </View>
    );
}
