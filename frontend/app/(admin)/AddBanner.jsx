import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../Components/ui/theme';

export default function AddBanner() {
    const router = useRouter();

    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [link, setLink] = useState('');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        if (!image || !title) {
            alert('Please select an image and enter a title');
            return;
        }
        alert('Banner Added Successfully!');
        router.back();
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center gap-2 p-3 bg-white">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold" style={{ color: THEME.colors.primary }}>
                    Add New Banner
                </Text>
            </View>

            <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
                {/* Image Picker */}
                <TouchableOpacity
                    onPress={pickImage}
                    className="mb-6 h-48 w-full items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50"
                >
                    {image ? (
                        <Image source={{ uri: image }} className="h-full w-full rounded-2xl" resizeMode="cover" />
                    ) : (
                        <View className="items-center justify-center">
                            <View className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                <Ionicons name="camera" size={24} color="#FF6B00" />
                            </View>
                            <Text className="font-bold text-gray-800">Select Banner Image</Text>
                            <Text className="text-xs text-gray-500">Recommended size: 1200x675 (16:9)</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Form Fields */}
                <View className="space-y-4 gap-4">
                    <View className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Banner Title</Text>
                        <TextInput
                            placeholder="e.g. Grand Diwali Sale"
                            value={title}
                            onChangeText={setTitle}
                            className="bg-gray-50 p-3 rounded-lg text-gray-800"
                        />
                    </View>

                    <View className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Subtitle / Offer Text</Text>
                        <TextInput
                            placeholder="e.g. Flat 50% OFF on all crackers"
                            value={subtitle}
                            onChangeText={setSubtitle}
                            className="bg-gray-50 p-3 rounded-lg text-gray-800"
                        />
                    </View>

                    <View className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Redirect Link (Optional)</Text>
                        <TextInput
                            placeholder="e.g. /category/crackers"
                            value={link}
                            onChangeText={setLink}
                            className="bg-gray-50 p-3 rounded-lg text-gray-800"
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    onPress={handleSave}
                    className="mt-8 mb-10 flex-row items-center justify-center rounded-xl bg-orange-500 py-4 shadow-md active:bg-orange-600"
                >
                    <Ionicons name="save-outline" size={20} color="white" className="mr-2" />
                    <Text className="font-bold text-white text-lg ml-2">Save Banner</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
