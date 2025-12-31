import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dropdown } from 'react-native-element-dropdown';
import AnalyticsBox from '../../Components/AdminComponents/AnalyticsBox';
import RecentOrdersCard from '../../Components/AdminComponents/RecentOrdersCard';
import { THEME } from '../../Components/ui/theme';
import { useAuth } from '../../Components/utils/AuthContext';

const screenWidth = Dimensions.get("window").width;

export default function AdminMain() {
    const [value, setValue] = useState('1'); // Default to 'This Week'
    const router = useRouter();
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/(auth)/Login');
                    },
                },
            ]
        );
    };

    // Mock data based on the period selection
    const chartDataMap = {
        '1': { // This Week
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{ data: [20, 45, 28, 80, 99, 43, 50], color: () => THEME.colors.primary }]
        },
        '2': { // This Month
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [{ data: [150, 230, 180, 320], color: () => THEME.colors.primary }]
        },
        '3': { // This Year
            labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
            datasets: [{ data: [1200, 2100, 1500, 3000, 2800, 3500], color: () => THEME.colors.primary }]
        }
    };

    const analyticsBoxDetails = [
        { icon: <Ionicons name="cash" size={24} color="#FF6B00" />, label: 'Total Sales', price: '$12,345', isIncrease: true, percentage: '8.5%' },
        { icon: <Ionicons name="people" size={24} color="#FF6B00" />, label: 'Total Users', price: '1,234', isIncrease: false, percentage: '2.1%' },
        { icon: <Ionicons name="cart" size={24} color="#FF6B00" />, label: 'Total Orders', price: '567', isIncrease: true, percentage: '5.4%' },
    ];

    const dropdownData = [
        { label: 'This Week', value: '1' },
        { label: 'This Month', value: '2' },
        { label: 'This Year', value: '3' },
    ];

    const quickActionItems = [
        { icon: <Ionicons name="cart" size={24} color="#FF6B00" />, label: 'Products', onPress: () => { router.push('/(admin)/Inventory') } },
        { icon: <Ionicons name="person" size={24} color="#FF6B00" />, label: 'Users', onPress: () => { router.push('/(admin)/Users') } },
        { icon: <Ionicons name="settings" size={24} color="#FF6B00" />, label: 'Settings', onPress: () => { router.push('/(admin)/Settings') } },
        { icon: <Ionicons name="wallet" size={24} color="#FF6B00" />, label: 'Chit Fund', onPress: () => { router.push('/(admin)/ChitManagement') } },
        { icon: <Ionicons name="grid" size={24} color="#FF6B00" />, label: 'Categories', onPress: () => { router.push('/(admin)/Categories') } },
        { icon: <Ionicons name="images" size={24} color="#FF6B00" />, label: 'Banners', onPress: () => { router.push('/(admin)/BannerManagement') } },
    ]

    const recentOrders = [
        {
            name: 'Product Name',
            orderId: 'Order ID',
            time: new Date().getMinutes() + ' ' + new Date().getHours(),
            price: '$123',
            isPaid: true,
        },
        {
            name: 'Product Name',
            orderId: 'Order ID',
            time: new Date().getMinutes() + ' ' + new Date().getHours(),
            price: '$123',
            isPaid: true,
        },
        {
            name: 'Product Name',
            orderId: 'Order ID',
            time: new Date().getMinutes() + ' ' + new Date().getHours(),
            price: '$123',
            isPaid: false,
        },
    ]

    return (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="items-center pb-10 bg-orange-50 pt-1">


                {/* Header */}
                <View className="flex-row items-center justify-between w-11/12 mt-5">
                    <View className="flex-row items-center">
                        <Text className="text-xl font-bold">Admin</Text>
                        <Text className="text-xl font-bold" style={{ color: THEME.colors.primary }}>Panel</Text>
                    </View>
                    <TouchableOpacity onPress={handleLogout} className="p-2">
                        <Ionicons name="log-out-outline" size={24} color={THEME.colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Good Morning Box */}
                <View className="w-11/12 h-40 bg-white rounded-2xl mt-5 p-5">
                    <Text className="text-lg font-bold">Good Morning, Admin!</Text>
                    <Text className="text-sm text-gray-600 mt-2">Here's what's happening today.</Text>
                </View>

                {/* Horizontal Analytics */}
                <ScrollView
                    className="w-full mt-5"
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
                >
                    {analyticsBoxDetails.map((detail, index) => (
                        <AnalyticsBox key={index} {...detail} />
                    ))}
                </ScrollView>

                <View className="w-11/12 mt-8 p-4 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <View className="flex-row items-center justify-between mb-4">
                        <View>
                            <Text className="text-gray-400 text-xs">Total Revenue</Text>
                            <Text className="text-black text-xl font-bold">21,450</Text>
                            <Text className="text-green-500 text-xs font-bold">12.5%</Text>
                        </View>

                        <View className="w-32">
                            <Dropdown
                                style={{ height: 30, backgroundColor: THEME.colors.primary, borderRadius: 15, paddingHorizontal: 10 }}
                                placeholderStyle={{ fontSize: 10, color: '#fff' }}
                                selectedTextStyle={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}
                                iconColor="white"
                                data={dropdownData}
                                labelField="label"
                                valueField="value"
                                value={value}
                                onChange={item => setValue(item.value)}
                            />
                        </View>
                    </View>

                    {/* The Dynamic Chart */}
                    <LineChart
                        data={chartDataMap[value]}
                        width={screenWidth * 0.85}
                        height={200}
                        chartConfig={{
                            backgroundColor: "#fff",
                            backgroundGradientFrom: "#fff",
                            backgroundGradientTo: "#fff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`, // Using your primary orange
                            labelColor: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
                            style: { borderRadius: 16 },
                            propsForDots: { r: "4", strokeWidth: "2", stroke: "#FF6B00" },
                            propsForBackgroundLines: { strokeDasharray: "" }, // Solid lines for a cleaner look
                        }}
                        bezier // Curves the lines like in your image
                        style={{ marginVertical: 8, borderRadius: 16, marginLeft: -15 }}
                    />
                </View>
                <View className="mt-8 w-11/12">
                    <Text className="text-xl font-bold ">Options</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }} className="mt-5">
                        {
                            quickActionItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="flex-coloumns items-center justify-center"
                                    onPress={item.onPress}
                                >
                                    <View className="bg-white rounded-full p-2 w-16 h-16 items-center justify-center">
                                        {item.icon}
                                    </View>
                                    <Text className="text-center mt-1">{item.label}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
                <View className="w-11/12">
                    <View className="flex-row items-center justify-between mt-8 mb-2">
                        <Text className="text-xl font-bold">Recent Orders</Text>
                        <TouchableOpacity onPress={() => router.push('/(admin)/Orders')}>
                            <Text className="text-sm font-bold text-orange-500">View All</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="">
                        {
                            recentOrders.map((order, index) => (
                                <RecentOrdersCard key={index} {...order} />
                            ))
                        }
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
