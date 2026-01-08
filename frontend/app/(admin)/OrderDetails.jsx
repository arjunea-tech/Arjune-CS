
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { THEME } from '../../Components/ui/theme';
import api from '../../Components/api/config';

export default function OrderDetails() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const id = params.id;
    const [order, setOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        if (id) fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/orders/${id}`);
            if (res.data.success) {
                setOrder(mapBackendToUI(res.data.data));
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load order DETAILS');
        }
    };

    const mapBackendToUI = (o) => ({
        id: o._id,
        date: new Date(o.createdAt).toLocaleString(),
        status: o.orderStatus,
        customer: {
            name: o.user?.name || 'Guest',
            email: o.user?.email || 'N/A',
            phone: o.shippingAddress?.phone || 'N/A' // Assuming shippingAddress has phone
        },
        address: o.shippingAddress, // Assuming string or object with toString? shippingAddress in model is String.
        items: o.orderItems.map(i => ({
            name: i.name,
            qty: i.qty,
            price: i.price,
            total: i.qty * i.price
        })),
        payment: {
            method: o.paymentMethod,
            subtotal: `₹${o.itemsPrice}`,
            tax: `₹${o.taxPrice}`,
            shipping: `₹${o.shippingPrice}`,
            total: `₹${o.totalPrice}`
        }
    });

    const handleUpdateStatus = async (newStatus) => {
        try {
            const res = await api.put(`/orders/${id}/status`, { status: newStatus });
            if (res.data.success) {
                Alert.alert('Success', `Status updated to ${newStatus}`);
                fetchOrder();
                setModalVisible(false);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update status');
        }
    };

    if (!order) return <View className="flex-1 items-center justify-center"><Text>Loading...</Text></View>;

    const steps = ['Requested', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    // Backend uses 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'. 'Pending' might be mapped to 'Processing' or we align UI.
    // UI steps: ['Pending', 'Processing', 'Shipped', 'Delivered'] in previous code.
    // Let's align with backend enum: Processing, Shipped, Out for Delivery, Delivered.

    const isStepCompleted = (stepName) => {
        const statusOrder = ['Requested', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
        const currentIndex = statusOrder.indexOf(order.status);
        const stepIndex = statusOrder.indexOf(stepName);
        return stepIndex <= currentIndex;
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
                    <Text className="text-orange-700 text-xs font-bold">{order.status}</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
                {/* Order ID & Date */}
                <View className="mb-6 flex-row justify-between items-center">
                    <View>
                        <Text className="text-2xl font-bold text-gray-800">#{order.id.substring(order.id.length - 6)}</Text>
                        <Text className="text-sm text-gray-500">{order.date}</Text>
                    </View>
                    <TouchableOpacity className="bg-white p-2 rounded-lg border border-gray-200">
                        <MaterialCommunityIcons name="printer-outline" size={20} color="gray" />
                    </TouchableOpacity>
                </View>

                {/* Tracking Step */}
                <View className="bg-white p-5 rounded-2xl shadow-sm mb-6 border border-gray-100">
                    <Text className="text-sm font-bold text-gray-500 uppercase mb-4">Order Status</Text>
                    {['Requested', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, index) => (
                        <StatusStep
                            key={step}
                            label={step}
                            isCompleted={isStepCompleted(step)}
                            isLast={index === 4}
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
                            <Text className="font-bold text-gray-800">₹{item.total}</Text>
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
                                className={`mb-3 p-4 rounded-xl border ${order.status === status ? 'bg-orange-50 border-orange-500' : 'bg-gray-50 border-gray-200'} flex-row items-center justify-between`}
                            >
                                <Text className={`font-bold ${order.status === status ? 'text-orange-700' : 'text-gray-700'}`}>{status}</Text>
                                {order.status === status && <Ionicons name="checkmark-circle" size={24} color="#FF6B00" />}
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
