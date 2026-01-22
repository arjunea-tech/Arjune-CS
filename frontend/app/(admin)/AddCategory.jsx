import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Switch, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Image } from 'react-native';
import { THEME } from '../../Components/ui/theme';
import { categoriesAPI } from '../../Components/api';
import * as ImagePicker from 'expo-image-picker';

export default function AddCategory() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const isEditMode = !!params.editId;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch category details if in edit mode
    useEffect(() => {
        if (isEditMode) {
            fetchCategoryDetails();
        }
    }, [isEditMode, params.editId]);

    const fetchCategoryDetails = async () => {
        try {
            setLoading(true);
            const res = await categoriesAPI.getCategory(params.editId);
            if (res.success) {
                const cat = res.data;
                setName(cat.name);
                setDescription(cat.description || '');
                setIsActive(cat.status === 'Active');
                setImage(cat.image);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to fetch category details");
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!name) {
            Alert.alert('Validation Error', 'Category Name is required');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('status', isActive ? 'Active' : 'Inactive');

            if (image && !image.startsWith('http')) {
                const filename = image.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;
                formData.append('image', { uri: image, name: filename, type });
            } else if (!image) {
                // If it's edit mode and image is null, we want to clear it
                formData.append('clearImage', 'true');
            }

            let res;
            if (isEditMode) {
                res = await categoriesAPI.updateCategory(params.editId, formData);
            } else {
                res = await categoriesAPI.createCategory(formData);
            }

            if (res.success) {
                Alert.alert("Success", isEditMode ? 'Category Updated Successfully!' : 'Category Added Successfully!');
                router.back();
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to save category. Ensure name is unique.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Category",
            "Are you sure you want to delete this category? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await categoriesAPI.deleteCategory(params.editId);
                            Alert.alert('Success', 'Category Deleted Successfully!');
                            router.back();
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

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color={THEME.colors.primary} />
            </View>
        )
    }

    return (
        <View className="flex-1 bg-white">
            <View className="flex-row items-center gap-2 bg-white p-3 shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold" style={{ color: THEME.colors.primary }}>
                    {isEditMode ? 'Edit Category' : 'Add Category'}
                </Text>
            </View>

            <ScrollView className="flex-1 bg-gray-50 p-5" showsVerticalScrollIndicator={false}>
                <View className="bg-white rounded-xl p-5 mb-5 shadow-sm border border-100 space-y-4 gap-4">

                    {/* Image Placeholder */}
                    <View className="h-40 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden relative">
                        {image ? (
                            <>
                                <Image
                                    source={{ uri: image }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    onPress={() => setImage(null)}
                                    className="absolute top-2 right-2 bg-red-500 rounded-full p-1 z-10"
                                >
                                    <Ionicons name="trash" size={16} color="white" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                onPress={pickImage}
                                className="w-full h-full items-center justify-center"
                            >
                                <Ionicons name="image-outline" size={40} color="gray" />
                                <Text className="text-gray-400 mt-2 font-bold">Upload Category Icon</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View>
                        <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Category Name</Text>
                        <TextInput
                            placeholder="e.g. Sparklers"
                            value={name}
                            onChangeText={setName}
                            className="bg-gray-50 p-3 rounded-lg text-gray-800 border border-gray-200"
                        />
                    </View>

                    <View>
                        <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Description</Text>
                        <TextInput
                            placeholder="Brief description of the category..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                            className="h-20 bg-gray-50 p-3 rounded-lg text-gray-800 border border-gray-200"
                            textAlignVertical="top"
                        />
                    </View>

                    <View className="flex-row justify-between items-center py-2">
                        <Text className="text-base font-bold text-gray-700">Active Status</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#FF6B00' }}
                            thumbColor={isActive ? '#ffffff' : '#f4f3f4'}
                            onValueChange={setIsActive}
                            value={isActive}
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    onPress={handleSave}
                    className="flex-row items-center justify-center rounded-xl bg-orange-500 py-4 shadow-md active:bg-orange-600"
                >
                    <Ionicons name="checkmark-circle-outline" size={24} color="white" className="mr-2" />
                    <Text className="font-bold text-white text-lg">{isEditMode ? 'Update Category' : 'Save Category'}</Text>
                </TouchableOpacity>

                {isEditMode && (
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="mt-4 mb-10 flex-row items-center justify-center rounded-xl bg-red-50 py-4 border border-red-100 shadow-sm active:bg-red-100"
                    >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" className="mr-2" />
                        <Text className="font-bold text-red-600 text-lg">Delete Category</Text>
                    </TouchableOpacity>
                )}

            </ScrollView>
        </View>
    );
}
