import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, ActivityIndicator, Image, Alert } from 'react-native';
import { THEME } from '../../Components/ui/theme';
import { categoriesAPI } from '../../Components/api';
import { useFocusEffect } from '@react-navigation/native';

export default function Categories() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await categoriesAPI.getCategories();
            if (res.success) {
                setCategories(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCategories();
        }, [])
    );

    const handleDelete = (id) => {
        // Prevent event propagation if triggered from row press (though it's separate touchable)
        Alert.alert(
            "Delete Category",
            "Are you sure you want to delete this category?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await categoriesAPI.deleteCategory(id);
                            // Optimistic update or refetch
                            fetchCategories();
                            Alert.alert("Success", "Category deleted successfully");
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete category");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const renderCategoryItem = ({ item }) => (
        <View className="mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row justify-between items-center">
            <TouchableOpacity
                className="flex-1 flex-row items-center gap-4"
                onPress={() => router.push({ pathname: '/(admin)/AddCategory', params: { editId: item._id } })}
            >
                <View className="h-12 w-12 bg-orange-100 rounded-xl items-center justify-center overflow-hidden">
                    {item.image ? (
                        <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                        <Ionicons name="grid-outline" size={24} color={THEME.colors.primary} />
                    )}
                </View>
                <View>
                    <Text className="text-base font-bold text-gray-800">{item.name}</Text>
                    <View className={`mt-1 self-start px-2 py-0.5 rounded ${!item.isActive && item.status !== 'Active' ? 'bg-gray-100' : 'bg-green-100'}`}>
                        <Text className={`text-[10px] font-bold ${!item.isActive && item.status !== 'Active' ? 'text-gray-500' : 'text-green-700'}`}>
                            {item.status || (item.isActive ? 'Active' : 'Inactive')}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <View className="flex-row items-center gap-2">
                <TouchableOpacity onPress={() => router.push({ pathname: '/(admin)/AddCategory', params: { editId: item._id } })}>
                    <Ionicons name="create-outline" size={20} color="gray" className="mr-2" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
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

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={THEME.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={categories}
                    keyExtractor={item => item._id}
                    renderItem={renderCategoryItem}
                    contentContainerStyle={{ padding: 20 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View className="items-center mt-10">
                            <Text className="text-gray-400">No categories found</Text>
                        </View>
                    )}
                />
            )}

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
