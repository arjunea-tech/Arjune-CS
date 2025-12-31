import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../Components/ui/theme';
import bannersData from '../../testing/BannerTestData.json';

export default function BannerManagement() {
    const router = useRouter();
    const [banners, setBanners] = useState(bannersData);

    // Edit Modal State
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '',
        subtitle: '',
        image: '',
        link: ''
    });

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Banner",
            "Are you sure you want to remove this banner from the home screen?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        setBanners(prev => prev.filter(b => b.id !== id));
                        alert('Banner Deleted Successfully!');
                    }
                }
            ]
        );
    };

    const handleEdit = (banner) => {
        setCurrentBanner(banner);
        setEditForm({
            title: banner.title,
            subtitle: banner.subtitle,
            image: banner.image,
            link: banner.link
        });
        setIsEditModalVisible(true);
    };

    const handleSaveEdit = () => {
        if (!editForm.title || !editForm.image) {
            alert('Title and Image URL are required!');
            return;
        }

        setBanners(prev => prev.map(b =>
            b.id === currentBanner.id ? { ...b, ...editForm } : b
        ));
        setIsEditModalVisible(false);
        alert('Banner Updated Successfully!');
    };

    const handleAddBanner = () => {
        router.push('/(admin)/AddBanner');
    };

    const renderBannerItem = ({ item }) => (
        <View className="mb-4 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <Image
                source={{ uri: item.image }}
                className="w-full h-32"
                resizeMode="cover"
            />
            <View className="p-4 flex-row justify-between items-center">
                <View className="flex-1 mr-4">
                    <Text className="text-base font-bold text-gray-800" numberOfLines={1}>{item.title}</Text>
                    <Text className="text-xs text-gray-500" numberOfLines={1}>{item.subtitle}</Text>
                    <Text className="text-[10px] text-orange-500 mt-1 font-medium">Link: {item.link}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                        className="p-2 bg-gray-50 rounded-full"
                        onPress={() => handleEdit(item)}
                    >
                        <Ionicons name="create-outline" size={20} color="gray" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="p-2 bg-red-50 rounded-full"
                        onPress={() => handleDelete(item.id)}
                    >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between bg-white p-3 shadow-sm z-10">
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold" style={{ color: THEME.colors.primary }}>
                        Banners
                    </Text>
                </View>
                <TouchableOpacity
                    className="bg-orange-100 px-3 py-1.5 rounded-full flex-row items-center gap-1"
                    onPress={handleAddBanner}
                >
                    <Ionicons name="add" size={18} color={THEME.colors.primary} />
                    <Text className="text-xs font-bold" style={{ color: THEME.colors.primary }}>Add New</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={banners}
                keyExtractor={item => item.id}
                renderItem={renderBannerItem}
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <View className="mb-4">
                        <Text className="text-gray-500 text-sm">
                            Manage the banners displayed in the home screen carousel.
                        </Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View className="mt-10 items-center justify-center">
                        <Ionicons name="images-outline" size={64} color="#D1D5DB" />
                        <Text className="text-gray-400 mt-2 font-medium">No banners found</Text>
                    </View>
                )}
            />

            {/* Edit Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isEditModalVisible}
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold">Edit Banner</Text>
                            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                                <Ionicons name="close" size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Title</Text>
                                <TextInput
                                    className="border border-gray-200 rounded-xl p-3 bg-gray-50"
                                    value={editForm.title}
                                    onChangeText={(text) => setEditForm(prev => ({ ...prev, title: text }))}
                                    placeholder="Enter banner title"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Subtitle</Text>
                                <TextInput
                                    className="border border-gray-200 rounded-xl p-3 bg-gray-50"
                                    value={editForm.subtitle}
                                    onChangeText={(text) => setEditForm(prev => ({ ...prev, subtitle: text }))}
                                    placeholder="Enter banner subtitle"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Image URL</Text>
                                <TextInput
                                    className="border border-gray-200 rounded-xl p-3 bg-gray-50 text-xs"
                                    value={editForm.image}
                                    onChangeText={(text) => setEditForm(prev => ({ ...prev, image: text }))}
                                    placeholder="Enter image URL"
                                />
                            </View>

                            <View className="mb-6">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Link</Text>
                                <TextInput
                                    className="border border-gray-200 rounded-xl p-3 bg-gray-50"
                                    value={editForm.link}
                                    onChangeText={(text) => setEditForm(prev => ({ ...prev, link: text }))}
                                    placeholder="Enter redirect link"
                                />
                            </View>

                            <TouchableOpacity
                                className="bg-orange-500 p-4 rounded-xl items-center mb-2"
                                onPress={handleSaveEdit}
                            >
                                <Text className="text-white font-bold text-base">Save Changes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="bg-gray-100 p-4 rounded-xl items-center mb-10"
                                onPress={() => setIsEditModalVisible(false)}
                            >
                                <Text className="text-gray-600 font-bold text-base">Cancel</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
