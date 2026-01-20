import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { Alert, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dropdown } from 'react-native-element-dropdown';
import AnalyticsBox from '../../Components/AdminComponents/AnalyticsBox';
import RecentOrdersCard from '../../Components/AdminComponents/RecentOrdersCard';
import { THEME } from '../../Components/ui/theme';
import { useAuth } from '../../Components/utils/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../Components/api/config';
import { notificationsAPI } from '../../Components/api';

const screenWidth = Dimensions.get("window").width;

export default function AdminMain() {
    const [value, setValue] = useState('1'); // Default to 'This Week'
    const router = useRouter();
    const { logout, user } = useAuth();
    const [recentOrders, setRecentOrders] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalUsers: 0 // We don't have user API yet broadly used or public count
    });
    const [chartGrowth, setChartGrowth] = useState(0);
    const [allOrdersCache, setAllOrdersCache] = useState([]);

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

    useFocusEffect(
        useCallback(() => {
            fetchDashboardData();
        }, [])
    );

    const fetchDashboardData = async () => {
        try {
            // Check for users count (assuming users API exists and we have admin access)
            const usersRes = await api.get('/users');
            let totalUsers = 0;
            if (usersRes.data.success) {
                totalUsers = usersRes.data.count;
            }

            const res = await api.get('/orders');
            if (res.data.success) {
                const allOrders = res.data.data;

                // Calculate stats
                const totalSales = allOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
                const totalOrders = allOrders.length;

                // Calculate Growth (Current Month vs Last Month)
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const lastMonth = lastMonthDate.getMonth();
                const lastMonthYear = lastMonthDate.getFullYear();

                let currentMonthSales = 0;
                let lastMonthSales = 0;
                let currentMonthOrders = 0;
                let lastMonthOrders = 0;

                allOrders.forEach(order => {
                    const d = new Date(order.createdAt);
                    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
                        currentMonthSales += (order.totalPrice || 0);
                        currentMonthOrders += 1;
                    } else if (d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear) {
                        lastMonthSales += (order.totalPrice || 0);
                        lastMonthOrders += 1;
                    }
                });

                const calculateGrowth = (current, previous) => {
                    if (previous === 0) return current > 0 ? 100 : 0;
                    return ((current - previous) / previous) * 100;
                };

                const salesGrowth = calculateGrowth(currentMonthSales, lastMonthSales);
                const ordersGrowth = calculateGrowth(currentMonthOrders, lastMonthOrders);
                // For users, assuming we can get a "createdAt" from usersRes if available, otherwise 0
                const usersGrowth = 0; // Placeholder until user date is available

                setStats(prev => ({
                    ...prev,
                    totalSales,
                    totalOrders,
                    totalUsers,
                    salesGrowth,
                    ordersGrowth,
                    usersGrowth
                }));

                // Get recent 3 orders
                // Assuming backend returns sorted or we sort by createdAt desc
                const sorted = allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                const recent = sorted.slice(0, 3).map(o => ({
                    name: o.user?.name || 'Guest',
                    orderId: o._id.substring(o._id.length - 6),
                    time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    price: `₹${o.totalPrice}`,
                    isPaid: true
                }));

                setRecentOrders(recent);

                // Fetch unread notifications count
                const notifRes = await notificationsAPI.getNotifications();
                // Since notificationsAPI returns the data directly if successful or throws
                if (notifRes && Array.isArray(notifRes.data)) {
                    const unread = notifRes.data.filter(n => !n.isRead).length;
                    setUnreadNotifications(unread);
                } else if (notifRes && Array.isArray(notifRes)) {
                    const unread = notifRes.filter(n => !n.isRead).length;
                    setUnreadNotifications(unread);
                }

                // Process chart data
                processChartData(allOrders);
            }
        } catch (error) {
            console.error('Dashboard fetch error:', error);
        }
    };

    const [chartData, setChartData] = useState({
        '1': {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{ data: [0, 0, 0, 0, 0, 0, 0], color: () => THEME.colors.primary }]
        },
        '2': {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [{ data: [0, 0, 0, 0], color: () => THEME.colors.primary }]
        },
        '3': {
            labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
            datasets: [{ data: [0, 0, 0, 0, 0, 0], color: () => THEME.colors.primary }]
        }
    });



    const processChartData = (orders) => {
        // Helper to check if date is in current week/month/year
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // --- Weekly Data (Current Week) ---
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay() || 7; // Get current day number, make Sunday 7
        if (day !== 1) startOfWeek.setHours(-24 * (day - 1)); // Go back to Monday
        else startOfWeek.setHours(0, 0, 0, 0); // It is monday
        startOfWeek.setMinutes(0, 0, 0); // Reset minutes, seconds, milliseconds

        const weeklyData = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun

        // --- Monthly Data (Current Month) ---
        const monthlyData = [0, 0, 0, 0]; // 4 Weeks roughly

        // --- Yearly Data (Current Year) ---
        const yearlyData = new Array(12).fill(0);

        // For growth Calc
        let currentPeriodTotal = 0;
        let previousPeriodTotal = 0;

        // Previous Week Start
        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
        const endOfLastWeek = new Date(startOfWeek); // Start of this week is end of last

        // Previous Month
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthMonth = lastMonthDate.getMonth();
        const lastMonthYear = lastMonthDate.getFullYear();

        // Previous Year
        const lastYear = currentYear - 1;


        orders.forEach(order => {
            const date = new Date(order.createdAt);
            const amt = order.totalPrice || 0;

            // Weekly
            if (date >= startOfWeek) {
                const dayIndex = date.getDay();
                const mapIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                weeklyData[mapIndex] += amt;
                if (value === '1') currentPeriodTotal += amt;
            } else if (value === '1' && date >= startOfLastWeek && date < endOfLastWeek) {
                previousPeriodTotal += amt;
            }

            // Monthly
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                const dom = date.getDate();
                const weekIdx = Math.min(Math.floor((dom - 1) / 7), 3);
                monthlyData[weekIdx] += amt;
                if (value === '2') currentPeriodTotal += amt;
            } else if (value === '2' && date.getMonth() === lastMonthMonth && date.getFullYear() === lastMonthYear) {
                previousPeriodTotal += amt;
            }

            // Yearly
            if (date.getFullYear() === currentYear) {
                yearlyData[date.getMonth()] += amt;
                if (value === '3') currentPeriodTotal += amt;
            } else if (value === '3' && date.getFullYear() === lastYear) {
                previousPeriodTotal += amt;
            }
        });

        // Calculate Growth for Chart Header
        let growth = 0;
        if (previousPeriodTotal === 0) growth = currentPeriodTotal > 0 ? 100 : 0;
        else growth = ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100;
        setChartGrowth(growth);

        // Actually, better to just show values for those specific months.
        const yearlyPoints = [yearlyData[0], yearlyData[2], yearlyData[4], yearlyData[6], yearlyData[8], yearlyData[10]];


        setChartData({
            '1': {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{ data: weeklyData, color: () => THEME.colors.primary }]
            },
            '2': {
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                datasets: [{ data: monthlyData, color: () => THEME.colors.primary }]
            },
            '3': {
                labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
                datasets: [{ data: yearlyPoints, color: () => THEME.colors.primary }]
            }
        });
    };

    // Re-run processChartData when 'value' (dropdown) changes, but we need orders.
    // Since 'fetchDashboardData' runs once, we might need to store 'allOrders' in state 
    // to re-process when 'value' changes.

    useEffect(() => {
        if (allOrdersCache.length > 0) {
            processChartData(allOrdersCache);
        }
    }, [value, allOrdersCache]);


    const analyticsBoxDetails = [
        {
            icon: <Ionicons name="cash" size={24} color="#FF6B00" />,
            label: 'Total Sales',
            price: `₹${(stats.totalSales || 0).toLocaleString()}`,
            isIncrease: (stats.salesGrowth || 0) >= 0,
            percentage: `${Math.abs(stats.salesGrowth || 0).toFixed(1)}%`
        },
        {
            icon: <Ionicons name="people" size={24} color="#FF6B00" />,
            label: 'Total Users',
            price: String(stats.totalUsers || 0),
            isIncrease: (stats.usersGrowth || 0) >= 0,
            percentage: `${Math.abs(stats.usersGrowth || 0).toFixed(1)}%`
        },
        {
            icon: <Ionicons name="cart" size={24} color="#FF6B00" />,
            label: 'Total Orders',
            price: String(stats.totalOrders || 0),
            isIncrease: (stats.ordersGrowth || 0) >= 0,
            percentage: `${Math.abs(stats.ordersGrowth || 0).toFixed(1)}%`
        },
    ];

    const dropdownData = [
        { label: 'This Week', value: '1' },
        { label: 'This Month', value: '2' },
        { label: 'This Year', value: '3' },
    ];

    const quickActionItems = [
        { icon: <Ionicons name="cart" size={24} color="#FF6B00" />, label: 'Products', onPress: () => { router.push('/(admin)/Inventory') } },
        { icon: <Ionicons name="person" size={24} color="#FF6B00" />, label: 'Users', onPress: () => { router.push('/(admin)/Users') } },
        { icon: <Ionicons name="wallet" size={24} color="#FF6B00" />, label: 'Chit Fund', onPress: () => { router.push('/(admin)/ChitManagement') } },
        { icon: <Ionicons name="grid" size={24} color="#FF6B00" />, label: 'Categories', onPress: () => { router.push('/(admin)/Categories') } },
        { icon: <Ionicons name="images" size={24} color="#FF6B00" />, label: 'Banners', onPress: () => { router.push('/(admin)/BannerManagement') } },
        { icon: <Ionicons name="list" size={24} color="#FF6B00" />, label: 'Orders', onPress: () => { router.push('/(admin)/Orders') } },
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
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity onPress={() => router.push('/Notifications')} className="p-2 relative">
                            <Ionicons name="notifications-outline" size={24} color={THEME.colors.primary} />
                            {unreadNotifications > 0 && (
                                <View className="absolute top-2 right-2 bg-red-500 rounded-full h-4 w-4 items-center justify-center border border-white">
                                    <Text className="text-white text-[8px] font-bold">{unreadNotifications}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/(admin)/Settings')} className="p-2 flex-row items-center">
                            <Ionicons name="settings-outline" size={22} color={THEME.colors.primary} />
                            <Text className="ml-1 font-bold" style={{ color: THEME.colors.primary }}>Settings</Text>
                        </TouchableOpacity>
                    </View>
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
                            <Text className="text-black text-xl font-bold">₹{stats.totalSales.toLocaleString()}</Text>
                            <Text className={`text-xs font-bold ${chartGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {chartGrowth >= 0 ? '+' : ''}{chartGrowth.toFixed(1)}%
                            </Text>
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
                        data={chartData[value]}
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
