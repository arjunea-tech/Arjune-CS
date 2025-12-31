import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../Components/ui/theme';

export default function OrderDetails() {
    const router = useRouter();

    // Mock Data
    const order = {
        id: 'ORD-1001',
        date: 'Oct 12, 2023 10:30 AM',
        status: 'Pending',
        customer: {
            name: 'Aarav Patel',
            email: 'aarav.patel@example.com',
            phone: '+91 98765 43210'
        },
        address: 'B-403, Galaxy Heights, Near MG Road, Bangalore, Karnataka - 560001',
        items: [
            { name: 'Premium Diya Set', qty: 2, price: '₹499', total: '₹998' },
            { name: 'Laptop Sleeve', qty: 1, price: '₹1,200', total: '₹1,200' },
        ],
        payment: {
            method: 'UPI',
            subtotal: '₹2,198',
            tax: '₹396',
            shipping: '₹50',
            total: '₹2,644'
        }
    };

    const [currentStatus, setCurrentStatus] = useState(order.status);
    const [modalVisible, setModalVisible] = useState(false);

    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

    // Helper to check if step is completed based on current status index
    const isStepCompleted = (stepName) => {
        const statusOrder = ['Pending', 'Processing', 'Shipped', 'Delivered'];
        const currentIndex = statusOrder.indexOf(currentStatus);
        const stepIndex = statusOrder.indexOf(stepName);
        return stepIndex <= currentIndex;
    };

    const handleUpdateStatus = (newStatus) => {
        setCurrentStatus(newStatus);
        setModalVisible(false);
    };

    const StatusStep = ({ label, isCompleted, isLast }) => (
        <View className="flex-row items-start h-16">
            <View className="items-center mr-4">
                <View className={`h-6 w-6 rounded-full items-center justify-center border-2 ${isCompleted ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-300'}`}>
                    {isCompleted && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                {!isLast && <View className={`w-0.5 flex-1 my-1 ${isCompleted ? 'bg-orange-500' : 'bg-gray-300'}`} />}
            </View>
            <View className="-mt-1">
                <Text className={`text-sm font-bold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>{label}</Text>
                <Text className="text-xs text-gray-400">{isCompleted ? 'Completed' : 'Pending'}</Text>
            </View>
        </View>
    );

    const navigation = useNavigation();

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between bg-white p-3 shadow-sm z-10">
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800">Order Details</Text>
                </View>
                <View className="bg-orange-100 px-3 py-1 rounded-full">
                    <Text className="text-orange-700 text-xs font-bold">{currentStatus}</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
                {/* Order ID & Date */}
                <View className="mb-6 flex-row justify-between items-center">
                    <View>
                        <Text className="text-2xl font-bold text-gray-800">{order.id}</Text>
                        <Text className="text-sm text-gray-500">{order.date}</Text>
                    </View>
                    <TouchableOpacity className="bg-white p-2 rounded-lg border border-gray-200">
                        <MaterialCommunityIcons name="printer-outline" size={20} color="gray" />
                    </TouchableOpacity>
                </View>

                {/* Tracking Step */}
                <View className="bg-white p-5 rounded-2xl shadow-sm mb-6 border border-gray-100">
                    <Text className="text-sm font-bold text-gray-500 uppercase mb-4">Order Status</Text>
                    {steps.map((step, index) => (
                        <StatusStep
                            key={step}
                            label={step}
                            isCompleted={isStepCompleted(step)}
                            isLast={index === steps.length - 1}
                        />
                    ))}
                </View>

                {/* Items */}
                <View className="bg-white p-5 rounded-2xl shadow-sm mb-6 border border-gray-100">
                    <Text className="text-sm font-bold text-gray-500 uppercase mb-4">Items Ordered</Text>
                    {order.items.map((item, index) => (
                        <View key={index} className="flex-row justify-between items-center mb-4 last:mb-0">
                            <View className="flex-row items-center flex-1">
                                <View className="h-10 w-10 bg-gray-100 rounded-lg mr-3 items-center justify-center">
                                    <Ionicons name="image-outline" size={16} color="gray" />
                                </View>
                                <View>
                                    <Text className="font-bold text-gray-800">{item.name}</Text>
                                    <Text className="text-xs text-gray-500">Qty: {item.qty} x {item.price}</Text>
                                </View>
                            </View>
                            <Text className="font-bold text-gray-800">{item.total}</Text>
                        </View>
                    ))}
                </View>

                {/* Shipping Info */}
                <View className="bg-white p-5 rounded-2xl shadow-sm mb-6 border border-gray-100">
                    <Text className="text-sm font-bold text-gray-500 uppercase mb-4">Shipping Details</Text>

                    <View className="mb-4">
                        <Text className="font-bold text-gray-800 mb-1">{order.customer.name}</Text>
                        <Text className="text-sm text-gray-500 leading-5">{order.address}</Text>
                    </View>
                    <View className="flex-row items-center border-t border-gray-100 pt-3">
                        <View className="mr-6">
                            <Text className="text-xs text-gray-400 mb-0.5">Mobile</Text>
                            <Text className="text-sm font-medium text-gray-700">{order.customer.phone}</Text>
                        </View>
                        <View>
                            <Text className="text-xs text-gray-400 mb-0.5">Email</Text>
                            <Text className="text-sm font-medium text-gray-700">{order.customer.email}</Text>
                        </View>
                    </View>
                </View>

                {/* Payment Summary */}
                <View className="bg-white p-5 rounded-2xl shadow-sm mb-24 border border-gray-100">
                    <Text className="text-sm font-bold text-gray-500 uppercase mb-4">Payment Summary</Text>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500">Subtotal</Text>
                        <Text className="font-medium text-gray-800">{order.payment.subtotal}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500">Tax</Text>
                        <Text className="font-medium text-gray-800">{order.payment.tax}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500">Shipping</Text>
                        <Text className="font-medium text-gray-800">{order.payment.shipping}</Text>
                    </View>
                    <View className="h-[1px] bg-gray-100 my-2" />
                    <View className="flex-row justify-between">
                        <Text className="font-bold text-lg text-gray-800">Total</Text>
                        <Text className="font-bold text-lg text-orange-600">{order.payment.total}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Actions */}
            <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100">
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    className="w-full py-4 rounded-xl bg-orange-500 items-center justify-center shadow-lg"
                >
                    <Text className="font-bold text-white text-lg">Update Status</Text>
                </TouchableOpacity>
            </View>

            {/* Status Update Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6">
                        <Text className="text-xl font-bold text-gray-800 mb-4 text-center">Update Order Status</Text>
                        <Text className="text-gray-500 text-center mb-6">Change the status of this order to keep the customer informed.</Text>

                        {steps.map((status) => (
                            <TouchableOpacity
                                key={status}
                                onPress={() => handleUpdateStatus(status)}
                                className={`mb-3 p-4 rounded-xl border ${currentStatus === status ? 'bg-orange-50 border-orange-500' : 'bg-gray-50 border-gray-200'} flex-row items-center justify-between`}
                            >
                                <Text className={`font-bold ${currentStatus === status ? 'text-orange-700' : 'text-gray-700'}`}>{status}</Text>
                                {currentStatus === status && <Ionicons name="checkmark-circle" size={24} color="#FF6B00" />}
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            className="mt-4 p-4 items-center"
                        >
                            <Text className="font-bold text-gray-500">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
