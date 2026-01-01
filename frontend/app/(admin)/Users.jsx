import { Image } from 'expo-image';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { THEME } from '../../Components/ui/theme';
import api from '../../Components/api/config';
import { useFocusEffect } from '@react-navigation/native';

export default function Users() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            if (res.data.success) {
                const mapped = res.data.data.map(u => ({
                    id: u._id,
                    name: u.name,
                    email: u.email,
                    status: u.status || 'Active', // Default to Active if undefined
                    role: u.role,
                    avatar: u.avatar, // Assuming avatar URL logic
                    joinDate: new Date(u.createdAt).toLocaleDateString()
                }));
                setUsers(mapped);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUsers();
        }, [])
    );

    const handleToggleStatus = (user) => {
        const newStatus = user.status === 'Blocked' ? 'Active' : 'Blocked';
        const action = newStatus === 'Blocked' ? 'Block' : 'Unblock';

        Alert.alert(
            `Confirm ${action}`,
            `Are you sure you want to ${action.toLowerCase()} ${user.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const res = await api.put(`/users/${user.id}`, { status: newStatus });
                            if (res.data.success) {
                                Alert.alert('Success', `User ${newStatus === 'Blocked' ? 'blocked' : 'unblocked'} successfully.`);
                                fetchUsers();
                            }
                        } catch (error) {
                            Alert.alert('Error', `Failed to ${action.toLowerCase()} user.`);
                        }
                    }
                }
            ]
        );
    };

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
        <View
            className="mb-4 flex-row items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
            <TouchableOpacity
                className="flex-row items-center flex-1"
                onPress={() => Alert.alert('User Details', `Name: ${item.name}\nEmail: ${item.email}\nJoined: ${item.joinDate}\nRole: ${item.role}`)}
            >
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
            </TouchableOpacity>

            {/* Status & Action */}
            <View className="items-end gap-2">
                <View className={`mb-1 rounded px-2 py-0.5 ${getStatusColor(item.status)}`}>
                    <Text className="text-[10px] font-bold">{item.status}</Text>
                </View>
                <TouchableOpacity onPress={() => handleToggleStatus(item)} style={{ padding: 4 }}>
                    <Text style={{ color: item.status === 'Blocked' ? 'green' : 'red', fontSize: 10, fontWeight: 'bold' }}>
                        {item.status === 'Blocked' ? 'UNBLOCK' : 'BLOCK'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
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
                        <Text className="text-gray-400">{loading ? 'Loading...' : 'No users found'}</Text>
                    </View>
                )}
            />
        </View>
    );
}
