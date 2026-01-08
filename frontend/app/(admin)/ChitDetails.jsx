import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import api from '../../Components/api/config';
import { useFocusEffect } from '@react-navigation/native';

export default function ChitDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [scheme, setScheme] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [nextDueDate, setNextDueDate] = useState('');
    const [updatingDate, setUpdatingDate] = useState(false);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const schemeRes = await api.get(`/chit/schemes/${id}`);
            if (schemeRes.data.success) {
                setScheme(schemeRes.data.data);
                setNextDueDate(schemeRes.data.data.nextDueDate || '');
            }

            // Fetch participants
            const participantsRes = await api.get(`/chit/schemes/${id}/participants`);
            if (participantsRes.data.success) {
                setMembers(participantsRes.data.data);
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to load details');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (id) fetchDetails();
        }, [id])
    );

    const handleUpdateDueDate = async () => {
        try {
            setUpdatingDate(true);
            const res = await api.put(`/chit/schemes/${id}`, { nextDueDate });
            if (res.data.success) {
                Alert.alert('Success', 'Next due date updated successfully!');
                setScheme(res.data.data);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update due date');
        } finally {
            setUpdatingDate(false);
        }
    };

    const renderMemberCard = ({ item }) => (
        <View className="mb-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-start mb-2">
                <View>
                    <Text className="font-bold text-gray-800 text-base">{item.name}</Text>
                    <Text className="text-gray-400 text-xs">{item.email}</Text>
                </View>
                <View className={`px-2 py-1 rounded ${item.pending > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                    <Text className={`text-[10px] font-bold ${item.pending > 0 ? 'text-red-700' : 'text-green-700'}`}>
                        {item.status}
                    </Text>
                </View>
            </View>

            {/* Payment Progress Bar */}
            <View className="mt-2">
                <View className="flex-row justify-between mb-1">
                    <Text className="text-xs text-gray-500">Progress</Text>
                    <Text className="text-xs font-bold text-gray-800">{item.paidMonths} / {scheme?.durationMonths} Months</Text>
                </View>
                <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${(item.paidMonths / scheme?.durationMonths) * 100}%` }}
                    />
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="orange" />
            </View>
        );
    }

    if (!scheme) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Scheme not found</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-orange-500 pt-3 pb-6 px-4">
                <View className="flex-row items-center gap-2 mb-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white flex-1" numberOfLines={1}>
                        {scheme.name}
                    </Text>
                </View>

                {/* Stats */}
                <View className="flex-row justify-between bg-white/10 rounded-xl p-4 backdrop-blur-md">
                    <View className="items-center">
                        <Text className="text-orange-100 text-xs uppercase font-bold">Total</Text>
                        <Text className="text-white text-lg font-bold">₹{scheme.totalAmount}</Text>
                    </View>
                    <View className="w-[1px] bg-white/20 h-full" />
                    <View className="items-center">
                        <Text className="text-orange-100 text-xs uppercase font-bold">Monthly</Text>
                        <Text className="text-white text-lg font-bold">₹{scheme.installmentAmount}</Text>
                    </View>
                    <View className="w-[1px] bg-white/20 h-full" />
                    <View className="items-center">
                        <Text className="text-orange-100 text-xs uppercase font-bold">Users</Text>
                        <Text className="text-white text-lg font-bold">{members.length}</Text>
                    </View>
                </View>
            </View>

            {/* Admin Controls */}
            <View className="p-4 bg-white border-b border-gray-100 mb-2">
                <Text className="text-xs font-bold text-gray-400 uppercase mb-2">Update Next Due Date</Text>
                <View className="flex-row gap-2">
                    <TextInput
                        placeholder="e.g. 15th Feb 2026"
                        value={nextDueDate}
                        onChangeText={setNextDueDate}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800"
                    />
                    <TouchableOpacity
                        onPress={handleUpdateDueDate}
                        disabled={updatingDate}
                        className={`px-4 rounded-lg items-center justify-center ${updatingDate ? 'bg-orange-300' : 'bg-orange-500'}`}
                    >
                        {updatingDate ? <ActivityIndicator size="small" color="white" /> : <Text className="text-white font-bold">Update</Text>}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Members List */}
            <FlatList
                data={members}
                keyExtractor={item => item.id}
                renderItem={renderMemberCard}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View className="items-center mt-10">
                        <Text className="text-gray-400">No participants yet</Text>
                    </View>
                )}
            />
        </View>
    );
}
