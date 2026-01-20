import { useLocalSearchParams, useRouter } from 'expo-router'
import { Alert, ScrollView, Text, TouchableOpacity, View, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
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
      { key: 'processing', label: 'Processing', date: '', done: ['Processing', 'Shipped'].includes(status) },
      { key: 'shipped', label: 'Shipped', date: '', done: status === 'Shipped' }
    ];

    return {
      _id: backendOrder._id,
      items: backendOrder.orderItems,
      totalPrice: backendOrder.totalPrice,
      shippingPrice: backendOrder.shippingPrice,
      shippingAddress: backendOrder.shippingAddress,
      user: backendOrder.user,
      createdAt: backendOrder.createdAt?.substring(0, 10),
      steps,
      status
    };
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={styles.loadingText}>Fetching order details...</Text>
      </View>
    );
  }

  if (!order) return (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={64} color={THEME.colors.primary} />
      <Text style={styles.errorText}>Order not found.</Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.errorButton}>
        <Text style={styles.errorButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  )

  const handleReorder = () => {
    Alert.alert('Reorder', 'Adding items to cart...');
    // In a real app, you would iterate over order.items and call addItem(it)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Order Details</Text>
          <Text style={styles.headerSubtitle}>ID: #{order._id.substring(order._id.length - 8).toUpperCase()}</Text>
        </View>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color={THEME.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Status Card */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="truck-delivery-outline" size={20} color={THEME.colors.primary} />
            <Text style={styles.sectionTitle}>Order Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>
          <View style={styles.timelineWrapper}>
            <OrderTimeline steps={order.steps} />
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color={THEME.colors.primary} />
            <Text style={styles.sectionTitle}>Delivery Details</Text>
          </View>
          <View style={styles.addressCard}>
            <Text style={styles.addressName}>{order.user?.name || 'Customer'}</Text>
            <Text style={styles.addressText}>{order.shippingAddress || 'No address provided'}</Text>
            <Text style={styles.addressPhone}>Phone: {order.user?.mobileNumber || order.user?.phone || order.user?.mobile || 'N/A'}</Text>
          </View>
        </View>

        {/* Items List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cube-outline" size={20} color={THEME.colors.primary} />
            <Text style={styles.sectionTitle}>Items Ordered ({order.items.length})</Text>
          </View>
          <View style={styles.itemsWrapper}>
            {order.items.map((it, idx) => (
              <View key={idx} style={styles.itemContainer}>
                <OrderItem item={it} />
              </View>
            ))}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt-outline" size={20} color={THEME.colors.primary} />
            <Text style={styles.sectionTitle}>Payment Summary</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items Total</Text>
              <Text style={styles.summaryValue}>₹{formatCurrency(order.totalPrice - (order.shippingPrice || 0))}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₹{formatCurrency(order.shippingPrice || 0)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, { color: THEME.colors.success }]}>- ₹0.00</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹{formatCurrency(order.totalPrice)}</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Ionicons name="card-outline" size={16} color={THEME.colors.subtext} />
              <Text style={styles.paymentText}>Paid via Online Payment</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionButtons}>
          <Button
            variant="outline"
            style={styles.reorderBtn}
            onPress={handleReorder}
          >
            <Ionicons name="refresh-outline" size={20} color={THEME.colors.primary} />
            <Text style={styles.reorderBtnText}>Reorder Items</Text>
          </Button>

          <TouchableOpacity style={styles.downloadInvoice}>
            <Ionicons name="download-outline" size={18} color={THEME.colors.subtext} />
            <Text style={styles.downloadText}>Download Invoice</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  loadingText: {
    marginTop: 10,
    color: THEME.colors.subtext,
    fontSize: 14
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.text,
    textAlign: 'center'
  },
  headerSubtitle: {
    fontSize: 10,
    color: THEME.colors.subtext,
    textAlign: 'center',
    fontWeight: '600'
  },
  helpButton: {
    padding: 8
  },
  scrollContent: {
    padding: THEME.spacing.md,
  },
  section: {
    marginBottom: THEME.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.text,
    marginLeft: 8,
    flex: 1
  },
  statusBadge: {
    backgroundColor: '#FFEFEB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.primary,
    textTransform: 'uppercase'
  },
  timelineWrapper: {
    marginTop: 5
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: THEME.radii.lg,
    padding: THEME.spacing.md,
    ...THEME.shadows.soft,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  addressName: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: 4
  },
  addressText: {
    fontSize: 13,
    color: THEME.colors.subtext,
    lineHeight: 18
  },
  addressPhone: {
    fontSize: 13,
    color: THEME.colors.text,
    fontWeight: '600',
    marginTop: 8
  },
  itemsWrapper: {
    gap: THEME.spacing.xs
  },
  itemContainer: {
    marginHorizontal: -THEME.spacing.md, // To offset OrderItem's internal padding if it has any
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: THEME.radii.lg,
    padding: THEME.spacing.md,
    ...THEME.shadows.soft,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  summaryLabel: {
    fontSize: 14,
    color: THEME.colors.subtext
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.text
  },
  totalRow: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginBottom: 12
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.text
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.primary
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8
  },
  paymentText: {
    fontSize: 12,
    color: THEME.colors.subtext,
    marginLeft: 8,
    fontWeight: '500'
  },
  actionButtons: {
    marginTop: THEME.spacing.sm,
    alignItems: 'center'
  },
  reorderBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
    borderColor: THEME.colors.primary,
    borderWidth: 1.5
  },
  reorderBtnText: {
    color: THEME.colors.primary,
    fontWeight: '700',
    fontSize: 15
  },
  downloadInvoice: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  downloadText: {
    fontSize: 13,
    color: THEME.colors.subtext,
    fontWeight: '600',
    textDecorationLine: 'underline'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.text,
    marginTop: 16
  },
  errorButton: {
    marginTop: 20,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12
  },
  errorButtonText: {
    color: '#fff',
    fontWeight: '700'
  }
});

