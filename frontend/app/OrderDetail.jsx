import { useLocalSearchParams, useRouter } from 'expo-router'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useCart } from '../Components/CartComponents/CartContext'
import OrderItem from '../Components/OrderComponents/OrderItem'
import OrderTimeline from '../Components/OrderComponents/OrderTimeline'
import Button from '../Components/ui/Button'
import Card from '../Components/ui/Card'
import { THEME } from '../Components/ui/theme'
import { formatCurrency } from '../Components/utils/format'

import { useEffect, useState } from 'react'
import api from '../Components/api/config'

export default function OrderDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { addItem } = useCart();
  const id = params?.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.data.success) {
        setOrder(mapOrderToUI(res.data.data));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load order.');
    } finally {
      setLoading(false);
    }
  };

  const mapOrderToUI = (backendOrder) => {
    const status = backendOrder.orderStatus;
    const steps = [
      { key: 'requested', label: 'Requested', date: backendOrder.createdAt?.substring(0, 10), done: true },
      { key: 'placed', label: 'Order confirmed', date: '', done: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(status) },
      { key: 'shipped', label: 'Shipped', date: '', done: ['Shipped', 'Out for Delivery', 'Delivered'].includes(status) },
      { key: 'delivered', label: 'Delivered', date: backendOrder.deliveredAt?.substring(0, 10), done: status === 'Delivered' }
    ];

    return {
      _id: backendOrder._id,
      items: backendOrder.orderItems, // already has name, price, qty, image
      totalPrice: backendOrder.totalPrice,
      shippingPrice: backendOrder.shippingPrice,
      steps,
      status
    };
  }

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;

  if (!order) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Text>Order not found.</Text>
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12, backgroundColor: '#ff7f7f', padding: 10, borderRadius: 8 }}>
        <Text style={{ color: '#fff' }}>Go back</Text>
      </TouchableOpacity>
    </View>
  )

  const handleReorder = () => {
    Alert.alert('Reorder', 'Coming soon.');
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: THEME.colors.primary }}>
      <View style={{ padding: THEME.spacing.md }}>
        <Text style={{ fontWeight: '700', fontSize: THEME.fonts.title, color: '#fff', marginBottom: THEME.spacing.sm }}>Order #{order._id.substring(order._id.length - 6)}</Text>

        <Card>
          <OrderTimeline steps={order.steps} />
        </Card>

        <Text style={{ fontWeight: '700', marginTop: THEME.spacing.md, color: '#fff' }}>Order Items</Text>
        {order.items.map((it, idx) => <OrderItem key={idx} item={it} />)}

        <Card style={{ marginTop: THEME.spacing.md }}>
          <Text style={{ fontWeight: '700', marginBottom: 6 }}>Order Summary</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text>Subtotal (approx)</Text>
            <Text>₹{formatCurrency(order.totalPrice - order.shippingPrice)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text>Shipping</Text>
            <Text>₹{formatCurrency(order.shippingPrice)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, borderTopWidth: 1, borderTopColor: THEME.colors.muted, paddingTop: 8 }}>
            <Text style={{ fontWeight: '700' }}>Grand Total</Text>
            <Text style={{ fontWeight: '700' }}>₹{formatCurrency(order.totalPrice)}</Text>
          </View>
        </Card>

        <View style={{ flexDirection: 'row', marginTop: THEME.spacing.md, gap: 12 }}>
          <Button variant="ghost" style={{ flex: 1, marginRight: 8 }} onPress={() => router.back()}>
            <Text style={{ color: THEME.colors.primary, fontWeight: '700' }}>Back</Text>
          </Button>

          <Button style={{ flex: 1 }} onPress={handleReorder}>
            Reorder
          </Button>
        </View>
      </View>
    </ScrollView>
  )
}
