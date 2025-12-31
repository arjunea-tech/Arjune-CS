import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../Components/ui/theme';

export default function Orders() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (params.search) {
            setSearchQuery(params.search);
        }
    }, [params.search]);

    const tabs = ['All', 'Pending', 'Shipped', 'Delivered'];

    // Mock Order Data
    const orders = [
        {
            id: 'ORD-1001',
            customer: 'Aarav Patel',
            amount: '₹4,499',
            status: 'Pending',
            date: '12 Oct, 10:30 AM',
            items: 'Premium Diya Set x2, Laptop Sleeve'
        },
        {
            id: 'ORD-1002',
            customer: 'Priya Sharma',
            amount: '₹1,299',
            status: 'Shipped',
            date: '11 Oct, 04:15 PM',
            items: 'Brass Puja Thali'
        },
        {
            id: 'ORD-1003',
            customer: 'Rohan Gupta',
            amount: '₹899',
            status: 'Delivered',
            date: '10 Oct, 09:00 AM',
            items: 'Luxury Gift Box'
        },
        {
            id: 'ORD-1004',
            customer: 'Ananya Singh',
            amount: '₹2,500',
            status: 'Pending',
            date: '12 Oct, 11:45 AM',
            items: 'Laxmi Ganesh Idol'
        },
        {
            id: 'ORD-1005',
            customer: 'Vikram M',
            amount: '₹450',
            status: 'Delivered',
            date: '09 Oct, 02:20 PM',
            items: 'Marigold Garland x2'
        },
    ];

    const filteredOrders = orders.filter(order => {
        const matchesTab = activeTab === 'All' || order.status === activeTab;
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-orange-100 text-orange-700';
            case 'Shipped': return 'bg-blue-100 text-blue-700';
            case 'Delivered': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const renderOrderItem = ({ item }) => (
        <View className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
                <View>
                    <Text className="text-base font-bold text-gray-800">{item.id}</Text>
                    <Text className="text-xs text-gray-500">{item.date}</Text>
                </View>
                <View className={`rounded px-2 py-1 ${getStatusColor(item.status)}`}>
                    <Text className="text-[10px] font-bold">{item.status}</Text>
                </View>
            </View>

            <View className="my-3 h-[1px] bg-gray-50" />

            <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                    <Text className="text-sm font-bold text-gray-700">{item.customer}</Text>
                    <Text className="text-xs text-gray-400" numberOfLines={1}>{item.items}</Text>
                </View>
                <View>
                    <Text className="text-base font-bold text-orange-600">{item.amount}</Text>
                </View>
            </View>

            <View className="mt-3 flex-row justify-end space-x-2 gap-2">
                <TouchableOpacity
                    className="rounded-lg border border-gray-200 px-3 py-1.5"
                    onPress={() => router.push('OrderDetails')}
                >
                    <Text className="text-xs font-semibold text-gray-600">Details</Text>
                </TouchableOpacity>
                <TouchableOpacity className="rounded-lg bg-orange-500 px-3 py-1.5">
                    <Text className="text-xs font-semibold text-white">Update Status</Text>
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
                    Orders
                </Text>
            </View>

            {/* Search */}
            <View className="bg-white px-5 py-2">
                <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search order ID or customer..."
                        className="ml-2 flex-1 text-gray-800"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Tabs */}
            <View className="bg-white pb-3 pt-1">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                    {tabs.map(tab => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`mr-2 rounded-full border px-5 py-2 ${activeTab === tab
                                ? 'bg-orange-500 border-orange-500' // Solid active state
                                : 'bg-white border-gray-200'
                                }`}
                        >
                            <Text
                                className={`text-sm font-bold ${activeTab === tab ? 'text-white' : 'text-gray-600'
                                    }`}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* List */}
            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={renderOrderItem}
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View className="mt-10 items-center">
                        <Text className="text-gray-400">No orders found.</Text>
                    </View>
                )}
            />
        </View>
    );
}
