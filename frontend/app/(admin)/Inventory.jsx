import { Image } from 'expo-image';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState, useMemo } from 'react';
import {
    FlatList,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
import { THEME } from '../../Components/ui/theme';
import { productsAPI } from '../../Components/api';
import { useFocusEffect } from '@react-navigation/native';
import { resolveImageUrl } from '../../Components/utils/imageUrl';

export default function Inventory() {
    const router = useRouter();

    const [activeFilter, setActiveFilter] = useState('All Items');
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const filters = ['All Items', 'Diwali Specials 🔥', 'Low Stock', 'Out of Stock'];

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await productsAPI.getProducts();
            if (res.success) {
                setProducts(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProducts();
        }, [])
    );

    // Filter + Search logic
    const filteredProducts = useMemo(() => {
        return products.filter(item => {
            // Search
            const matchesSearch =
                (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
                (item.sku && item.sku.toLowerCase().includes(search.toLowerCase()));

            // Filters
            if (activeFilter === 'Diwali Specials 🔥') {
                return item.isDiwaliSpecial && matchesSearch;
            }

            if (activeFilter === 'Low Stock') {
                // Assuming low stock threshold is 10 or check logic
                return (item.stock < 10 && item.stock > 0) && matchesSearch;
            }

            if (activeFilter === 'Out of Stock') {
                return item.stock === 0 && matchesSearch;
            }

            return matchesSearch;
        });
    }, [products, search, activeFilter]);

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Product",
            "Are you sure you want to delete this product?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const res = await productsAPI.deleteProduct(id);
                            if (res.success) {
                                setProducts(products.filter(p => p._id !== id));
                            }
                        } catch (error) {
                            console.error('Delete failed:', error);
                            Alert.alert("Error", "Failed to delete product");
                        }
                    }
                }
            ]
        );
    };

    const renderShowing = ({ item }) => {
        if (!item) return null;
        const isOutOfStock = (item.stock === 0 || item.quantity === 0);

        return (
            <View className="mb-4 flex-row items-center rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                {/* Image */}
                <View className="relative h-20 w-20">
                    <Image
                        source={{ uri: resolveImageUrl(item.image) }}
                        className={`h-full w-full rounded-xl ${isOutOfStock ? 'opacity-50' : ''}`}
                        contentFit="cover"
                        transition={200}
                    />

                    {item.sku && (
                        <View className="absolute bottom-1 left-1 rounded bg-black/70 px-1 py-0.5">
                            <Text className="text-[8px] font-bold text-white">SKU: {item.sku}</Text>
                        </View>
                    )}

                    {isOutOfStock && (
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

                        {!isOutOfStock && (
                            <View className="rounded px-2 py-0.5 bg-green-100">
                                <Text className="text-[10px] font-bold text-green-700">In Stock ({item.stock || item.quantity})</Text>
                            </View>
                        )}

                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                className="bg-gray-100 p-1.5 rounded-full"
                                onPress={() => router.push({ pathname: '/(admin)/AddNewProduct', params: { editId: item._id } })}
                            >
                                <Ionicons name="pencil" size={14} color="#6B7280" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="bg-red-50 p-1.5 rounded-full"
                                onPress={() => handleDelete(item._id)}
                            >
                                <Ionicons name="trash-outline" size={14} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
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
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={THEME.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    keyExtractor={item => item._id}
                    renderItem={renderShowing}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View className="items-center mt-10">
                            <Text className="text-gray-400">No products found</Text>
                        </View>
                    )}
                />
            )}

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
