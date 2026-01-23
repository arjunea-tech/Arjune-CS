import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useCart } from '../Components/CartComponents/CartContext'
import OrderSummary from '../Components/CartComponents/OrderSummary'
import Button from '../Components/ui/Button'
import Card from '../Components/ui/Card'
import { THEME } from '../Components/ui/theme'
import api from '../Components/api/config'
import { useAuth } from '../Components/utils/AuthContext'
import { settingsAPI } from '../Components/api'
import { Modal, FlatList } from 'react-native'

export default function Checkout() {
  const router = useRouter();
  const { user } = useAuth();
  const { totals, clearCart, cartItems } = useCart();
  const [minimumOrderAmount, setMinimumOrderAmount] = useState(100);

  // Initialize address from user data
  const [address, setAddress] = useState(user?.address || '');
  const [editingAddress, setEditingAddress] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  // Fetch minimum order amount
  useEffect(() => {
    const fetchOrderSettings = async () => {
      try {
        const res = await settingsAPI.getOrderSettings();
        if (res.success && res.data?.minimumOrderAmount) {
          setMinimumOrderAmount(res.data.minimumOrderAmount);
        }
      } catch (error) {
        console.error('Error fetching order settings:', error);
      }
    };
    fetchOrderSettings();
  }, []);

  const placeOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      Alert.alert('Cart empty', 'Add items to cart before placing an order.');
      return;
    }

    // Validate minimum order amount
    if (totals.grandTotal < minimumOrderAmount) {
      Alert.alert(
        'Minimum Order Amount',
        `Your order must be at least ₹${minimumOrderAmount}. Current total: ₹${totals.grandTotal.toFixed(2)}`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      // Map cart items to backend format
      const orderItems = cartItems.map(i => ({
        product: i.product.id || i.product._id, // Handle both id formats
        name: i.product.name,
        qty: i.quantity,
        image: i.product.image || i.product.images?.[0], // Fallback for image
        price: i.product.price
      }));

      const orderData = {
        orderItems,
        shippingAddress: `${address}\nPhone: ${user?.mobileNumber || ''}`,
        paymentMethod: 'Requested',
        itemsPrice: totals.subtotal,
        taxPrice: 0, // Calculate tax if needed
        shippingPrice: totals.shipping,
        otherFees: totals.otherFees,
        discountPrice: totals.discount,
        totalPrice: totals.grandTotal
      };

      const response = await api.post('/orders', orderData);

      if (response.data.success) {
        clearCart();
        Alert.alert('Order placed', 'Your order has been placed successfully');
        router.push('/(tabs)/Orders');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      const msg = error.response?.data?.error || 'Failed to place order';
      Alert.alert('Order Failed', msg);
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <Text style={{ fontWeight: '700' }}>Delivery Address</Text>
              {(user?.addresses && user.addresses.length > 0) && (
                <TouchableOpacity onPress={() => setShowAddressPicker(true)}>
                  <Text style={{ color: THEME.colors.primary, fontWeight: '600' }}>Select Saved Address</Text>
                </TouchableOpacity>
              )}
            </View>

            {!editingAddress ? (
              <View style={{ paddingRight: 60 }}>
                <Text style={{ fontSize: 14, color: '#333' }}>{address || 'No address set'}</Text>
                <Button style={styles.changeBtn} onPress={() => setEditingAddress(true)}>
                  Edit
                </Button>
              </View>
            ) : (
              <View>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  style={styles.addressInput}
                  multiline
                  placeholder="Enter detailed delivery address"
                />
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

          <OrderSummary totals={totals} buttonLabel="Place Order" onProceed={placeOrder} />
        </View>
      </ScrollView>

      {/* Address Picker Modal */}
      <Modal visible={showAddressPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Delivery Address</Text>
              <TouchableOpacity onPress={() => setShowAddressPicker(false)}>
                <Ionicons name="close" size={24} color="#222" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={user?.addresses || []}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.savedAddressItem}
                  onPress={() => {
                    setAddress(`${item.address}, ${item.district}, ${item.state} - ${item.pincode}`);
                    setShowAddressPicker(false);
                    setEditingAddress(false);
                  }}
                >
                  <View style={styles.labelBadge}>
                    <Text style={styles.labelText}>{item.label}</Text>
                  </View>
                  <Text style={styles.savedAddressText}>{item.address}</Text>
                  <Text style={styles.savedLocationText}>{item.district}, {item.state} - {item.pincode}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
  changeBtn: { position: 'absolute', right: 0, top: 0, marginTop: -4 },
  addressInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 80,
    textAlignVertical: 'top'
  },
  sectionTitle: { color: THEME.colors.text, fontSize: THEME.fonts.subtitle, fontWeight: '700', marginBottom: THEME.spacing.sm, marginTop: THEME.spacing.md },
  payOption: { backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.radii.md, marginBottom: THEME.spacing.sm, borderWidth: 1, borderColor: THEME.colors.border },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#222' },
  savedAddressItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  labelBadge: { backgroundColor: '#fff0e0', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
  labelText: { color: '#ff7f00', fontSize: 11, fontWeight: '700' },
  savedAddressText: { fontSize: 14, color: '#333' },
  savedLocationText: { fontSize: 12, color: '#777', marginTop: 2 },

  payOptionActive: { borderColor: THEME.colors.primary, backgroundColor: '#fff8f0' },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});