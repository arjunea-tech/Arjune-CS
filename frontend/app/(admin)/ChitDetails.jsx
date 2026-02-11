import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, FlatList, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { THEME } from '../../Components/ui/theme';
import { chitAPI } from '../../Components/api';
import { printChitDetailReport } from '../../Components/utils/ReportUtils';
import { useFocusEffect } from '@react-navigation/native';

export default function ChitDetails() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const id = params.id || params.schemeId;

    const [scheme, setScheme] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [nextDueDate, setNextDueDate] = useState('');
    const [updatingDate, setUpdatingDate] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);

    const handlePrint = async () => {
        try {
            const dataToPrint = members.map(p => ({
                name: p.name || 'Unknown',
                email: p.email || 'N/A',
                paidMonths: p.paidMonths || 0,
                pending: (scheme?.durationMonths || 0) - (p.paidMonths || 0),
                status: p.status || 'Active'
            }));
            await printChitDetailReport(scheme?.name || 'Scheme Detail', dataToPrint);
        } catch (error) {
            Alert.alert('Error', 'Failed to generate report');
        }
    };

    const fetchDetails = async () => {
        if (!id) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            // Fetch scheme
            const schemeRes = await chitAPI.getScheme(id);
            if (schemeRes.data.success) {
                setScheme(schemeRes.data.data);
                setNextDueDate(schemeRes.data.data.nextDueDate || '');
            }

            // Fetch participants
            const participantsRes = await chitAPI.getSchemeParticipants(id);
            if (participantsRes.data.success) {
                setMembers(participantsRes.data.data || []);
            }
        } catch (error) {
            console.log("Fetch Details Error:", error);
            Alert.alert('Error', 'Failed to load details');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDetails();
        }, [id])
    );

    const handleUpdateDueDate = async () => {
        try {
            setUpdatingDate(true);
            const res = await chitAPI.updateScheme(id, { nextDueDate });
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

    const handleRecordPayment = (user) => {
        Alert.alert(
            'Confirm Payment',
            `Record payment of ₹${scheme?.installmentAmount} for ${user.name} (Month ${user.paidMonths + 1})?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        try {
                            setProcessingPayment(true);
                            await chitAPI.recordUserPayment({
                                schemeId: id,
                                userId: user.id
                            });
                            Alert.alert('Success', 'Payment recorded successfully');
                            fetchDetails();
                        } catch (error) {
                            Alert.alert('Error', error.response?.data?.error || 'Failed to record payment');
                        } finally {
                            setProcessingPayment(false);
                        }
                    }
                }
            ]
        );
    };

    const handleApprove = (user) => {
        Alert.alert('Confirm Approval', `Approve ${user.name} to join?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Approve',
                onPress: async () => {
                    try {
                        setProcessingPayment(true);
                        await chitAPI.approveJoinRequest({ userId: user.id, schemeId: id });
                        fetchDetails();
                        Alert.alert('Success', 'User approved');
                    } catch (error) {
                        Alert.alert('Error', 'Failed to approve');
                    } finally {
                        setProcessingPayment(false);
                    }
                }
            }
        ]);
    };

    const handleReject = (user) => {
        Alert.alert('Reject Request', `Reject ${user.name}?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Reject',
                style: 'destructive',
                onPress: async () => {
                    try {
                        setProcessingPayment(true);
                        await chitAPI.rejectJoinRequest({ userId: user.id, schemeId: id });
                        fetchDetails();
                        Alert.alert('Success', 'User rejected');
                    } catch (error) {
                        Alert.alert('Error', 'Failed to reject');
                    } finally {
                        setProcessingPayment(false);
                    }
                }
            }
        ]);
    };

    const renderMemberCard = ({ item }) => {
        const isPending = item.status === 'Pending Approval';
        return (
            <View className="mb-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <View className="flex-row justify-between items-start mb-2">
                    <View>
                        <Text className="font-bold text-gray-800 text-base">{item.name}</Text>
                        <Text className="text-gray-400 text-xs">{item.email}</Text>
                    </View>
                    <View className={`px-2 py-1 rounded ${isPending ? 'bg-red-100' : 'bg-green-100'}`}>
                        <Text className={`text-[10px] font-bold ${isPending ? 'text-red-700' : 'text-green-700'}`}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                {/* Progress Bar */}
                <View className="mt-2">
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-xs text-gray-500">Progress</Text>
                        <Text className="text-xs font-bold text-gray-800">{item.paidMonths} / {scheme?.durationMonths} Months</Text>
                    </View>
                    <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-orange-500"
                            style={{ width: `${(item.paidMonths / scheme?.durationMonths) * 100}%` }}
                        />
                    </View>

                    {item.daysRemaining !== null && (
                        <View className="mt-2 flex-row justify-between items-center bg-gray-50 p-2 rounded">
                            <Text className="text-xs text-gray-500">
                                Due: {new Date(item.nextDueDate).toLocaleDateString()}
                            </Text>
                            <Text className={`text-xs font-bold ${item.daysRemaining < 5 ? 'text-red-500' : 'text-blue-500'}`}>
                                {item.daysRemaining > 0 ? `${item.daysRemaining} days left` : 'Overdue'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Actions */}
                {isPending ? (
                    <View className="flex-row gap-2 mt-4">
                        <TouchableOpacity onPress={() => handleApprove(item)} className="flex-1 bg-green-500 py-2 rounded-lg items-center">
                            <Text className="text-white font-bold text-xs uppercase">Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleReject(item)} className="flex-1 bg-red-500 py-2 rounded-lg items-center">
                            <Text className="text-white font-bold text-xs uppercase">Reject</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    item.pending > 0 && (
                        <TouchableOpacity
                            onPress={() => handleRecordPayment(item)}
                            className="mt-4 bg-orange-500 py-2 rounded-lg items-center"
                        >
                            <Text className="text-white font-bold text-xs uppercase">Record Payment</Text>
                        </TouchableOpacity>
                    )
                )}
            </View>
        );
    };

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
                <TouchableOpacity onPress={fetchDetails} className="mt-4 p-2 bg-orange-500 rounded">
                    <Text className="text-white">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Standard Header with Print */}
            <View className="bg-orange-500 pt-3 pb-6 px-4">
                <View className="flex-row items-center gap-2 mb-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white flex-1" numberOfLines={1}>
                        {scheme.name}
                    </Text>
                    <TouchableOpacity onPress={handlePrint} className="p-2">
                        <Ionicons name="print-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Header Stats */}
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
