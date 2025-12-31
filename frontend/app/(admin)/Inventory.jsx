import { Image } from 'expo-image';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { THEME } from '../../Components/ui/theme';
import ProductsTestData from '../../testing/ProductsTestData.json';

export default function Inventory() {
    const router = useRouter();

    const [activeFilter, setActiveFilter] = useState('All Items');
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);

    const filters = ['All Items', 'Diwali Specials 🔥', 'Low Stock', 'Out of Stock'];

    // ✅ Load JSON correctly
    useEffect(() => {
        setProducts(ProductsTestData);
    }, []);

    // ✅ Filter + Search logic
    const filteredProducts = useMemo(() => {
        return products.filter(item => {
            // Search
            const matchesSearch =
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                (item.sku && item.sku.toLowerCase().includes(search.toLowerCase()));

            // Filters
            if (activeFilter === 'Diwali Specials 🔥') {
                return item.isDiwaliSpecial && matchesSearch;
            }

            if (activeFilter === 'Low Stock') {
                return item.isLowStock && matchesSearch;
            }

            if (activeFilter === 'Out of Stock') {
                return item.isOutOfStock && matchesSearch;
            }

            return matchesSearch;
        });
    }, [products, search, activeFilter]);

    const renderShowing = ({ item }) => {
        if (!item) return null;
        return (
            <View className="mb-4 flex-row items-center rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                {/* Image */}
                <View className="relative h-20 w-20">
                    <Image
                        source={{ uri: item.image }}
                        className={`h-full w-full rounded-xl ${item.isOutOfStock ? 'opacity-50' : ''}`}
                        contentFit="cover"
                        transition={200}
                    />

                    {item.sku && (
                        <View className="absolute bottom-1 left-1 rounded bg-black/70 px-1 py-0.5">
                            <Text className="text-[8px] font-bold text-white">SKU: {item.sku}</Text>
                        </View>
                    )}

                    {item.isOutOfStock && (
                        <View className="absolute inset-0 items-center justify-center rounded-xl bg-black/40">
                            <Text className="text-[10px] font-bold text-white">Out of Stock</Text>
                        </View>
                    )}
                </View>

                {/* Details */}
                <View className="ml-3 flex-1">
                    <View className="flex-row justify-between items-start">
                        <Text className="text-base font-bold text-gray-800" numberOfLines={1}>
                            {item.name}
                        </Text>
                        <MaterialIcons name="more-vert" size={20} color="#9CA3AF" />
                    </View>

                    <Text className="text-xs text-gray-500">{item.pack}</Text>

                    <View className="flex-row items-center justify-between mt-1">
                        <Text className="text-base font-bold text-orange-600">
                            ₹{item.price}
                        </Text>

                        {!item.isOutOfStock && (
                            <View className={`rounded px-2 py-0.5 ${item.statusColor}`}>
                                <Text className="text-[10px] font-bold">{item.status}</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            className="ml-2 bg-gray-100 p-1.5 rounded-full"
                            onPress={() => router.push({ pathname: '/(admin)/AddNewProduct', params: { editId: item.id } })}
                        >
                            <Ionicons name="pencil" size={14} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center gap-2 bg-white p-3">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold" style={{ color: THEME.colors.primary }}>
                    Inventory
                </Text>
            </View>

            {/* Search */}
            <View className="bg-white px-5 py-2">
                <View className="flex-row items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search products, SKU..."
                        className="ml-2 flex-1 text-gray-800"
                        value={search}
                        onChangeText={setSearch}
                    />
                    <MaterialIcons name="qr-code-scanner" size={20} color="#9CA3AF" />
                </View>
            </View>

            {/* Filters */}
            <View className="bg-white pb-3 pt-1">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                    {filters.map(filter => (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => setActiveFilter(filter)}
                            className={`mr-2 rounded-full border px-4 py-1.5 ${activeFilter === filter
                                ? 'bg-orange-50 border-orange-200'
                                : 'bg-white border-gray-200'
                                }`}
                        >
                            <Text
                                className={`text-sm font-medium ${activeFilter === filter ? 'text-orange-600' : 'text-gray-600'
                                    }`}
                            >
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* List */}
            <FlatList
                data={filteredProducts}
                keyExtractor={item => item.id.toString()}
                renderItem={renderShowing}
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            {/* FAB */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-lg"
                onPress={() => router.push('/(admin)/AddNewProduct')}
            >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
}
