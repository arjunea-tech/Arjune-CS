import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Linking } from 'react-native';
import { THEME } from '../../Components/ui/theme';
import api from '../../Components/api/config';

export default function ManageAboutUs() {
    const router = useRouter();
    const [aboutUs, setAboutUs] = useState({
        title: '',
        description: '',
        mission: '',
        vision: '',
        image: ''
    });
    const [contact, setContact] = useState({
        email: '',
        phone: '',
        address: '',
        latitude: '',
        longitude: ''
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchAboutUs();
    }, []);

    const fetchAboutUs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/settings/about-us');
            const resSettings = await api.get('/settings');
            
            console.log('[ManageAboutUs] Contact data from API:', resSettings.data.data?.contact);
            
            if (res.data.success) {
                setAboutUs(res.data.data);
            }
            if (resSettings.data.success && resSettings.data.data.contact) {
                const contactData = resSettings.data.data.contact;
                setContact({
                    email: contactData?.email || '',
                    phone: contactData?.phone || '',
                    address: contactData?.address || '',
                    latitude: contactData?.latitude || '',
                    longitude: contactData?.longitude || ''
                });
            } else {
                // Initialize with empty values if no contact data
                setContact({
                    email: '',
                    phone: '',
                    address: '',
                    latitude: '',
                    longitude: ''
                });
            }
        } catch (error) {
            console.error('Error fetching About Us:', error);
            Alert.alert('Error', 'Failed to load About Us content');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!aboutUs.title.trim()) {
            Alert.alert('Error', 'Title is required');
            return;
        }

        try {
            setSaving(true);
            const updateData = {
                aboutUs,
                contact: {
                    email: contact.email || '',
                    phone: contact.phone || '',
                    address: contact.address || '',
                    latitude: contact.latitude ? parseFloat(contact.latitude) : null,
                    longitude: contact.longitude ? parseFloat(contact.longitude) : null
                }
            };
            const res = await api.put('/settings', updateData);
            if (res.data.success) {
                Alert.alert('Success', 'About Us and Contact Details updated successfully');
                // Refresh the data to confirm it was saved
                await fetchAboutUs();
            } else {
                Alert.alert('Error', res.data.message || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving About Us:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to save';
            Alert.alert('Error', errorMsg);
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
            <View className="flex-row items-center justify-between bg-white p-3 shadow-sm z-10 border-b border-gray-100">
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold" style={{ color: THEME.colors.primary }}>
                        Manage About Us
                    </Text>
                </View>
                <TouchableOpacity 
                    onPress={() => setShowPreview(!showPreview)}
                    className="rounded-lg bg-blue-50 px-3 py-2"
                >
                    <Ionicons 
                        name={showPreview ? "eye-off" : "eye"} 
                        size={20} 
                        color="#3B82F6" 
                    />
                </TouchableOpacity>
            </View>

            {showPreview ? (
                // Preview Mode
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
                    <View className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <Text className="mb-4 text-2xl font-bold text-gray-800">{aboutUs.title || 'CrackerShop'}</Text>

                        {aboutUs.description && (
                            <View className="mb-6">
                                <Text className="text-base text-gray-700 leading-6">{aboutUs.description}</Text>
                            </View>
                        )}

                        {/* Mission Section */}
                        {aboutUs.mission && (
                            <View className="mb-6 rounded-lg bg-blue-50 p-4 border border-blue-200">
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="checkmark-circle" size={18} color="#FF7F00" style={{ marginRight: 8 }} />
                                    <Text className="text-lg font-bold text-gray-800">Our Mission</Text>
                                </View>
                                <Text className="text-sm text-gray-700 leading-5">{aboutUs.mission}</Text>
                            </View>
                        )}

                        {/* Vision Section */}
                        {aboutUs.vision && (
                            <View className="rounded-lg bg-purple-50 p-4 border border-purple-200">
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="eye-outline" size={18} color="#FF7F00" style={{ marginRight: 8 }} />
                                    <Text className="text-lg font-bold text-gray-800">Our Vision</Text>
                                </View>
                                <Text className="text-sm text-gray-700 leading-5">{aboutUs.vision}</Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity 
                        onPress={() => setShowPreview(false)}
                        className="mt-6 rounded-lg bg-gray-200 py-3 items-center"
                    >
                        <Text className="text-base font-bold text-gray-800">Back to Editing</Text>
                    </TouchableOpacity>
                </ScrollView>
            ) : (
                // Edit Mode
                <>
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
                        {/* Info Box */}
                        <View className="mb-6 rounded-lg bg-blue-50 p-3 border border-blue-200">
                            <View className="flex-row">
                                <Ionicons name="information-circle" size={18} color="#3B82F6" style={{ marginRight: 8 }} />
                                <Text className="flex-1 text-xs text-blue-900">
                                    Update the content that will be displayed to customers on the About Us page.
                                </Text>
                            </View>
                        </View>

                        {/* Title */}
                        <View className="mb-6">
                            <Text className="mb-2 text-sm font-bold text-gray-700">Company Title/Name *</Text>
                            <View className="flex-row items-center rounded-xl border border-gray-200 bg-white px-4 py-3">
                                <Ionicons name="text-outline" size={20} color="#FF7F00" style={{ marginRight: 12 }} />
                                <TextInput
                                    style={{ flex: 1 }}
                                    placeholder="e.g., CrackerShop"
                                    value={aboutUs.title}
                                    onChangeText={(text) => setAboutUs({ ...aboutUs, title: text })}
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                            <Text className="mt-1 text-xs text-gray-500">This is the main title displayed to users</Text>
                        </View>

                        {/* Description */}
                        <View className="mb-6">
                            <Text className="mb-2 text-sm font-bold text-gray-700">Description</Text>
                            <View className="rounded-xl border border-gray-200 bg-white p-4">
                                <TextInput
                                    style={{ height: 120, textAlignVertical: 'top' }}
                                    placeholder="Tell customers about your business, products, and services..."
                                    value={aboutUs.description}
                                    onChangeText={(text) => setAboutUs({ ...aboutUs, description: text })}
                                    multiline
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                            <Text className="mt-1 text-xs text-gray-500">Provide a brief overview of your company</Text>
                        </View>

                        {/* Mission */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-2">
                                <Ionicons name="checkmark-circle" size={18} color="#FF7F00" style={{ marginRight: 6 }} />
                                <Text className="text-sm font-bold text-gray-700">Our Mission</Text>
                            </View>
                            <View className="rounded-xl border border-gray-200 bg-white p-4">
                                <TextInput
                                    style={{ height: 100, textAlignVertical: 'top' }}
                                    placeholder="What drives your company? What is your purpose?"
                                    value={aboutUs.mission}
                                    onChangeText={(text) => setAboutUs({ ...aboutUs, mission: text })}
                                    multiline
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                            <Text className="mt-1 text-xs text-gray-500">Optional - describe your company mission</Text>
                        </View>

                        {/* Vision */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-2">
                                <Ionicons name="eye-outline" size={18} color="#FF7F00" style={{ marginRight: 6 }} />
                                <Text className="text-sm font-bold text-gray-700">Our Vision</Text>
                            </View>
                            <View className="rounded-xl border border-gray-200 bg-white p-4">
                                <TextInput
                                    style={{ height: 100, textAlignVertical: 'top' }}
                                    placeholder="Where do you want your company to go in the future?"
                                    value={aboutUs.vision}
                                    onChangeText={(text) => setAboutUs({ ...aboutUs, vision: text })}
                                    multiline
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                            <Text className="mt-1 text-xs text-gray-500">Optional - describe your company vision</Text>
                        </View>

                        {/* Image URL */}
                        <View className="mb-6">
                            <Text className="mb-2 text-sm font-bold text-gray-700">Company Image URL</Text>
                            <View className="rounded-xl border border-gray-200 bg-white p-4">
                                <TextInput
                                    style={{ height: 50, textAlignVertical: 'top' }}
                                    placeholder="https://example.com/company-image.jpg"
                                    value={aboutUs.image}
                                    onChangeText={(text) => setAboutUs({ ...aboutUs, image: text })}
                                    multiline
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                            <Text className="mt-1 text-xs text-gray-500">Optional - provide a URL to your company image/logo</Text>
                        </View>

                        {/* Preview Button */}
                        <TouchableOpacity 
                            onPress={() => setShowPreview(true)}
                            className="mb-6 rounded-lg bg-blue-100 py-3 items-center border border-blue-200"
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="eye-outline" size={18} color="#3B82F6" style={{ marginRight: 6 }} />
                                <Text className="text-base font-bold text-blue-900">Preview Changes</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Contact Details Section */}
                        <View className="mb-6">
                            <View className="mb-4 flex-row items-center">
                                <View className="mr-3 rounded-full bg-orange-100 p-2">
                                    <Ionicons name="call-outline" size={18} color="#FF7F00" />
                                </View>
                                <Text className="text-lg font-bold text-gray-800">Contact Details</Text>
                            </View>

                            {/* Email */}
                            <View className="mb-4">
                                <Text className="mb-2 text-sm font-bold text-gray-700">Email</Text>
                                <View className="flex-row items-center rounded-xl border border-gray-200 bg-white px-4 py-3">
                                    <Ionicons name="mail-outline" size={20} color="#FF7F00" style={{ marginRight: 12 }} />
                                    <TextInput
                                        style={{ flex: 1 }}
                                        placeholder="support@crackershop.com"
                                        value={contact.email}
                                        onChangeText={(text) => setContact({ ...contact, email: text })}
                                        keyboardType="email-address"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            </View>

                            {/* Phone */}
                            <View className="mb-4">
                                <Text className="mb-2 text-sm font-bold text-gray-700">Phone Number</Text>
                                <View className="flex-row items-center rounded-xl border border-gray-200 bg-white px-4 py-3">
                                    <Ionicons name="call-outline" size={20} color="#FF7F00" style={{ marginRight: 12 }} />
                                    <TextInput
                                        style={{ flex: 1 }}
                                        placeholder="+91 9876543210"
                                        value={contact.phone}
                                        onChangeText={(text) => setContact({ ...contact, phone: text })}
                                        keyboardType="phone-pad"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            </View>

                            {/* Address */}
                            <View className="mb-4">
                                <Text className="mb-2 text-sm font-bold text-gray-700">Address</Text>
                                <View className="rounded-xl border border-gray-200 bg-white p-4">
                                    <TextInput
                                        style={{ height: 80, textAlignVertical: 'top' }}
                                        placeholder="No.12, Main Road, Sivakasi, Tamil Nadu"
                                        value={contact.address}
                                        onChangeText={(text) => setContact({ ...contact, address: text })}
                                        multiline
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                                <Text className="mt-1 text-xs text-gray-500">Display your business address to customers on About Us page</Text>
                            </View>

                            {/* Map Location Section */}
                            <View className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
                                <View className="flex-row items-center mb-3">
                                    <Ionicons name="location-outline" size={18} color="#FF7F00" style={{ marginRight: 8 }} />
                                    <Text className="text-sm font-bold text-gray-800">Map Location</Text>
                                </View>

                                {/* Latitude */}
                                <View className="mb-3">
                                    <Text className="mb-2 text-xs font-bold text-gray-700">Latitude</Text>
                                    <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-3 py-2">
                                        <TextInput
                                            style={{ flex: 1, fontSize: 12 }}
                                            placeholder="e.g., 9.9689"
                                            value={String(contact.latitude || '')}
                                            onChangeText={(text) => setContact({ ...contact, latitude: text })}
                                            keyboardType="decimal-pad"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                </View>

                                {/* Longitude */}
                                <View className="mb-3">
                                    <Text className="mb-2 text-xs font-bold text-gray-700">Longitude</Text>
                                    <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-3 py-2">
                                        <TextInput
                                            style={{ flex: 1, fontSize: 12 }}
                                            placeholder="e.g., 77.7880"
                                            value={String(contact.longitude || '')}
                                            onChangeText={(text) => setContact({ ...contact, longitude: text })}
                                            keyboardType="decimal-pad"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                </View>

                                <View className="mt-2 flex-row gap-2">
                                    <TouchableOpacity 
                                        onPress={() => {
                                            const lat = contact.latitude || 9.9689;
                                            const lng = contact.longitude || 77.7880;
                                            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                                            Linking.openURL(mapsUrl);
                                        }}
                                        className="flex-1 flex-row items-center justify-center rounded-lg bg-blue-600 py-2"
                                    >
                                        <Ionicons name="map-outline" size={16} color="white" style={{ marginRight: 6 }} />
                                        <Text className="text-sm font-bold text-white">View Map</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            const address = encodeURIComponent(contact.address || 'Sivakasi Tamil Nadu');
                                            const mapsUrl = `https://www.google.com/maps/search/${address}`;
                                            Linking.openURL(mapsUrl);
                                        }}
                                        className="flex-1 flex-row items-center justify-center rounded-lg bg-green-600 py-2"
                                    >
                                        <Ionicons name="navigate-outline" size={16} color="white" style={{ marginRight: 6 }} />
                                        <Text className="text-sm font-bold text-white">Find Address</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text className="mt-2 text-xs text-gray-600">
                                    Open Google Maps to find your location. Right-click on the map and copy the coordinates.
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Save Button */}
                    <View className="bg-white border-t border-gray-100 p-4 gap-2">
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
                        <TouchableOpacity
                            className="w-full py-3 rounded-xl items-center justify-center border border-gray-300 bg-white"
                            onPress={() => router.back()}
                            disabled={saving}
                        >
                            <Text className="text-base font-bold text-gray-700">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}        </View>
    );
}