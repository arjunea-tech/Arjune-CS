import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../Components/ui/theme';

export default function AddChitScheme() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [months, setMonths] = useState('');
    const [installment, setInstallment] = useState('');
    const [bonus, setBonus] = useState('');
    const [description, setDescription] = useState('');

    return (
        <View className="flex-1 bg-white">
            <View className="flex-row items-center gap-2 bg-white p-3 shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold" style={{ color: THEME.colors.primary }}>
                    New Chit Scheme
                </Text>
            </View>

            <ScrollView className="flex-1 bg-gray-50 p-5" showsVerticalScrollIndicator={false}>
                {/* Basic Info */}
                <View className="bg-white rounded-xl p-5 mb-5 shadow-sm border border-gray-100 space-y-4 gap-4">
                    <Text className="font-bold text-gray-800 text-lg mb-2">Scheme Details</Text>

                    <View>
                        <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Scheme Name</Text>
                        <TextInput
                            placeholder="e.g. Diwali Gold Plan 2025"
                            value={name}
                            onChangeText={setName}
                            className="bg-gray-50 p-3 rounded-lg text-gray-800 border border-gray-200"
                        />
                    </View>

                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Total Amount (₹)</Text>
                            <TextInput
                                placeholder="12000"
                                value={totalAmount}
                                onChangeText={setTotalAmount}
                                keyboardType="numeric"
                                className="bg-gray-50 p-3 rounded-lg text-gray-800 border border-gray-200"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Duration (Months)</Text>
                            <TextInput
                                placeholder="12"
                                value={months}
                                onChangeText={setMonths}
                                keyboardType="numeric"
                                className="bg-gray-50 p-3 rounded-lg text-gray-800 border border-gray-200"
                            />
                        </View>
                    </View>

                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Monthly Pay (₹)</Text>
                            <TextInput
                                placeholder="1000"
                                value={installment}
                                onChangeText={setInstallment}
                                keyboardType="numeric"
                                className="bg-gray-50 p-3 rounded-lg text-gray-800 border border-gray-200"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Bonus Amount (₹)</Text>
                            <TextInput
                                placeholder="0"
                                value={bonus}
                                onChangeText={setBonus}
                                keyboardType="numeric"
                                className="bg-gray-50 p-3 rounded-lg text-gray-800 border border-gray-200"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="mb-2 text-xs font-bold uppercase text-gray-500">Description / Benefits</Text>
                        <TextInput
                            placeholder="Describe the scheme benefits..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            className="h-24 bg-gray-50 p-3 rounded-lg text-gray-800 border border-gray-200"
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    onPress={() => {
                        if (!name || !totalAmount || !months || !installment) {
                            alert('Please fill in all required fields');
                            return;
                        }
                        alert('Chit Scheme Created Successfully!');
                        router.back();
                    }}
                    className="mb-10 flex-row items-center justify-center rounded-xl bg-orange-500 py-4 shadow-md active:bg-orange-600"
                >
                    <Ionicons name="checkmark-circle-outline" size={24} color="white" className="mr-2" />
                    <Text className="font-bold text-white text-lg">Create Scheme</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}
