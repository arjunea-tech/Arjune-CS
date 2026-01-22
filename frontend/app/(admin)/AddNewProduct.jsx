import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { Image, ScrollView, Switch, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { THEME } from '../../Components/ui/theme';
import { productsAPI, categoriesAPI } from '../../Components/api';
import { resolveImageUrl } from '../../Components/utils/imageUrl';

export default function AddNewProduct() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const isEditMode = !!params.editId;

    const [images, setImages] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState(null);
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');
    const [pack, setPack] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [isDiwaliSpecial, setIsDiwaliSpecial] = useState(false);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchCategories();
            if (isEditMode) {
                fetchProductDetails();
            }
        }, [isEditMode, params.editId])
    );

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

                // Handle legacy image and new images array
                if (p.images && p.images.length > 0) {
                    setImages(p.images);
                } else if (p.image) {
                    setImages([p.image]);
                }

                setStock(String(p.quantity || '0'));
                setPack(p.pack || '');
                setVideoUrl(p.videoUrl || '');
                setDescription(p.description || '');
                setIsFeatured(p.isFeatured || false);
                setIsDiwaliSpecial(p.isDiwaliSpecial || false);

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
        // Fallback for deprecation: Use MediaType if available, otherwise MediaTypeOptions
        const mediaTypes = ImagePicker.MediaType ? ImagePicker.MediaType.Images : ImagePicker.MediaTypeOptions.Images;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: mediaTypes,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const newImages = result.assets.map(asset => asset.uri);
            setImages([...images, ...newImages]);
        }
    };

    const removeImage = (index) => {
        const updated = [...images];
        updated.splice(index, 1);
        setImages(updated);
    };

    const handleSave = async () => {
        if (!name || !price || !category || !stock || !description) {
            Alert.alert("Validation Error", "Please fill all required fields.");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('price', price);
            if (discountPrice) {
                formData.append('discountPrice', discountPrice);
            }
            formData.append('quantity', stock);
            if (pack) formData.append('pack', pack);
            if (videoUrl) formData.append('videoUrl', videoUrl);
            formData.append('description', description.trim());
            formData.append('category', category); // category ID
            formData.append('isFeatured', String(isFeatured));
            formData.append('isDiwaliSpecial', String(isDiwaliSpecial));

            console.log('[handleSave] Preparing to send product data...');
            // Note: You can't directly log FormData contents easily in some environments,
            // but we can log the state variables.
            console.log('[handleSave] State:', { name, price, discountPrice, stock, category, isFeatured, isDiwaliSpecial });

            // Append images
            if (images.length === 0) {
                formData.append('clearImages', 'true');
            } else {
                images.forEach((img, index) => {
                    if (!img.startsWith('http')) {
                        const filename = img.split('/').pop().split('?')[0]; // Remove query params if any
                        const match = /\.(\w+)$/.exec(filename);
                        const type = match ? `image/${match[1]}` : `image/jpeg`;
                        formData.append('images', { uri: img, name: filename, type });
                    } else {
                        formData.append('existingImages', img);
                    }
                });
            }

            let res;
            if (isEditMode) {
                console.log('[handleSave] Updating existing product:', params.editId);
                res = await productsAPI.updateProduct(params.editId, formData);
            } else {
                console.log('[handleSave] Creating new product');
                res = await productsAPI.createProduct(formData);
            }

            console.log('[handleSave] Response:', res);

            if (res.success) {
                Alert.alert("Success", isEditMode ? 'Product Updated Successfully!' : 'Product Added Successfully!');
                router.back();
            }

        } catch (error) {
            console.error('[handleSave] Error:', error);
            let msg = "Failed to save product";

            if (error.response) {
                console.error('[handleSave] Error Data:', JSON.stringify(error.response.data, null, 2));
                msg = error.response.data.error || JSON.stringify(error.response.data);
            } else {
                msg = error.message;
            }

            Alert.alert("Save Failed", msg.substring(0, 500)); // Show up to 500 chars in alert
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
                {/* Multi-Image Upload Section */}
                <View className="mb-6">
                    <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Product Images</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                        {images.map((img, index) => (
                            <View key={index} className="mr-3 relative h-40 w-40 rounded-2xl overflow-hidden border border-gray-100">
                                <Image source={{ uri: resolveImageUrl(img) }} className="h-full w-full" resizeMode="cover" />
                                <TouchableOpacity
                                    onPress={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-500/80 p-1.5 rounded-full"
                                >
                                    <Ionicons name="trash" size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {images.length < 5 && (
                            <TouchableOpacity
                                onPress={pickImage}
                                className="h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50"
                            >
                                <View className="items-center justify-center">
                                    <View className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                                        <Ionicons name="add" size={24} color="#FF6B00" />
                                    </View>
                                    <Text className="text-[10px] font-bold text-gray-800">Add Image</Text>
                                    <Text className="text-[8px] text-gray-500">{images.length}/5</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </View>

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

                    {/* Stock Qty & Pack */}
                    <View className="flex-row space-x-4 gap-4">
                        <View className="flex-1 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                            <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Stock Qty</Text>
                            <TextInput
                                placeholder="0"
                                value={stock}
                                onChangeText={setStock}
                                keyboardType="numeric"
                                className="bg-gray-50 p-3 rounded-lg text-gray-800"
                            />
                        </View>

                        <View className="flex-1 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                            <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Pack</Text>
                            <TextInput
                                placeholder="e.g. 5 Pcs/Box"
                                value={pack}
                                onChangeText={setPack}
                                className="bg-gray-50 p-3 rounded-lg text-gray-800"
                            />
                        </View>
                    </View>

                    {/* Video URL */}
                    <View className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Youtube Video URL</Text>
                        <TextInput
                            placeholder="https://youtube.com/..."
                            value={videoUrl}
                            onChangeText={setVideoUrl}
                            className="bg-gray-50 p-3 rounded-lg text-gray-800"
                            autoCapitalize="none"
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
