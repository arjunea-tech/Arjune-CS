import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { THEME } from '../../Components/ui/theme';
import api from '../../Components/api/config';

export default function ChangePassword() {
    const router = useRouter();
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        // Validation
        if (!formData.currentPassword.trim()) {
            Alert.alert('Error', 'Please enter your current password');
            return;
        }

        if (!formData.newPassword.trim()) {
            Alert.alert('Error', 'Please enter a new password');
            return;
        }

        if (!formData.confirmPassword.trim()) {
            Alert.alert('Error', 'Please confirm your new password');
            return;
        }

        if (formData.newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            Alert.alert('Error', 'New password must be different from current password');
            return;
        }

        try {
            setLoading(true);
            const res = await api.put('/auth/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });

            if (res.data.success) {
                Alert.alert('Success', 'Password changed successfully', [
                    {
                        text: 'OK',
                        onPress: () => {
                            setFormData({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                            });
                            router.back();
                        }
                    }
                ]);
            } else {
                Alert.alert('Error', res.data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            const errorMsg = error.response?.data?.error || error.message || 'Failed to change password';
            Alert.alert('Error', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const PasswordInput = ({ label, field, icon }) => (
        <View className="mb-6">
            <Text className="mb-2 text-sm font-bold text-gray-700">{label}</Text>
            <View className="flex-row items-center rounded-xl border border-gray-200 bg-white px-4 py-3">
                <Ionicons name={icon} size={20} color="#FF7F00" style={{ marginRight: 12 }} />
                <TextInput
                    style={{ flex: 1 }}
                    placeholder={label}
                    value={formData[field]}
                    onChangeText={(text) => setFormData({ ...formData, [field]: text })}
                    secureTextEntry={!showPasswords[field]}
                    placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                    onPress={() => setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] })}
                >
                    <Ionicons
                        name={showPasswords[field] ? 'eye' : 'eye-off'}
                        size={20}
                        color="#6B7280"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center gap-2 bg-white p-3 shadow-sm z-10 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold" style={{ color: THEME.colors.primary }}>
                    Change Password
                </Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
                {/* Info Box */}
                <View className="mb-8 rounded-xl bg-blue-50 p-4 border border-blue-200">
                    <View className="flex-row">
                        <Ionicons name="information-circle" size={20} color="#3B82F6" style={{ marginRight: 12 }} />
                        <Text className="flex-1 text-sm text-blue-900">
                            Please enter your current password and choose a strong new password for your security.
                        </Text>
                    </View>
                </View>

                {/* Current Password */}
                <PasswordInput
                    label="Current Password"
                    field="currentPassword"
                    icon="lock-closed-outline"
                />

                {/* Divider */}
                <View className="my-6 border-t border-gray-200" />

                {/* New Password */}
                <PasswordInput
                    label="New Password"
                    field="newPassword"
                    icon="lock-open-outline"
                />

                {/* Password Requirements */}
                <View className="mb-6 rounded-lg bg-amber-50 p-4 border border-amber-200">
                    <Text className="mb-2 font-semibold text-amber-900">Password Requirements:</Text>
                    <Text className="text-sm text-amber-800">• Minimum 6 characters</Text>
                    <Text className="text-sm text-amber-800">• Different from current password</Text>
                </View>

                {/* Confirm Password */}
                <PasswordInput
                    label="Confirm New Password"
                    field="confirmPassword"
                    icon="checkmark-circle-outline"
                />

                {/* Security Tips */}
                <View className="rounded-lg bg-green-50 p-4 border border-green-200">
                    <View className="flex-row mb-2">
                        <Ionicons name="shield-checkmark" size={18} color="#10B981" style={{ marginRight: 8 }} />
                        <Text className="font-semibold text-green-900">Security Tips:</Text>
                    </View>
                    <Text className="text-sm text-green-800">• Use a mix of uppercase and lowercase letters</Text>
                    <Text className="text-sm text-green-800">• Include numbers and special characters</Text>
                    <Text className="text-sm text-green-800">• Avoid using personal information</Text>
                </View>

                {/* Action Buttons - Moved inside ScrollView */}
                <View className="mt-8 gap-3">
                    <TouchableOpacity
                        className="w-full py-4 rounded-xl items-center justify-center bg-gray-200"
                        onPress={() => router.back()}
                        disabled={loading}
                    >
                        <Text className="text-lg font-bold text-gray-800">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-full py-4 rounded-xl items-center justify-center"
                        style={{ backgroundColor: THEME.colors.primary }}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <View className="flex-row items-center">
                                <Ionicons name="checkmark-done" size={20} color="white" style={{ marginRight: 8 }} />
                                <Text className="text-lg font-bold text-white">Change Password</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
