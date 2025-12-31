import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChitDetails() {
    const router = useRouter();

    // Mock Scheme Data
    const scheme = {
        name: 'Diwali Gold Plan 2024',
        total: '₹12,000',
        monthly: '₹1,000',
        membersCount: 45,
        months_total: 12,
        current_month: 8
    };

    // Mock Members with Payment Status
    const [members, setMembers] = useState([
        { id: '1', name: 'Aarav Patel', phone: '9876543210', paidMonths: 8, pending: 0, status: 'Up to Date' },
        { id: '2', name: 'Priya Sharma', phone: '9876512345', paidMonths: 6, pending: 2, status: 'Overdue' },
        { id: '3', name: 'Rohan Gupta', phone: '9123456789', paidMonths: 8, pending: 0, status: 'Up to Date' },
        { id: '4', name: 'Ananya Singh', phone: '9988776655', paidMonths: 7, pending: 1, status: 'Late' },
        { id: '5', name: 'Vikram M', phone: '9112233445', paidMonths: 8, pending: 0, status: 'Up to Date' },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const handleMarkPayment = (member) => {
        setSelectedMember(member);
        setModalVisible(true);
    };

    const confirmPayment = (month) => {
        alert(`Payment for Month ${month} recorded for ${selectedMember.name}!`);
        setModalVisible(false);
        // Here you would typically update the state/backend
    };

    const renderMemberCard = ({ item }) => (
        <View className="mb-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-start mb-2">
                <View>
                    <Text className="font-bold text-gray-800 text-base">{item.name}</Text>
                    <Text className="text-gray-400 text-xs">{item.phone}</Text>
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
                    <Text className="text-xs font-bold text-gray-800">{item.paidMonths} / {scheme.months_total} Months</Text>
                </View>
                <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${(item.paidMonths / scheme.months_total) * 100}%` }}
                    />
                </View>
            </View>

            {/* Quick Action */}
            <TouchableOpacity
                onPress={() => handleMarkPayment(item)}
                className="mt-3 bg-gray-50 py-2 rounded-lg items-center border border-gray-200"
            >
                <Text className="text-xs font-bold text-gray-600">Mark Payment</Text>
            </TouchableOpacity>
        </View>
    );

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
                    <TouchableOpacity>
                        <Ionicons name="settings-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View className="flex-row justify-between bg-white/10 rounded-xl p-4 backdrop-blur-md">
                    <View className="items-center">
                        <Text className="text-orange-100 text-xs uppercase font-bold">Total</Text>
                        <Text className="text-white text-lg font-bold">{scheme.total}</Text>
                    </View>
                    <View className="w-[1px] bg-white/20 h-full" />
                    <View className="items-center">
                        <Text className="text-orange-100 text-xs uppercase font-bold">Monthly</Text>
                        <Text className="text-white text-lg font-bold">{scheme.monthly}</Text>
                    </View>
                    <View className="w-[1px] bg-white/20 h-full" />
                    <View className="items-center">
                        <Text className="text-orange-100 text-xs uppercase font-bold">Users</Text>
                        <Text className="text-white text-lg font-bold">{scheme.membersCount}</Text>
                    </View>
                </View>
            </View>

            {/* Search */}
            <View className="px-4 py-3 bg-white shadow-sm mb-1">
                <View className="flex-row items-center rounded-xl bg-gray-50 px-3 py-2 border border-gray-200">
                    <Ionicons name="search" size={18} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search member..."
                        className="ml-2 flex-1 text-gray-800"
                    />
                </View>
            </View>

            {/* Members List */}
            <FlatList
                data={members}
                keyExtractor={item => item.id}
                renderItem={renderMemberCard}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            {/* Payment Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6 h-[50%]">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-bold text-gray-800">Record Payment</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-gray-500 mb-4">
                            Select the month to mark as paid for <Text className="font-bold text-gray-800">{selectedMember?.name}</Text>.
                        </Text>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                <TouchableOpacity
                                    key={month}
                                    onPress={() => confirmPayment(month)}
                                    className="flex-row items-center justify-between p-4 mb-2 bg-gray-50 rounded-xl border border-gray-100"
                                >
                                    <Text className="font-bold text-gray-700">Month {month}</Text>
                                    {month <= (selectedMember?.paidMonths || 0) ? (
                                        <Text className="text-green-600 font-bold text-xs">PAID</Text>
                                    ) : (
                                        <Text className="text-orange-500 font-bold text-xs">MARK PAID</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
