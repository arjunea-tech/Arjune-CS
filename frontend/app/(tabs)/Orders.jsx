import { useRouter } from 'expo-router'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useCart } from '../../Components/CartComponents/CartContext'
import OrderItem from '../../Components/OrderComponents/OrderItem'
import OrderTimeline from '../../Components/OrderComponents/OrderTimeline'
import Button from '../../Components/ui/Button'
import Card from '../../Components/ui/Card'
import { THEME } from '../../Components/ui/theme'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import api from '../../Components/api/config'

export default function Orders() {
  const router = useRouter()
  const { addItem } = useCart()
  const [orders, setOrders] = useState([])

  const handleReorder = (order) => {
    // Reorder logic needs to be adapted for API products being full objects
    // Assuming order.orderItems has full product details or we need to fetch them
    // For now, simple alert or skipping complex re-add logic
    Alert.alert('Reorder', 'Feature coming soon linked to live inventory.')
    // Logic: fetch product by ID -> addItem
  }

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders/myorders');
      if (response.data.success) {
        setOrders(response.data.data.map(mapOrderToUI));
      }
    } catch (error) {
      console.error('Failed to load orders', error);
      Alert.alert('Error', 'Could not load your orders.');
    }
  }

  // Helper to map backend order to UI format
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
      items: backendOrder.orderItems,
      totalPrice: backendOrder.totalPrice,
      createdAt: backendOrder.createdAt?.substring(0, 10),
      steps,
      status
    };
  }

  useFocusEffect(
    useCallback(() => {
      loadOrders()
    }, [])
  )

  return (
    <View style={styles.container}>

      {/* 🔒 FIXED HEADER (NOT SCROLLING) */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Orders</Text>
      </View>

      {/* 📜 SCROLLABLE CONTENT */}
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {orders.map((o) => (
          <Card key={o._id} style={styles.orderWrap}>
            <View style={styles.headerRowInside}>
              <Text style={styles.orderTitle}>Order #{o._id.substring(o._id.length - 6)}</Text>
              <Text style={styles.orderDate}>{o.createdAt}</Text>
            </View>

            <OrderTimeline steps={o.steps} />

            <View style={{ marginTop: THEME.spacing.md }}>
              {o.items.map((it, idx) => (
                <OrderItem key={idx} item={it} />
              ))}
            </View>

            <View style={styles.summaryRow}>
              <Text style={{ fontWeight: '700' }}>Total</Text>
              <Text style={{ fontWeight: '700' }}>
                ₹{o.totalPrice.toFixed(2)}
              </Text>
            </View>

            <View style={styles.actionsRow}>
              <Button
                variant="ghost"
                style={{ flex: 1, marginRight: 8 }}
                onPress={() =>
                  router.push(`/OrderDetail?id=${o._id}`)
                }
              >
                <Text style={{ color: THEME.colors.primary, fontWeight: '700' }}>
                  View Details
                </Text>
              </Button>

              <Button style={{ flex: 1 }} onPress={() => handleReorder(o)}>
                Reorder
              </Button>
            </View>
          </Card>
        )
        )}
        {orders.length === 0 && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#fff' }}>No orders found.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  /* Page */
  container: {
    flex: 1,
    backgroundColor: THEME.colors.primary
  },

  /* 🔒 Fixed Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.primary,
    elevation: 4, // Android shadow
    zIndex: 10
  },
  backBtn: {
    marginRight: THEME.spacing.sm
  },
  pageTitle: {
    color: '#fff',
    fontSize: THEME.fonts.title,
    fontWeight: '800'
  },

  /* Order Cards */
  orderWrap: {
    padding: THEME.spacing.md,
    margin: THEME.spacing.sm,
    backgroundColor: THEME.colors.surface
  },
  headerRowInside: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.sm
  },
  orderTitle: {
    fontSize: THEME.fonts.title,
    fontWeight: '800'
  },
  orderDate: {
    color: THEME.colors.subtext
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: THEME.spacing.md,
    paddingTop: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.muted
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: THEME.spacing.md
  }
})
