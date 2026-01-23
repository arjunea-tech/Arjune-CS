import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { THEME } from '../../Components/ui/theme';
import { settingsAPI } from '../../Components/api';

export default function ManageShippingFees() {
    const router = useRouter();
    const [data, setData] = useState({
        shipping: {
            baseFee: 50,
            freeShippingAbove: 500,
            description: ''
        },
        fees: {
            packagingFee: 0,
            handlingFee: 0,
            description: ''
        },
        orderSettings: {
            minimumOrderAmount: 100,
            description: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await settingsAPI.getSettings();
            if (res.success) {
                setData({
                    shipping: res.data.shipping,
                    fees: res.data.fees,
                    orderSettings: res.data.orderSettings || { minimumOrderAmount: 100, description: '' }
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            Alert.alert('Error', 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            // Use the new updateSettings method to update all settings at once
            await settingsAPI.updateSettings(data);
            Alert.alert('Success', 'Shipping, fees and order settings updated successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color={THEME.colors.primary} />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center gap-2 bg-white p-3 shadow-sm z-10 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold" style={{ color: THEME.colors.primary }}>
                    Shipping & Fees
                </Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Shipping Section */}
                <View className="mb-8">
                    <View className="mb-4 flex-row items-center">
                        <View className="mr-3 rounded-full bg-blue-100 p-2">
                            <Ionicons name="rocket-outline" size={20} color="#3B82F6" />
                        </View>
                        <Text className="text-lg font-bold text-gray-800">Shipping Settings</Text>
                    </View>

                    {/* Base Fee */}
                    <View className="mb-4">
                        <Text className="mb-2 text-sm font-bold text-gray-700">Base Shipping Fee (₹)</Text>
                        <View className="flex-row items-center rounded-xl border border-gray-200 bg-white px-4 py-3">
                            <Ionicons name="pricetag-outline" size={20} color="#FF7F00" style={{ marginRight: 12 }} />
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="50"
                                value={data.shipping.baseFee.toString()}
                                onChangeText={(text) => setData({
                                    ...data,
                                    shipping: { ...data.shipping, baseFee: parseFloat(text) || 0 }
                                })}
                                keyboardType="decimal-pad"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        <Text className="mt-1 text-xs text-gray-500">Default charge for shipping orders</Text>
                    </View>

                    {/* Free Shipping Above */}
                    <View className="mb-4">
                        <Text className="mb-2 text-sm font-bold text-gray-700">Free Shipping Above (₹)</Text>
                        <View className="flex-row items-center rounded-xl border border-gray-200 bg-white px-4 py-3">
                            <Ionicons name="gift-outline" size={20} color="#FF7F00" style={{ marginRight: 12 }} />
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="500"
                                value={data.shipping.freeShippingAbove.toString()}
                                onChangeText={(text) => setData({
                                    ...data,
                                    shipping: { ...data.shipping, freeShippingAbove: parseFloat(text) || 0 }
                                })}
                                keyboardType="decimal-pad"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        <Text className="mt-1 text-xs text-gray-500">Orders above this amount get free shipping</Text>
                    </View>

                    {/* Shipping Description */}
                    <View className="mb-4">
                        <Text className="mb-2 text-sm font-bold text-gray-700">Shipping Description</Text>
                        <View className="rounded-xl border border-gray-200 bg-white p-4">
                            <TextInput
                                style={{ height: 80, textAlignVertical: 'top' }}
                                placeholder="e.g., Free shipping on orders above ₹500"
                                value={data.shipping.description}
                                onChangeText={(text) => setData({
                                    ...data,
                                    shipping: { ...data.shipping, description: text }
                                })}
                                multiline
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                </View>

                {/* Additional Fees Section */}
                <View className="mb-8">
                    <View className="mb-4 flex-row items-center">
                        <View className="mr-3 rounded-full bg-purple-100 p-2">
                            <Ionicons name="cash-outline" size={20} color="#A855F7" />
                        </View>
                        <Text className="text-lg font-bold text-gray-800">Additional Fees</Text>
                    </View>

                    {/* Packaging Fee */}
                    <View className="mb-4">
                        <Text className="mb-2 text-sm font-bold text-gray-700">Packaging Fee (₹)</Text>
                        <View className="flex-row items-center rounded-xl border border-gray-200 bg-white px-4 py-3">
                            <Ionicons name="cube-outline" size={20} color="#FF7F00" style={{ marginRight: 12 }} />
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="0"
                                value={data.fees.packagingFee.toString()}
                                onChangeText={(text) => setData({
                                    ...data,
                                    fees: { ...data.fees, packagingFee: parseFloat(text) || 0 }
                                })}
                                keyboardType="decimal-pad"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    {/* Handling Fee */}
                    <View className="mb-4">
                        <Text className="mb-2 text-sm font-bold text-gray-700">Handling Fee (₹)</Text>
                        <View className="flex-row items-center rounded-xl border border-gray-200 bg-white px-4 py-3">
                            <Ionicons name="hand-right-outline" size={20} color="#FF7F00" style={{ marginRight: 12 }} />
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="0"
                                value={data.fees.handlingFee.toString()}
                                onChangeText={(text) => setData({
                                    ...data,
                                    fees: { ...data.fees, handlingFee: parseFloat(text) || 0 }
                                })}
                                keyboardType="decimal-pad"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    {/* Fees Description */}
                    <View className="mb-4">
                        <Text className="mb-2 text-sm font-bold text-gray-700">Fees Description</Text>
                        <View className="rounded-xl border border-gray-200 bg-white p-4">
                            <TextInput
                                style={{ height: 80, textAlignVertical: 'top' }}
                                placeholder="Describe your additional fees to customers"
                                value={data.fees.description}
                                onChangeText={(text) => setData({
                                    ...data,
                                    fees: { ...data.fees, description: text }
                                })}
                                multiline
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                </View>

                {/* Minimum Order Amount Section */}
                <View className="mb-8">
                    <View className="mb-4 flex-row items-center">
                        <View className="mr-3 rounded-full bg-green-100 p-2">
                            <Ionicons name="cart-outline" size={20} color="#10B981" />
                        </View>
                        <Text className="text-lg font-bold text-gray-800">Minimum Order Settings</Text>
                    </View>

                    {/* Minimum Order Amount */}
                    <View className="mb-4">
                        <Text className="mb-2 text-sm font-bold text-gray-700">Minimum Order Amount (₹)</Text>
                        <View className="flex-row items-center rounded-xl border border-gray-200 bg-white px-4 py-3">
                            <Ionicons name="checkmark-circle-outline" size={20} color="#FF7F00" style={{ marginRight: 12 }} />
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder="100"
                                value={data.orderSettings.minimumOrderAmount.toString()}
                                onChangeText={(text) => setData({
                                    ...data,
                                    orderSettings: { ...data.orderSettings, minimumOrderAmount: parseFloat(text) || 100 }
                                })}
                                keyboardType="decimal-pad"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        <Text className="mt-1 text-xs text-gray-500">Users cannot checkout with orders below this amount</Text>
                    </View>

                    {/* Order Settings Description */}
                    <View className="mb-4">
                        <Text className="mb-2 text-sm font-bold text-gray-700">Description</Text>
                        <View className="rounded-xl border border-gray-200 bg-white p-4">
                            <TextInput
                                style={{ height: 80, textAlignVertical: 'top' }}
                                placeholder="e.g., Minimum order amount is ₹100 to proceed with checkout"
                                value={data.orderSettings.description}
                                onChangeText={(text) => setData({
                                    ...data,
                                    orderSettings: { ...data.orderSettings, description: text }
                                })}
                                multiline
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                </View>

                {/* Info Box */}
                <View className="mb-4 rounded-xl bg-blue-50 p-4 border border-blue-200">
                    <View className="flex-row">
                        <Ionicons name="information-circle" size={20} color="#3B82F6" style={{ marginRight: 12 }} />
                        <Text className="flex-1 text-sm text-blue-900">
                            These settings will be used to calculate shipping costs and display fee information to customers.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Save Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100">
                <TouchableOpacity
                    className="w-full py-4 rounded-xl items-center justify-center"
                    style={{ backgroundColor: THEME.colors.primary }}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <View className="flex-row items-center">
                            <Ionicons name="checkmark-done" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text className="text-lg font-bold text-white">Save Changes</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
