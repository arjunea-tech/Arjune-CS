import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useCart } from '../Components/CartComponents/CartContext'
import OrderSummary from '../Components/CartComponents/OrderSummary'
import Button from '../Components/ui/Button'
import Card from '../Components/ui/Card'
import { THEME } from '../Components/ui/theme'

export default function Checkout() {
  const router = useRouter();
  const { totals, clearCart } = useCart();
  const [payment, setPayment] = useState('card');

  const placeOrder = () => {
    // simple mock place order
    clearCart();
    Alert.alert('Order placed', 'Your order has been placed successfully');
    router.replace('/');
  }

  return (
    <View style={[styles.container, { backgroundColor: THEME.colors.primary }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitleLeft}>Checkout</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.body}>
        <Card style={styles.addressCard}>
          <Text style={{ fontWeight: '700', marginBottom: 6 }}>Delivery Address</Text>
          <Text>XYZ......</Text>
          <Button style={styles.changeBtn} onPress={() => Alert.alert('Change address')}>
            Change
          </Button>
        </Card>

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity style={[styles.payOption, payment === 'card' && styles.payOptionActive]} onPress={() => setPayment('card')}>
          <Text>Credit/Debit card</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.payOption, payment === 'upi' && styles.payOptionActive]} onPress={() => setPayment('upi')}>
          <Text>UPI Method</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.payOption, payment === 'cod' && styles.payOptionActive]} onPress={() => setPayment('cod')}>
          <Text>Cash on Delivery</Text>
        </TouchableOpacity>

        <OrderSummary totals={totals} buttonLabel="Place Order" onProceed={placeOrder} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 110, paddingTop: 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: THEME.spacing.md, justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitleLeft: { color: '#fff', fontSize: THEME.fonts.title, fontWeight: '700', marginLeft: THEME.spacing.sm },
  body: { padding: THEME.spacing.md },
  addressCard: { position: 'relative' },
  changeBtn: { position: 'absolute', right: 16, top: 12 },
  sectionTitle: { color: '#fff', fontSize: THEME.fonts.title, fontWeight: '700', marginBottom: THEME.spacing.sm, marginTop: THEME.spacing.md },
  payOption: { backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.radii.md, marginBottom: THEME.spacing.sm },
  payOptionActive: { ...THEME.shadows.medium }
});