import { useLocalSearchParams, useRouter } from 'expo-router'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useCart } from '../Components/CartComponents/CartContext'
import OrderItem from '../Components/OrderComponents/OrderItem'
import OrderTimeline from '../Components/OrderComponents/OrderTimeline'
import Button from '../Components/ui/Button'
import Card from '../Components/ui/Card'
import { THEME } from '../Components/ui/theme'
import { formatCurrency } from '../Components/utils/format'
import ordersData from '../testing/OrdersTestData.json'
import productsData from '../testing/ProductsTestData.json'

export default function OrderDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { addItem } = useCart();
  const id = params?.id;
  const order = ordersData.find(o => o.id === id);

  if (!order) return (
    <View style={{ flex:1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Text>Order not found.</Text>
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12, backgroundColor: '#ff7f7f', padding: 10, borderRadius: 8 }}>
        <Text style={{ color: '#fff' }}>Go back</Text>
      </TouchableOpacity>
    </View>
  )

  const subtotal = order.items.reduce((s, it) => {
    const p = productsData.find(pp => String(pp.id) === String(it.productId));
    return s + (p?.price || 0) * it.quantity;
  }, 0);

  const handleReorder = () => {
    order.items.forEach(it => {
      const p = productsData.find(pp => String(pp.id) === String(it.productId));
      if (p) addItem(p, it.quantity);
    });
    Alert.alert('Added to cart', 'Order items have been added to your cart.');
    router.push('/(tabs)/Cart');
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: THEME.colors.primary }}>
      <View style={{ padding: THEME.spacing.md }}>
        <Text style={{ fontWeight: '700', fontSize: THEME.fonts.title, color: '#fff', marginBottom: THEME.spacing.sm }}>Order #{order.id}</Text>

        <Card>
          <OrderTimeline steps={order.steps} />
        </Card>

        <Text style={{ fontWeight: '700', marginTop: THEME.spacing.md, color: '#fff' }}>Order Items</Text>
        {order.items.map((it, idx) => <OrderItem key={idx} item={it} />)}

        <Card style={{ marginTop: THEME.spacing.md }}>
          <Text style={{ fontWeight: '700', marginBottom: 6 }}>Order Summary</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text>Subtotal</Text>
            <Text>${formatCurrency(subtotal)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text>Shipping</Text>
            <Text>{subtotal >= 100 ? 'Free' : `$${formatCurrency(20)}`}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, borderTopWidth: 1, borderTopColor: THEME.colors.muted, paddingTop: 8 }}>
            <Text style={{ fontWeight: '700' }}>Grand Total</Text>
            <Text style={{ fontWeight: '700' }}>${formatCurrency(subtotal + (subtotal >= 100 ? 0 : 20))}</Text>
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
