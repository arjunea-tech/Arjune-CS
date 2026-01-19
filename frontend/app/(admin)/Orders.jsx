import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { THEME } from '../../Components/ui/theme';
import api from '../../Components/api/config';
import { useFocusEffect } from '@react-navigation/native';
import { printOrdersReport } from '../../Components/utils/ReportUtils';

export default function Orders() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('All');
    const [timeFilter, setTimeFilter] = useState('All Time');
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState([]);

    const timeFilters = ['All Time', 'Today', 'This Week', 'This Month'];

    useEffect(() => {
        if (params.search) {
            setSearchQuery(params.search);
        }
    }, [params.search]);

    const handlePrint = async () => {
        try {
            await printOrdersReport(filteredOrders, `${activeTab} - ${timeFilter}`);
        } catch (error) {
            Alert.alert('Error', 'Failed to generate report');
        }
    };

    const loadOrders = async () => {
        try {
            const response = await api.get('/orders');
            if (response.data.success) {
                const mapped = response.data.data.map(o => ({
                    id: o._id,
                    customer: o.user?.name || 'Guest',
                    amount: `₹${o.totalPrice}`,
                    status: o.orderStatus,
                    date: new Date(o.createdAt).toLocaleDateString(),
                    rawDate: new Date(o.createdAt),
                    items: o.orderItems.map(i => i.name).join(', ')
                })).sort((a, b) => b.rawDate - a.rawDate);
                setOrders(mapped);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load orders');
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadOrders();
        }, [])
    );

    const handleUpdateStatus = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'Requested' ? 'Processing' :
            currentStatus === 'Processing' ? 'Shipped' :
                currentStatus === 'Shipped' ? 'Out for Delivery' :
                    currentStatus === 'Out for Delivery' ? 'Delivered' : 'Delivered';

        if (nextStatus === currentStatus) return; // Already delivered

        try {
            const res = await api.put(`/orders/${id}/status`, { status: nextStatus });
            if (res.data.success) {
                Alert.alert('Success', `Order updated to ${nextStatus}`);
                loadOrders(); // Refresh
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update status');
        }
    };

    const tabs = ['All', 'Requested', 'Processing', 'Shipped', 'Delivered'];

    const filteredOrders = orders.filter(order => {
        // Status filter
        const statusMatch = activeTab === 'All' || order.status === activeTab;

        // Search filter
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase());

        // Time filter
        const now = new Date();
        const orderDate = new Date(order.rawDate);
        let timeMatch = true;

        if (timeFilter === 'Today') {
            timeMatch = orderDate.toDateString() === now.toDateString();
        } else if (timeFilter === 'This Week') {
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            timeMatch = orderDate >= weekAgo;
        } else if (timeFilter === 'This Month') {
            timeMatch = orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        }

        return statusMatch && matchesSearch && timeMatch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Requested': return 'bg-red-100 text-red-700';
            case 'Processing': return 'bg-orange-100 text-orange-700';
            case 'Shipped': return 'bg-blue-100 text-blue-700';
            case 'Out for Delivery': return 'bg-purple-100 text-purple-700';
            case 'Delivered': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const renderOrderItem = ({ item }) => (
        <View className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
                <View>
                    <Text className="text-base font-bold text-gray-800">#{item.id.substring(item.id.length - 6)}</Text>
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
                    onPress={() => router.push({ pathname: '/(admin)/OrderDetails', params: { id: item.id } })}
                >
                    <Text className="text-xs font-semibold text-gray-600">Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="rounded-lg bg-orange-500 px-3 py-1.5"
                    onPress={() => handleUpdateStatus(item.id, item.status)}
                >
                    <Text className="text-xs font-semibold text-white">Next Status</Text>
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
                <TouchableOpacity onPress={handlePrint} className="ml-auto p-2">
                    <Ionicons name="print-outline" size={24} color={THEME.colors.primary} />
                </TouchableOpacity>
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

            {/* Time Filter Tabs */}
            <View className="bg-white pb-3 pt-1 border-b border-gray-50">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                    {timeFilters.map(f => (
                        <TouchableOpacity
                            key={f}
                            onPress={() => setTimeFilter(f)}
                            className={`mr-2 rounded-full border px-4 py-1 ${timeFilter === f ? 'bg-orange-500 border-orange-500' : 'bg-gray-50 border-gray-100'}`}
                        >
                            <Text className={`text-xs font-semibold ${timeFilter === f ? 'text-white' : 'text-gray-500'}`}>{f}</Text>
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
