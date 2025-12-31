import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../Components/ui/theme';

export default function Categories() {
    const router = useRouter();

    // Mock Data
    const categories = [
        { id: '1', name: 'Sparklers', items: 12, status: 'Active' },
        { id: '2', name: 'Rockets', items: 8, status: 'Active' },
        { id: '3', name: 'Flower Pots', items: 15, status: 'Active' },
        { id: '4', name: 'Chakkars', items: 10, status: 'Active' },
        { id: '5', name: 'Gift Boxes', items: 5, status: 'Active' },
        { id: '6', name: 'Garlands', items: 7, status: 'Inactive' },
    ];

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            className="mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row justify-between items-center"
            onPress={() => router.push({ pathname: '/(admin)/AddCategory', params: { editId: item.id } })}
        >
            <View className="flex-row items-center gap-4">
                <View className="h-12 w-12 bg-orange-100 rounded-xl items-center justify-center">
                    <Ionicons name="grid-outline" size={24} color={THEME.colors.primary} />
                </View>
                <View>
                    <Text className="text-base font-bold text-gray-800">{item.name}</Text>
                    <Text className="text-xs text-gray-500">{item.items} Products</Text>
                </View>
            </View>

            <View className="flex-row items-center gap-2">
                <View className={`px-2 py-1 rounded ${item.status === 'Active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Text className={`text-[10px] font-bold ${item.status === 'Active' ? 'text-green-700' : 'text-gray-500'}`}>{item.status}</Text>
                </View>
                <View className="p-2">
                    <Ionicons name="chevron-forward" size={20} color="gray" />
                </View>
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
                    Categories
                </Text>
            </View>

            <FlatList
                data={categories}
                keyExtractor={item => item.id}
                renderItem={renderCategoryItem}
                contentContainerStyle={{ padding: 20 }}
                showsVerticalScrollIndicator={false}
            />

            {/* FAB */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-lg"
                onPress={() => router.push('/(admin)/AddCategory')}
            >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
}
