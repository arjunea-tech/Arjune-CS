import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, Alert } from 'react-native';
import { THEME } from '../../Components/ui/theme';
import api from '../../Components/api/config';
import { useFocusEffect } from '@react-navigation/native';
import { printChitSchemesReport } from '../../Components/utils/ReportUtils';

export default function ChitManagement() {
    const router = useRouter();
    const [chits, setChits] = useState([]);

    const handlePrint = async () => {
        try {
            await printChitSchemesReport(chits);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSchemes = async () => {
        try {
            const res = await api.get('/chit/schemes');
            if (res.data.success) {
                setChits(res.data.data);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load schemes');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchSchemes();
        }, [])
    );

    const renderChitItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => router.push(`/(admin)/ChitDetails?id=${item._id}`)}
            className="mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
            <View className="flex-row justify-between items-start mb-3">
                <View>
                    <Text className="text-lg font-bold text-gray-800 mb-1">{item.name}</Text>
                    <Text className="text-xs text-gray-500 font-bold uppercase tracking-wider">#{item._id.substring(item._id.length - 6)}</Text>
                </View>
                <View className="bg-green-100 px-2 py-1 rounded">
                    <Text className="text-green-700 text-[10px] font-bold">Active</Text>
                </View>
            </View>

            <View className="flex-row justify-between items-center mb-4">
                <View>
                    <Text className="text-xs text-gray-400 mb-1">Total Amount</Text>
                    <Text className="text-base font-bold text-orange-600">₹{item.totalAmount}</Text>
                </View>
                <View>
                    <Text className="text-xs text-gray-400 mb-1">Monthly</Text>
                    <Text className="text-base font-bold text-gray-800">₹{item.installmentAmount}</Text>
                </View>
                <View>
                    <Text className="text-xs text-gray-400 mb-1">Duration</Text>
                    <Text className="text-base font-bold text-gray-800">{item.durationMonths} M</Text>
                </View>
            </View>

            <View className="flex-row items-center border-t border-gray-50 pt-3">
                <Ionicons name="people-outline" size={16} color="gray" />
                <Text className="ml-2 text-sm text-gray-500 font-medium">View Details</Text>
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
                <TouchableOpacity onPress={handlePrint} className="ml-auto p-2">
                    <Ionicons name="print-outline" size={24} color={THEME.colors.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={chits}
                keyExtractor={item => item._id}
                renderItem={renderChitItem}
                contentContainerStyle={{ padding: 20 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View className="items-center mt-10">
                        <Text className="text-gray-400">No schemes found. Create one?</Text>
                    </View>
                )}
            />

            {/* FAB */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-lg"
                onPress={() => router.push('/(admin)/AddChitScheme')}
            >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
}
