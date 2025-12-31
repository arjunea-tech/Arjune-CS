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
import ordersData from '../../testing/OrdersTestData.json'
import productsData from '../../testing/ProductsTestData.json'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'

export default function Orders() {
  const router = useRouter()
  const { addItem } = useCart()
  const [orders, setOrders] = useState([])

  const handleReorder = (order) => {
    order.items.forEach(it => {
      const p = productsData.find(
        p => String(p.id) === String(it.productId)
      )
      if (p) addItem(p, it.quantity)
    })
    Alert.alert('Added to cart', 'Order items have been added to your cart.')
    router.push('/(tabs)/Cart')
  }

  const loadOrders = async () => {
    try {
      const raw = await AsyncStorage.getItem('orders')
      setOrders(raw ? JSON.parse(raw) : ordersData)
    } catch {
      setOrders(ordersData)
    }
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
        {orders.map((o) => {
          const subtotal = o.items.reduce((s, it) => {
            const p = productsData.find(
              pp => String(pp.id) === String(it.productId)
            )
            return s + (p?.price || 0) * it.quantity
          }, 0)

          return (
            <Card key={o.id} style={styles.orderWrap}>
              <View style={styles.headerRowInside}>
                <Text style={styles.orderTitle}>Order #{o.id}</Text>
                <Text style={styles.orderDate}>{o.placedAt}</Text>
              </View>

              <OrderTimeline steps={o.steps} />

              <View style={{ marginTop: THEME.spacing.md }}>
                {o.items.map((it, idx) => (
                  <OrderItem key={idx} item={it} />
                ))}
              </View>

              <View style={styles.summaryRow}>
                <Text style={{ fontWeight: '700' }}>Subtotal</Text>
                <Text style={{ fontWeight: '700' }}>
                  ${subtotal.toFixed(2)}
                </Text>
              </View>

              <View style={styles.actionsRow}>
                <Button
                  variant="ghost"
                  style={{ flex: 1, marginRight: 8 }}
                  onPress={() =>
                    router.push(`/OrderDetail?id=${o.id}`)
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
        })}
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
