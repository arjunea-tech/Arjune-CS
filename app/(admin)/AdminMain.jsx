import { Ionicons } from '@expo/vector-icons'
import { ScrollView, Text, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import AnalyticsBox from '../../Components/AdminComponents/AnalyticsBox'
import { THEME } from '../../Components/ui/theme'

export default function AdminMain() {
    const analyticsBoxDetails = [
        { icon: <Ionicons name="cash" size={24} color="#FF6B00" />, label: 'Total Sales', amount: '$12,345', isIncrease: true, percentage: '8.5%' },
        { icon: <Ionicons name="people" size={24} color="#FF6B00" />, label: 'Total Users', amount: '1,234', isIncrease: false, percentage: '2.1%' },
        { icon: <Ionicons name="cart" size={24} color="#FF6B00" />, label: 'Total Orders', amount: '567', isIncrease: true, percentage: '5.4%' },
    ]

    const data = [
        { label: 'This Week', value: '1' },
        { label: 'This Month', value: '2' },
        { label: 'This Year', value: '3' },
    ];

    return (
        // Change main View to ScrollView for vertical scrolling
        <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
            <View className="items-center pb-10"> {/* Added padding bottom for breathing room */}

                {/* Header */}
                <View className="flex-row items-center justify-center mt-5">
                    <Text className="text-xl font-bold">Admin</Text>
                    <Text className="text-xl font-bold" style={{ color: THEME.colors.primary }}>Panel</Text>
                </View>

                {/* Good Morning Box */}
                <View className="w-11/12 h-40 bg-gray-100 rounded-2xl mt-5 p-5">
                    <Text className="text-lg">Good Morning, Admin!</Text>
                    <Text className="text-sm text-gray-600 mt-2">Here's what's happening today.</Text>
                </View>

                {/* Horizontal Analytics (This stays as is) */}
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

                {/* Sales Analytics section now sits naturally below */}
                <View className="w-11/12 mt-8">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-black text-lg font-semibold">Sales Analytics</Text>

                        {/* Dropdown Container */}
                        <View className="w-40">
                            <Dropdown
                                style={{
                                    height: 35,
                                    backgroundColor: THEME.colors.primary, // Or gray-100 if you want it subtle
                                    borderRadius: 20,
                                    paddingHorizontal: 12,
                                }}
                                placeholderStyle={{ fontSize: 12, color: '#fff' }}
                                selectedTextStyle={{ fontSize: 12, color: '#fff' }}
                                data={data}
                                labelField="label"
                                valueField="value"
                                placeholder="Period"
                                onChange={item => setValue(item.value)}
                                // This ensures the dropdown icon is also white
                                iconColor="white"
                            />
                        </View>
                    </View>
                    <View className="w-full h-64 bg-gray-100 rounded-2xl mt-4 items-center justify-center">
                        <Text className="text-gray-600">[Sales Chart Placeholder]</Text>    
                    </View>
                </View>

            </View>
        </ScrollView>
    )
}