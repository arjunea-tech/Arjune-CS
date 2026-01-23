import { useLocalSearchParams, useRouter } from 'expo-router'
import { Alert, ScrollView, Text, TouchableOpacity, View, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
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
      status,
      paymentMethod: backendOrder.paymentMethod || 'Cash on Delivery',
      isPaid: backendOrder.isPaid || false
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

  const handleDownloadInvoice = async () => {
    try {
      if (!order) return;

      const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 40px; }
              .logo-text { font-size: 28px; font-weight: 800; color: #E65100; letter-spacing: -1px; }
              .invoice-details { text-align: right; }
              .invoice-title { font-size: 36px; font-weight: 300; color: #ccc; text-transform: uppercase; margin: 0; line-height: 1; }
              .invoice-meta { font-size: 14px; color: #666; margin-top: 5px; }
              
              .billing-info { display: flex; justify-content: space-between; margin-bottom: 50px; }
              .billing-col { width: 45%; }
              .col-header { font-size: 11px; text-transform: uppercase; color: #999; font-weight: 700; margin-bottom: 15px; letter-spacing: 1px; }
              .address-block { font-size: 15px; color: #111; }
              .address-line { margin-bottom: 4px; display: block; }
              
              table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
              th { text-align: left; padding: 15px 10px; border-bottom: 2px solid #eee; font-size: 11px; text-transform: uppercase; color: #666; font-weight: 700; letter-spacing: 0.5px; }
              td { padding: 15px 10px; border-bottom: 1px solid #eee; font-size: 14px; vertical-align: top; }
              .text-right { text-align: right; }
              .text-center { text-align: center; }
              .font-medium { font-weight: 500; }
              
              .summary-section { display: flex; justify-content: flex-end; }
              .summary-box { width: 280px; background: #fafafa; padding: 20px; border-radius: 8px; }
              .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #555; }
              .total-row { border-top: 2px solid #333; margin-top: 15px; padding-top: 15px; font-weight: 700; font-size: 18px; color: #000; align-items: center; }
              
              .footer { margin-top: 80px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eee; padding-top: 30px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="logo-text">CrackerShop</div>
                <div style="font-size: 12px; color: #999; margin-top: 5px;">Premium Crackers Store</div>
              </div>
              <div class="invoice-details">
                <div class="invoice-title">Invoice</div>
                <div class="invoice-meta"><strong>Invoice #:</strong> ${order._id.substring(order._id.length - 8).toUpperCase()}</div>
                <div class="invoice-meta"><strong>Date:</strong> ${order.createdAt || dateStr}</div>
              </div>
            </div>

            <div class="billing-info">
              <div class="billing-col">
                <div class="col-header">Billed To</div>
                <div class="address-block">
                  <span class="address-line" style="font-weight: 700; font-size: 16px;">${order.user?.name || 'Valued Customer'}</span>
                  <span class="address-line">${order.shippingAddress?.replace(/\\n/g, '<br/>') || 'No Address Provided'}</span>
                  <span class="address-line" style="margin-top: 8px; color: #666;">${order.user?.mobileNumber || ''}</span>
                </div>
              </div>
              <div class="billing-col text-right">
                <div class="col-header">Payment Status</div>
                <div class="address-block">
                  <span class="address-line"><span style="color: #4CAF50; font-weight: 700;">${order.isPaid ? 'Paid' : 'Pending'}</span></span>
                  <span class="address-line" style="margin-top: 5px; font-size: 13px; color: #666;">Method: ${order.paymentMethod}</span>
                  <span class="address-line" style="margin-top: 5px; font-size: 13px; color: #666;">Order Status: ${order.status}</span>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 50%">Item Description</th>
                  <th class="text-center">Qty</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>
                      <div class="font-medium">${item.name}</div>
                    </td>
                    <td class="text-center">${item.qty}</td>
                    <td class="text-right">₹${item.price}</td>
                    <td class="text-right">₹${(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="summary-section">
              <div class="summary-box">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>₹${order.items.reduce((acc, i) => acc + (i.price * i.qty), 0).toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>Shipping Fee</span>
                  <span>₹${(order.shippingPrice || 0).toFixed(2)}</span>
                </div>
                <div class="summary-row" style="color: #4CAF50;">
                  <span>Discount</span>
                  <span>- ₹${(Math.max(0, order.items.reduce((acc, item) => acc + ((item.price || 0) * item.qty), 0) - (order.totalPrice - (order.shippingPrice || 0)))).toFixed(2)}</span>
                </div>
                <div class="summary-row total-row">
                  <span>Total</span>
                  <span>₹${(order.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for shopping with CrackerShop!</p>
              <p>For support, contact us at support@crackershop.com</p>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to generate invoice. Please try again.");
    }
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
              <Text style={styles.summaryValue}>₹{formatCurrency(order.items.reduce((acc, item) => acc + ((item.price || 0) * item.qty), 0))}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₹{formatCurrency(order.shippingPrice || 0)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, { color: THEME.colors.success }]}>
                - ₹{formatCurrency(Math.max(0, order.items.reduce((acc, item) => acc + ((item.price || 0) * item.qty), 0) - (order.totalPrice - (order.shippingPrice || 0))))}
              </Text>
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

          <TouchableOpacity style={styles.downloadInvoice} onPress={handleDownloadInvoice}>
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

