import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Switch, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { THEME } from '../../Components/ui/theme';
import { productsAPI, categoriesAPI } from '../../Components/api';

export default function AddNewProduct() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const isEditMode = !!params.editId;

    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState(null);
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [isDiwaliSpecial, setIsDiwaliSpecial] = useState(false);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchProductDetails();
        }
    }, [isEditMode, params.editId]);

    const fetchCategories = async () => {
        try {
            const res = await categoriesAPI.getCategories();
            if (res.success) {
                const formatted = res.data.map(cat => ({
                    label: cat.name,
                    value: cat._id // Use _id as value
                }));
                setCategories(formatted);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const res = await productsAPI.getProduct(params.editId);
            if (res.success) {
                const p = res.data;
                setName(p.name);
                setPrice(String(p.price));
                setDiscountPrice(p.discountPrice ? String(p.discountPrice) : '');
                setImage(p.image);
                setStock(String(p.quantity || '0'));
                setDescription(p.description || '');
                setIsFeatured(p.isFeatured || false);
                setIsDiwaliSpecial(p.isDiwaliSpecial || false);

                // Assuming p.category is populated object or just ID
                // Handle both cases if possible, usually better to request non-populated or handle check
                const catId = typeof p.category === 'object' ? p.category._id : p.category;
                setCategory(catId);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to load product details");
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!name || !price || !category || !stock || !description) {
            Alert.alert("Validation Error", "Please fill all required fields.");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('discountPrice', discountPrice);
            formData.append('quantity', stock);
            formData.append('description', description);
            formData.append('category', category); // category ID
            formData.append('isFeatured', isFeatured);
            formData.append('isDiwaliSpecial', isDiwaliSpecial);

            if (image && !image.startsWith('http')) {
                const filename = image.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;
                formData.append('image', { uri: image, name: filename, type });
            }

            let res;
            if (isEditMode) {
                res = await productsAPI.updateProduct(params.editId, formData);
            } else {
                res = await productsAPI.createProduct(formData);
            }

            if (res.success) {
                Alert.alert("Success", isEditMode ? 'Product Updated Successfully!' : 'Product Added Successfully!');
                router.back();
            }

        } catch (error) {
            const msg = error.response?.data?.error || error.message || "Failed to save product";
            Alert.alert("Error", msg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color={THEME.colors.primary} />
            </View>
        );
    }

    return (
        <View className="flex-1">
            <View className="flex-row items-center justify-start space-x-2 p-3 gap-2 bg-white text-center">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold" style={{ color: THEME.colors.primary }}>
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </Text>
            </View>
            <ScrollView className="flex-1 bg-white p-5" showsVerticalScrollIndicator={false}>
                {/* Image Upload Section */}
                <TouchableOpacity
                    onPress={pickImage}
                    className="mb-6 h-48 w-full items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 overflow-hidden"
                >
                    {image ? (
                        <Image source={{ uri: image }} className="h-full w-full" resizeMode="cover" />
                    ) : (
                        <View className="items-center justify-center">
                            <View className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                <Ionicons name="camera" size={24} color="#FF6B00" />
                            </View>
                            <Text className="font-bold text-gray-800">Upload Product Image</Text>
                            <Text className="text-xs text-gray-500">Tap here to select from gallery</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Form Fields */}
                <View className="space-y-4 gap-4">
                    {/* Product Name */}
                    <View className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Product Name</Text>
                        <TextInput
                            placeholder="e.g. Kaju Katli Gift Box"
                            value={name}
                            onChangeText={setName}
                            className="bg-gray-50 p-3 rounded-lg text-gray-800"
                        />
                    </View>


                    {/* Category Dropdown */}
                    <View className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Category</Text>
                        <Dropdown
                            style={{
                                height: 50,
                                backgroundColor: '#F9FAFB',
                                borderRadius: 8,
                                paddingHorizontal: 12,
                            }}
                            placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                            selectedTextStyle={{ fontSize: 14, color: '#1F2937' }}
                            data={categories}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Category"
                            value={category}
                            onChange={item => {
                                setCategory(item.value);
                            }}
                            renderRightIcon={() => (
                                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                            )}
                        />
                    </View>

                    {/* Price & Discount Price Row */}
                    <View className="flex-row space-x-4 gap-4">
                        <View className="flex-1 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                            <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Price (₹)</Text>
                            <TextInput
                                placeholder="₹ 0.00"
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                                className="bg-gray-50 p-3 rounded-lg text-gray-800"
                            />
                        </View>

                        <View className="flex-1 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                            <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Discount Price (₹)</Text>
                            <TextInput
                                placeholder="₹ 0.00"
                                value={discountPrice}
                                onChangeText={setDiscountPrice}
                                keyboardType="numeric"
                                className="bg-gray-50 p-3 rounded-lg text-gray-800"
                            />
                        </View>
                    </View>

                    {/* Stock Qty */}
                    <View className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Stock Qty</Text>
                        <TextInput
                            placeholder="0"
                            value={stock}
                            onChangeText={setStock}
                            keyboardType="numeric"
                            className="bg-gray-50 p-3 rounded-lg text-gray-800"
                        />
                    </View>

                    {/* Description */}
                    <View className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Description</Text>
                        <TextInput
                            placeholder="Describe the product details, ingredients, or material..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            className="h-24 bg-gray-50 p-3 rounded-lg text-gray-800"
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Featured Product Toggle */}
                    <View className="flex-row items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <View>
                            <Text className="font-bold text-gray-800">Featured Product</Text>
                            <Text className="text-xs text-gray-500">Show on home screen</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#E5E7EB', true: '#FF6B00' }}
                            thumbColor={'#FFFFFF'}
                            ios_backgroundColor="#E5E7EB"
                            onValueChange={() => setIsFeatured(!isFeatured)}
                            value={isFeatured}
                        />
                    </View>

                    {/* Diwali Special Toggle */}
                    <View className="flex-row items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <View className="flex-row items-center">
                            <Text className="font-bold text-gray-800">Diwali Special</Text>
                            <Text className="ml-2 text-orange-500">🔥</Text>
                        </View>
                        <View>
                            <Text className="text-xs text-gray-500">Add festival badge</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#E5E7EB', true: '#FF6B00' }}
                            thumbColor={'#FFFFFF'}
                            ios_backgroundColor="#E5E7EB"
                            onValueChange={() => setIsDiwaliSpecial(!isDiwaliSpecial)}
                            value={isDiwaliSpecial}
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    onPress={handleSave}
                    className="mt-8 mb-10 flex-row items-center justify-center rounded-xl bg-orange-500 py-4 shadow-md active:bg-orange-600"
                >
                    <Ionicons name="save-outline" size={20} color="white" className="mr-2" />
                    <Text className="font-bold text-white">{isEditMode ? 'Update Product' : 'Save Product'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
