import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

export default function AdminDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={26} color="#000" />
          </TouchableOpacity>

          <Text style={styles.logo}>
            Admin<Text style={{ color: "#FF5722" }}>Panel</Text>
          </Text>

          <View style={styles.headerRight}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
            <View style={styles.avatar} />
          </View>
        </View>

        {/* WELCOME */}
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.userName}>
              Namaste,{"\n"}
              <Text style={{ color: "#FF5722" }}>Arjun!</Text>
            </Text>
          </View>
          <Text style={{ fontSize: 26 }}>☀️</Text>
        </View>

        {/* STATS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.card, { backgroundColor: "#FF5722" }]}>
            <Ionicons name="grid-outline" size={22} color="#fff" />
            <Text style={styles.cardLabel}>Total Revenue</Text>
            <Text style={styles.cardValue}>₹54,230</Text>
          </View>

          <View style={styles.cardLight}>
            <MaterialIcons name="inventory" size={22} color="#FF5722" />
            <Text style={styles.cardLabelDark}>Orders</Text>
            <Text style={styles.cardValueDark}>1,245</Text>
          </View>
        </ScrollView>

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actions}>
          <Action icon="add" label="Add Item" />
          <Action icon="inventory" label="Products" />
          <Action icon="people" label="Users" />
          <Action icon="settings" label="Settings" />
        </View>

        {/* ORDERS */}
        <Text style={styles.sectionTitle}>Recent Orders</Text>

        <Order name="iPhone 15" price="₹1,19,999" status="Paid" />
        <Order name="Sony Headphones" price="₹34,999" status="Pending" />
        <Order name="Apple Watch" price="₹39,999" status="Paid" />

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <Feather name="home" size={22} color="#FF5722" />
        <Feather name="bar-chart-2" size={22} color="#666" />
        <Feather name="box" size={22} color="#666" />
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* COMPONENTS */

const Action = ({ icon, label }: any) => (
  <View style={styles.actionItem}>
    <MaterialIcons name={icon} size={26} color="#FF5722" />
    <Text style={styles.actionText}>{label}</Text>
  </View>
);

const Order = ({ name, price, status }: any) => (
  <View style={styles.order}>
    <View>
      <Text style={styles.orderName}>{name}</Text>
      <Text style={styles.orderPrice}>{price}</Text>
    </View>
    <Text style={{ color: status === "Paid" ? "green" : "orange" }}>
      {status}
    </Text>
  </View>
);

/* STYLES */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  scrollContent: { padding: 20, paddingBottom: 120 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: { fontSize: 20, fontWeight: "bold" },

  headerRight: { flexDirection: "row", alignItems: "center", gap: 15 },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#DDD",
  },

  welcomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 25,
  },

  greeting: { color: "#777" },
  userName: { fontSize: 26, fontWeight: "bold" },

  card: {
    width: 180,
    height: 140,
    borderRadius: 20,
    padding: 20,
    marginRight: 15,
  },

  cardLight: {
    width: 180,
    height: 140,
    borderRadius: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
  },

  cardLabel: { color: "#fff", marginTop: 10 },
  cardValue: { color: "#fff", fontSize: 22, fontWeight: "bold" },

  cardLabelDark: { color: "#777", marginTop: 10 },
  cardValueDark: { fontSize: 22, fontWeight: "bold" },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 20 },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  actionItem: { alignItems: "center" },
  actionText: { fontSize: 12, marginTop: 6 },

  order: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  orderName: { fontWeight: "bold" },
  orderPrice: { color: "#777" },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF5722",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
  },
});
