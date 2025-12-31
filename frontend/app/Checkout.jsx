import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useCart } from '../Components/CartComponents/CartContext'
import OrderSummary from '../Components/CartComponents/OrderSummary'
import Button from '../Components/ui/Button'
import Card from '../Components/ui/Card'
import { THEME } from '../Components/ui/theme'

export default function Checkout() {
  const router = useRouter();
  const { totals, clearCart, cartItems } = useCart();
  const [payment, setPayment] = useState('card');
  const [address, setAddress] = useState('XYZ......');
  const [editingAddress, setEditingAddress] = useState(false);

  const placeOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      Alert.alert('Cart empty', 'Add items to cart before placing an order.');
      return;
    }

    const items = cartItems.map(i => ({ productId: String(i.product.id), quantity: i.quantity }));
    const id = `ord_${Date.now()}`;
    const placedAt = new Date().toISOString().slice(0, 10);
    const steps = [
      { key: 'placed', label: 'Order placed', date: placedAt, done: true },
      { key: 'shipped', label: 'Shipped', date: '', done: false },
      { key: 'out', label: 'Out for Delivery', date: '', done: false },
      { key: 'delivered', label: 'Delivered', date: '', done: false }
    ];

    const newOrder = { id, placedAt, steps, items };

    try {
      const raw = await AsyncStorage.getItem('orders');
      const existing = raw ? JSON.parse(raw) : [];
      const updated = [newOrder, ...existing];
      await AsyncStorage.setItem('orders', JSON.stringify(updated));
    } catch (e) {
      // ignore persistence error, still proceed
    }

    clearCart();
    Alert.alert('Order placed', 'Your order has been placed successfully');
    router.push('/(tabs)/Orders');
  }

  const handleUPIPayment = async (provider) => {
    const upiId = 'merchant@upi'; // replace with your merchant's UPI ID
    const merchant = 'CrackerShop';
    const amount = totals?.grandTotal ?? 0;
    const note = `Order payment (${provider})`;
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchant)}&tn=${encodeURIComponent(note)}&am=${encodeURIComponent(amount)}&cu=INR`;

    try {
      await Linking.openURL(upiUrl);
    } catch (e) {
      Alert.alert('Unable to open UPI app', 'No UPI app found or the app could not be opened. Please install Paytm/GPay/PhonePe or try again.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitleLeft}>Checkout</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>
      <ScrollView
        style={{ flex: 1, backgroundColor: THEME.colors.background }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.body}>
          <Card style={styles.addressCard}>
            <Text style={{ fontWeight: '700', marginBottom: 6 }}>Delivery Address</Text>
            {!editingAddress ? (
              <>
                <Text>{address}</Text>
                <Button style={styles.changeBtn} onPress={() => setEditingAddress(true)}>
                  Change
                </Button>
              </>
            ) : (
              <View>
                <TextInput value={address} onChangeText={setAddress} style={{ backgroundColor: '#fff', padding: 8, borderRadius: 6 }} />
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <Button variant="ghost" style={{ flex: 1, marginRight: 8 }} onPress={() => { setEditingAddress(false); }}>
                    Cancel
                  </Button>
                  <Button style={{ flex: 1 }} onPress={() => setEditingAddress(false)}>
                    Save
                  </Button>
                </View>
              </View>
            )}
          </Card>

          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity
            style={[styles.payOption, payment === 'card' && styles.payOptionActive]}
            onPress={() => setPayment('card')}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.payRow}>
              <Text>Credit/Debit card</Text>
              <Ionicons name={payment === 'card' ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={payment === 'card' ? THEME.colors.primary : '#999'} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.payOption, payment === 'upi' && styles.payOptionActive]}
            onPress={() => setPayment('upi')}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.payRow}>
              <Text>UPI Method</Text>
              <Ionicons name={payment === 'upi' ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={payment === 'upi' ? THEME.colors.primary : '#999'} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.payOption, payment === 'cod' && styles.payOptionActive]}
            onPress={() => setPayment('cod')}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.payRow}>
              <Text>Cash on Delivery</Text>
              <Ionicons name={payment === 'cod' ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={payment === 'cod' ? THEME.colors.primary : '#999'} />
            </View>
          </TouchableOpacity>

          {payment === 'upi' && (
            <Card style={{ marginTop: 12 }}>
              <Text style={{ fontWeight: '700', marginBottom: 6 }}>UPI Options</Text>
              <Text>Paytm / Google Pay / PhonePe</Text>
              <Text style={{ marginTop: 6, color: THEME.colors.subtext }}>Tap a provider below to open your UPI app and pay.</Text>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Button style={{ flex: 1, marginRight: 8 }} onPress={() => handleUPIPayment('paytm')}>Pay with Paytm</Button>
                <Button style={{ flex: 1 }} onPress={() => handleUPIPayment('gpay')}>Pay with GPay</Button>
              </View>
            </Card>
          )}

          <OrderSummary totals={totals} buttonLabel="Place Order" onProceed={placeOrder} />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: { height: 40, paddingTop: 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: THEME.spacing.md, justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', marginTop: -50 },
  headerTitleLeft: { color: THEME.colors.primary, fontSize: THEME.fonts.title, fontWeight: '700', marginLeft: THEME.spacing.sm, marginTop: 2 },
  body: {
    padding: THEME.spacing.md,
    paddingBottom: 10 // important for scroll
  },
  addressCard: { position: 'relative' },
  changeBtn: { position: 'absolute', right: 16, top: 12 },
  sectionTitle: { color: '#fff', fontSize: THEME.fonts.title, fontWeight: '700', marginBottom: THEME.spacing.sm, marginTop: THEME.spacing.md },
  payOption: { backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.radii.md, marginBottom: THEME.spacing.sm },
  payOptionActive: { ...THEME.shadows.medium },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});