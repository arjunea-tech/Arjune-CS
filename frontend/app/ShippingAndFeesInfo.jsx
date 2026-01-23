import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { settingsAPI } from "../Components/api";

export default function ShippingAndFeesInfo() {
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsAPI.getSettings();
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shipping & Fees</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#FF7F00" />
        </View>
      </View>
    );
  }

  const shipping = data?.shipping || {};
  const fees = data?.fees || {};
  const orderSettings = data?.orderSettings || {};

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shipping & Fees</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Shipping Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBox}>
              <Ionicons name="rocket-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.sectionTitle}>Shipping</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLabel}>
                <Ionicons name="pricetag-outline" size={18} color="#FF7F00" />
                <Text style={styles.label}>Base Shipping Fee</Text>
              </View>
              <Text style={styles.value}>₹{shipping.baseFee || 50}</Text>
            </View>

            <View style={[styles.row, styles.borderTop]}>
              <View style={styles.rowLabel}>
                <Ionicons name="gift-outline" size={18} color="#FF7F00" />
                <Text style={styles.label}>Free Shipping Above</Text>
              </View>
              <Text style={styles.value}>₹{shipping.freeShippingAbove || 500}</Text>
            </View>

            {shipping.description && (
              <View style={[styles.descriptionBox, styles.borderTop]}>
                <Ionicons name="information-circle-outline" size={18} color="#3B82F6" />
                <Text style={styles.description}>{shipping.description}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Additional Fees Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBox, { backgroundColor: "#A855F7" }]}>
              <Ionicons name="cash-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.sectionTitle}>Additional Fees</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLabel}>
                <Ionicons name="box-outline" size={18} color="#FF7F00" />
                <Text style={styles.label}>Packaging Fee</Text>
              </View>
              <Text style={styles.value}>₹{fees.packagingFee || 0}</Text>
            </View>

            <View style={[styles.row, styles.borderTop]}>
              <View style={styles.rowLabel}>
                <Ionicons name="hand-right-outline" size={18} color="#FF7F00" />
                <Text style={styles.label}>Handling Fee</Text>
              </View>
              <Text style={styles.value}>₹{fees.handlingFee || 0}</Text>
            </View>

            {fees.description && (
              <View style={[styles.descriptionBox, styles.borderTop]}>
                <Ionicons name="information-circle-outline" size={18} color="#3B82F6" />
                <Text style={styles.description}>{fees.description}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Minimum Order Amount Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBox, { backgroundColor: "#10B981" }]}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.sectionTitle}>Minimum Order</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLabel}>
                <Ionicons name="cart-outline" size={18} color="#FF7F00" />
                <Text style={styles.label}>Minimum Order Amount</Text>
              </View>
              <Text style={styles.value}>₹{orderSettings.minimumOrderAmount || 100}</Text>
            </View>

            {orderSettings.description && (
              <View style={[styles.descriptionBox, styles.borderTop]}>
                <Ionicons name="alert-circle-outline" size={18} color="#F59E0B" />
                <Text style={styles.description}>{orderSettings.description}</Text>
              </View>
            )}

            <View style={[styles.infoBox, styles.borderTop]}>
              <Text style={styles.infoText}>
                Your order must meet the minimum order amount to proceed with checkout.
              </Text>
            </View>
          </View>
        </View>

        {/* Summary Box */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>📊 How It Works</Text>
          <View style={styles.summaryCard}>
            <SummaryItem
              icon="1-circle"
              title="Add Items"
              description="Add items to your cart totaling at least ₹100"
            />
            <SummaryItem
              icon="2-circle"
              title="Calculate Shipping"
              description="Shipping fee is applied based on your order total"
            />
            <SummaryItem
              icon="3-circle"
              title="Additional Fees"
              description="Packaging and handling fees may apply"
            />
            <SummaryItem
              icon="4-circle"
              title="Checkout"
              description="Proceed to checkout with total amount"
            />
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

function SummaryItem({ icon, title, description }) {
  return (
    <View style={styles.summaryItem}>
      <View style={styles.summaryNumber}>
        <Text style={styles.summaryNumberText}>
          {icon === "1-circle" && "1"}
          {icon === "2-circle" && "2"}
          {icon === "3-circle" && "3"}
          {icon === "4-circle" && "4"}
        </Text>
      </View>
      <View style={styles.summaryContent}>
        <Text style={styles.summaryItemTitle}>{title}</Text>
        <Text style={styles.summaryItemDesc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ff7f00",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 12,
  },

  content: {
    flex: 1,
    padding: 12,
  },

  section: {
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF7F00",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  borderTop: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },

  rowLabel: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  label: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    fontWeight: "600",
  },

  value: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ff7f00",
  },

  descriptionBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
  },

  description: {
    fontSize: 13,
    color: "#3B82F6",
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },

  infoBox: {
    paddingVertical: 12,
    paddingHorizontal: 0,
  },

  infoText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },

  summarySection: {
    marginBottom: 20,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333",
    marginBottom: 12,
  },

  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  summaryItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  summaryNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ff7f00",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  summaryNumberText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },

  summaryContent: {
    flex: 1,
  },

  summaryItemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },

  summaryItemDesc: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    lineHeight: 16,
  },
});
