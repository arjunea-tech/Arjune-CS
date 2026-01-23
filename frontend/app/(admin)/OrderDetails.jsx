
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { THEME } from '../../Components/ui/theme';
import api from '../../Components/api/config';
import { settingsAPI } from '../../Components/api';

export default function OrderDetails() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const id = params.id;
    const [order, setOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [descriptions, setDescriptions] = useState({ shipping: '', fees: '' });
    const navigation = useNavigation();

    useEffect(() => {
        if (id) fetchOrder();
        fetchSettings();
    }, [id]);

    const fetchSettings = async () => {
        try {
            const res = await settingsAPI.getSettings();
            if (res.success) {
                setDescriptions({
                    shipping: res.data.shipping?.description || 'No description available.',
                    fees: res.data.fees?.description || 'No description available.'
                });
            }
        } catch (error) {
            console.log('Failed to fetch settings for descriptions');
        }
    };

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

    const mapBackendToUI = (o) => {
        const originalTotal = o.orderItems.reduce((acc, i) => acc + ((i.price || 0) * i.qty), 0);
        // Use discountPrice from backend, or calculate if not available
        const discount = o.discountPrice || Math.max(0, originalTotal - (o.itemsPrice || 0));

        return {
            id: o._id,
            date: new Date(o.createdAt).toLocaleString(),
            status: o.orderStatus,
            customer: {
                name: o.user?.name || o.orderItems?.[0]?.name?.split(' ')?.[0] || 'Guest',
                email: o.user?.email || 'N/A',
                phone: o.user?.mobileNumber || o.user?.phone || o.user?.mobile ||
                    (o.shippingAddress?.match(/\d{10}/)?.[0]) || 'N/A'
            },
            address: o.shippingAddress ||
                (o.user?.address ? `${o.user.address}, ${o.user.district}, ${o.user.state} - ${o.user.pincode}` : null) ||
                o.shippingInfo?.address || 'N/A',
            items: o.orderItems.map(i => ({
                name: i.name,
                qty: i.qty,
                price: i.price,
                total: i.qty * i.price
            })),
            payment: {
                method: o.paymentMethod,
                subtotal: `₹${originalTotal.toFixed(2)}`,
                discount: discount > 0 ? `-₹${discount.toFixed(2)}` : `₹0`,
                tax: `₹${(o.taxPrice || 0).toFixed(2)}`,
                shipping: `₹${(o.shippingPrice || 0).toFixed(2)}`,
                otherFees: `₹${(o.otherFees || 0).toFixed(2)}`,
                total: `₹${(o.totalPrice || 0).toFixed(2)}`
            }
        };
    };

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

    const steps = ['Requested', 'Processing', 'Shipped', 'Cancelled'];
    // Backend uses 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'. 'Pending' might be mapped to 'Processing' or we align UI.
    // UI steps: ['Pending', 'Processing', 'Shipped', 'Delivered'] in previous code.
    // Let's align with backend enum: Processing, Shipped, Out for Delivery, Delivered.

    const isStepCompleted = (stepName) => {
        const statusOrder = ['Requested', 'Processing', 'Shipped'];
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
                    {['Requested', 'Processing', 'Shipped'].map((step, index) => (
                        <StatusStep
                            key={step}
                            label={step}
                            isCompleted={isStepCompleted(step)}
                            isLast={index === 2}
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
                {/* Payment Summary */}
                <View className="bg-white p-5 rounded-2xl shadow-sm mb-24 border border-gray-100">
                    <Text className="text-sm font-bold text-gray-500 uppercase mb-4">Payment Summary</Text>
                    <View className="flex-row justify-between mb-4 pb-4 border-b border-gray-100">
                        <Text className="text-gray-500">Payment Method</Text>
                        <Text className="font-medium text-gray-800">{order.payment.method || 'Cash on Delivery'}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500">Items Total</Text>
                        <Text className="font-medium text-gray-800">{order.payment.subtotal}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500">Discount</Text>
                        <Text className="font-medium text-green-600">{order.payment.discount}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500">Tax</Text>
                        <Text className="font-medium text-gray-800">{order.payment.tax}</Text>
                    </View>
                    <TouchableOpacity
                        className="flex-row justify-between mb-2"
                        onPress={() => Alert.alert('Shipping Description', descriptions.shipping)}
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center">
                            <Text className="text-gray-500 mr-1">Shipping</Text>
                            <Ionicons name="information-circle-outline" size={14} color="gray" />
                        </View>
                        <Text className="font-medium text-gray-800">{order.payment.shipping}</Text>
                    </TouchableOpacity>
                    {order.payment.otherFees !== '₹0.00' && (
                        <TouchableOpacity
                            className="flex-row justify-between mb-2"
                            onPress={() => Alert.alert('Fees Description', descriptions.fees)}
                            activeOpacity={0.7}
                        >
                            <View className="flex-row items-center">
                                <Text className="text-gray-500 mr-1">Other Fees</Text>
                                <Ionicons name="information-circle-outline" size={14} color="gray" />
                            </View>
                            <Text className="font-medium text-gray-800">{order.payment.otherFees}</Text>
                        </TouchableOpacity>
                    )}
                    <View className="h-[1px] bg-gray-100 my-2" />
                    <View className="flex-row justify-between">
                        <Text className="font-bold text-lg text-gray-800">Total</Text>
                        <Text className="font-bold text-lg text-orange-600">{order.payment.total}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Actions */}
            <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100">
                {['Shipped', 'Delivered', 'Cancelled'].includes(order.status) ? (
                    <View className="w-full py-4 rounded-xl bg-gray-300 items-center justify-center">
                        <Text className="font-bold text-gray-500 text-lg">Order Locked: {order.status}</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        className="w-full py-4 rounded-xl bg-orange-500 items-center justify-center shadow-lg"
                    >
                        <Text className="font-bold text-white text-lg">Update Status</Text>
                    </TouchableOpacity>
                )}
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
