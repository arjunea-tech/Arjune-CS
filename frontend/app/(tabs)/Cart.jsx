import { useRouter } from 'expo-router'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useCart } from '../../Components/CartComponents/CartContext'
import CartItem from '../../Components/CartComponents/CartItem'
import OrderSummary from '../../Components/CartComponents/OrderSummary'
import Button from '../../Components/ui/Button'
import Card from '../../Components/ui/Card'
import { H1 } from '../../Components/ui/Typography'
import { THEME } from '../../Components/ui/theme'

function CartInner() {
  const { cartItems, totals } = useCart()
  const router = useRouter()

  return (
    <View style={styles.container}>

      {/* 🔒 FIXED HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Cart</Text>
      </View>

      {/* 📜 SCROLLABLE CONTENT */}
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        {cartItems.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={{ color: THEME.colors.subtext }}>
              Your cart is empty.
            </Text>
            <Button
              style={{ marginTop: THEME.spacing.sm }}
              onPress={() => router.push('/')}
            >
              Continue Shopping
            </Button>
          </Card>
        ) : (
          <>
            {cartItems.map((it) => (
              <CartItem key={it.product._id || it.product.id} item={it} />
            ))}

            <Card style={styles.summaryCard}>
              <OrderSummary
                totals={totals}
                onProceed={() => router.push('/Checkout')}
              />
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  )
}

export default function Cart() {
  return <CartInner />
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
    elevation: 4,
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

  /* Cards */
  emptyCard: {
    margin: THEME.spacing.md,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  summaryCard: {
    margin: THEME.spacing.md,
    backgroundColor: '#fff'
  }
})
