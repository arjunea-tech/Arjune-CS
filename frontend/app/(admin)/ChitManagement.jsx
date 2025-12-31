import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../Components/ui/theme';

export default function ChitManagement() {
    const router = useRouter();

    // Mock Data
    const chits = [
        {
            id: 'CHIT-001',
            name: 'Diwali Gold Plan 2024',
            totalAmount: '₹12,000',
            installment: '₹1,000',
            months: 12,
            members: 45,
            status: 'Active'
        },
        {
            id: 'CHIT-002',
            name: 'Silver Savings 2024',
            totalAmount: '₹6,000',
            installment: '₹500',
            months: 12,
            members: 128,
            status: 'Active'
        },
        {
            id: 'CHIT-003',
            name: 'Platinum Elite Box',
            totalAmount: '₹24,000',
            installment: '₹2,000',
            months: 12,
            members: 12,
            status: 'Active'
        }
    ];

    const renderChitItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => router.push('ChitDetails')}
            className="mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
            <View className="flex-row justify-between items-start mb-3">
                <View>
                    <Text className="text-lg font-bold text-gray-800 mb-1">{item.name}</Text>
                    <Text className="text-xs text-gray-500 font-bold uppercase tracking-wider">{item.id}</Text>
                </View>
                <View className="bg-green-100 px-2 py-1 rounded">
                    <Text className="text-green-700 text-[10px] font-bold">{item.status}</Text>
                </View>
            </View>

            <View className="flex-row justify-between items-center mb-4">
                <View>
                    <Text className="text-xs text-gray-400 mb-1">Total Amount</Text>
                    <Text className="text-base font-bold text-orange-600">{item.totalAmount}</Text>
                </View>
                <View>
                    <Text className="text-xs text-gray-400 mb-1">Monthly</Text>
                    <Text className="text-base font-bold text-gray-800">{item.installment}</Text>
                </View>
                <View>
                    <Text className="text-xs text-gray-400 mb-1">Duration</Text>
                    <Text className="text-base font-bold text-gray-800">{item.months} M</Text>
                </View>
            </View>

            <View className="flex-row items-center border-t border-gray-50 pt-3">
                <Ionicons name="people-outline" size={16} color="gray" />
                <Text className="ml-2 text-sm text-gray-500 font-medium">{item.members} Members Joined</Text>
                <Ionicons name="chevron-forward" size={16} color="gray" style={{ marginLeft: 'auto' }} />
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center gap-2 bg-white p-3 shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold" style={{ color: THEME.colors.primary }}>
                    Chit Schemes
                </Text>
            </View>

            <FlatList
                data={chits}
                keyExtractor={item => item.id}
                renderItem={renderChitItem}
                contentContainerStyle={{ padding: 20 }}
                showsVerticalScrollIndicator={false}
            />

            {/* FAB */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-lg"
                onPress={() => router.push('AddChitScheme')}
            >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
}
