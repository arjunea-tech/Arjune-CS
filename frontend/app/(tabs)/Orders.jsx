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
    const isPaid = backendOrder.isPaid;
    const isDelivered = backendOrder.isDelivered;
    
    const steps = [
      { key: 'requested', label: 'Requested', date: backendOrder.createdAt?.substring(0, 10), done: true },
      { key: 'processing', label: 'Processing', date: '', done: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(status) },
      { key: 'shipped', label: 'Shipped', date: '', done: ['Shipped', 'Out for Delivery', 'Delivered'].includes(status) },
      { key: 'delivered', label: 'Delivered', date: backendOrder.deliveredAt?.substring(0, 10), done: isDelivered }
    ];

    return {
      _id: backendOrder._id,
      items: backendOrder.orderItems,
      totalPrice: backendOrder.totalPrice,
      paymentMethod: backendOrder.paymentMethod,
      isPaid: isPaid,
      createdAt: backendOrder.createdAt?.substring(0, 10),
      steps,
      status,
      isDelivered
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
      <ScrollView contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: THEME.spacing.md }}>
        <View style={styles.gridContainer}>
          {orders.map((o) => (
            <TouchableOpacity
              key={o._id}
              style={styles.orderCard}
              onPress={() => router.push(`/OrderDetail?id=${o._id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{o.status}</Text>
              </View>

              {o.isPaid && (
                <View style={[styles.statusBadge, { bottom: 0, right: 0, top: 'auto', backgroundColor: '#E8F5E9', borderBottomLeftRadius: 12, borderTopRightRadius: 0 }]}>
                  <Text style={[styles.statusText, { color: '#4CAF50' }]}>Paid</Text>
                </View>
              )}

              <View style={styles.cardContent}>
                <Ionicons name="receipt-outline" size={24} color={THEME.colors.primary} />
                <View style={styles.textContainer}>
                  <Text style={styles.orderIdText}>Order #{o._id.substring(o._id.length - 6)}</Text>
                  <Text style={styles.dateText}>{o.createdAt}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.priceLabel}>Amount</Text>
                <Text style={styles.priceValue}>₹{o.totalPrice.toFixed(2)}</Text>
              </View>

              <View style={styles.itemsCount}>
                <Text style={styles.itemsText}>{o.items.length} {o.items.length === 1 ? 'Item' : 'Items'}</Text>
                <Ionicons name="chevron-forward" size={16} color={THEME.colors.subtext} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {orders.length === 0 && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Ionicons name="cart-outline" size={64} color="#fff" opacity={0.5} />
            <Text style={{ color: '#fff', marginTop: 16, fontSize: 16, fontWeight: '600' }}>No orders found.</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/Home')}
              style={{ marginTop: 20, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}
            >
              <Text style={{ color: THEME.colors.primary, fontWeight: 'bold' }}>Start Shopping</Text>
            </TouchableOpacity>
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

  /* Grid Layout */
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: THEME.spacing.sm
  },
  orderCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: THEME.radii.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    ...THEME.shadows.soft,
    position: 'relative',
    overflow: 'hidden'
  },
  statusBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 12
  },
  statusText: {
    fontSize: 8,
    fontWeight: '800',
    color: THEME.colors.primary,
    textTransform: 'uppercase'
  },
  cardContent: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 8
  },
  orderIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.text
  },
  dateText: {
    fontSize: 10,
    color: THEME.colors.subtext,
    marginTop: 2
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
    alignItems: 'center'
  },
  priceLabel: {
    fontSize: 8,
    color: THEME.colors.subtext,
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.primary
  },
  itemsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  itemsText: {
    fontSize: 10,
    color: THEME.colors.subtext,
    marginRight: 2
  }
})
