import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
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
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchAboutUs();
    }, []);

    const fetchAboutUs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/settings/about-us');
            if (res.data.success) {
                setAboutUs(res.data.data);
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
            const res = await api.put('/settings/about-us', aboutUs);
            if (res.data.success) {
                Alert.alert('Success', 'About Us updated successfully');
            }
        } catch (error) {
            console.error('Error saving About Us:', error);
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
                    Manage About Us
                </Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Title */}
                <View className="mb-6">
                    <Text className="mb-2 text-sm font-bold text-gray-700">Title</Text>
                    <View className="flex-row items-center rounded-xl border border-gray-200 bg-white px-4 py-3">
                        <Ionicons name="text-outline" size={20} color="#FF7F00" style={{ marginRight: 12 }} />
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder="e.g., About CrackerShop"
                            value={aboutUs.title}
                            onChangeText={(text) => setAboutUs({ ...aboutUs, title: text })}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Description */}
                <View className="mb-6">
                    <Text className="mb-2 text-sm font-bold text-gray-700">Description</Text>
                    <View className="rounded-xl border border-gray-200 bg-white p-4">
                        <TextInput
                            style={{ height: 120, textAlignVertical: 'top' }}
                            placeholder="Tell customers about your business..."
                            value={aboutUs.description}
                            onChangeText={(text) => setAboutUs({ ...aboutUs, description: text })}
                            multiline
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Mission */}
                <View className="mb-6">
                    <Text className="mb-2 text-sm font-bold text-gray-700">Our Mission</Text>
                    <View className="rounded-xl border border-gray-200 bg-white p-4">
                        <TextInput
                            style={{ height: 100, textAlignVertical: 'top' }}
                            placeholder="What is your mission?"
                            value={aboutUs.mission}
                            onChangeText={(text) => setAboutUs({ ...aboutUs, mission: text })}
                            multiline
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Vision */}
                <View className="mb-6">
                    <Text className="mb-2 text-sm font-bold text-gray-700">Our Vision</Text>
                    <View className="rounded-xl border border-gray-200 bg-white p-4">
                        <TextInput
                            style={{ height: 100, textAlignVertical: 'top' }}
                            placeholder="What is your vision?"
                            value={aboutUs.vision}
                            onChangeText={(text) => setAboutUs({ ...aboutUs, vision: text })}
                            multiline
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Image URL */}
                <View className="mb-6">
                    <Text className="mb-2 text-sm font-bold text-gray-700">Image URL</Text>
                    <View className="flex-row items-center rounded-xl border border-gray-200 bg-white px-4 py-3">
                        <Ionicons name="image-outline" size={20} color="#FF7F00" style={{ marginRight: 12 }} />
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder="https://example.com/image.jpg"
                            value={aboutUs.image}
                            onChangeText={(text) => setAboutUs({ ...aboutUs, image: text })}
                            placeholderTextColor="#9CA3AF"
                        />
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
