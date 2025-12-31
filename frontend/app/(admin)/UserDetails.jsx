import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function UserDetails() {
    const router = useRouter();

    const [userStatus, setUserStatus] = useState('Active');

    const user = {
        name: 'Aarav Patel',
        id: 'USR-8821',
        email: 'aarav.patel@example.com',
        phone: '+91 98765 43210',
        joined: 'Oct 15, 2022',
        stats: {
            totalSpent: '₹12,450',
            orders: 14,
            avgOrder: '₹889'
        },
        recentOrders: [
            { id: 'ORD-1001', date: 'Oct 12, 2023', total: '₹2,644', status: 'Pending' },
            { id: 'ORD-0922', date: 'Sep 28, 2023', total: '₹1,200', status: 'Delivered' },
            { id: 'ORD-0850', date: 'Aug 10, 2023', total: '₹4,500', status: 'Delivered' },
        ]
    };

    const handleStatusChange = () => {
        Alert.alert(
            "Change User Status",
            "Select the new status for this user:",
            [
                { text: "Active", onPress: () => setUserStatus('Active') },
                { text: "Blocked", style: "destructive", onPress: () => setUserStatus('Blocked') },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    const InfoRow = ({ icon, label, value }) => (
        <View className="flex-row items-center mb-4">
            <View className="h-10 w-10 bg-gray-50 rounded-full items-center justify-center mr-4">
                {icon}
            </View>
            <View>
                <Text className="text-xs text-gray-400 font-medium">{label}</Text>
                <Text className="text-sm font-bold text-gray-800">{value}</Text>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header with Background */}
            <View className="bg-orange-500 pt-4 pb-16 px-4">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">Customer Profile</Text>
                    <TouchableOpacity onPress={handleStatusChange}>
                        <Ionicons name="ellipsis-vertical" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 -mt-10 px-5" showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <View className="bg-white rounded-2xl shadow-sm p-6 items-center border border-gray-100 mb-5">
                    <View className="h-20 w-20 bg-gray-200 rounded-full mb-3 items-center justify-center mt-1 border-4 border-white shadow-sm">
                        <Text className="text-3xl font-bold text-gray-500">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </Text>
                    </View>
                    <Text className="text-xl font-bold text-gray-800">{user.name}</Text>
                    <Text className="text-sm text-gray-500 mb-2">{user.id}</Text>
                    <View className={`${userStatus === 'Active' ? 'bg-green-100' : 'bg-red-100'} px-3 py-1 rounded-full`}>
                        <Text className={`${userStatus === 'Active' ? 'text-green-700' : 'text-red-700'} text-xs font-bold`}>{userStatus}</Text>
                    </View>
                </View>

                {/* Stats Grid */}
                <View className="flex-row justify-between mb-5 gap-3">
                    <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm items-center">
                        <Text className="text-xs text-gray-400 font-bold uppercase mb-1">Spent</Text>
                        <Text className="text-lg font-bold text-orange-600">{user.stats.totalSpent}</Text>
                    </View>
                    <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm items-center">
                        <Text className="text-xs text-gray-400 font-bold uppercase mb-1">Orders</Text>
                        <Text className="text-lg font-bold text-gray-800">{user.stats.orders}</Text>
                    </View>
                    <View className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm items-center">
                        <Text className="text-xs text-gray-400 font-bold uppercase mb-1">Avg</Text>
                        <Text className="text-lg font-bold text-gray-800">{user.stats.avgOrder}</Text>
                    </View>
                </View>

                {/* Contact Info */}
                <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-gray-100">
                    <Text className="text-sm font-bold text-gray-500 uppercase mb-4">Contact Information</Text>
                    <InfoRow
                        icon={<Ionicons name="mail-outline" size={20} color="gray" />}
                        label="Email Address"
                        value={user.email}
                    />
                    <InfoRow
                        icon={<Ionicons name="call-outline" size={20} color="gray" />}
                        label="Phone Number"
                        value={user.phone}
                    />
                    <InfoRow
                        icon={<Ionicons name="calendar-outline" size={20} color="gray" />}
                        label="Joined Date"
                        value={user.joined}
                    />
                </View>

                {/* Recent Orders */}
                <View className="bg-white rounded-2xl p-5 mb-10 shadow-sm border border-gray-100">
                    <Text className="text-sm font-bold text-gray-500 uppercase mb-4">Order History</Text>
                    {user.recentOrders.map((order, index) => (
                        <View key={index} className="flex-row items-center justify-between py-3 border-b border-gray-50 last:border-0">
                            <View>
                                <Text className="font-bold text-gray-800">{order.id}</Text>
                                <Text className="text-xs text-gray-400">{order.date}</Text>
                            </View>
                            <View className="items-end">
                                <Text className="font-bold text-gray-800 mb-1">{order.total}</Text>
                                <Text className={`text-[10px] items-center px-2 py-0.5 rounded ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                    }`}>{order.status}</Text>
                            </View>
                        </View>
                    ))}
                    <TouchableOpacity
                        className="mt-4 py-2 bg-gray-50 rounded-lg items-center"
                        onPress={() => router.push({ pathname: 'Orders', params: { search: user.name } })}
                    >
                        <Text className="text-xs font-bold text-gray-600">View All Orders</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}
