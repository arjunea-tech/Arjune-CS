import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AboutUs() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
      </View>

      {/* CONTENT */}
      <View style={styles.card}>
        <Text style={styles.appName}>CrackerShop</Text>
        <Text style={styles.desc}>
          CrackerShop provides high-quality crackers at affordable prices with
          safe and fast delivery.
        </Text>

        <InfoRow icon="call-outline" label="Mobile" value="+91 98765 43210" />
        <InfoRow
          icon="home-outline"
          label="Address"
          value="No.12, Main Road, Sivakasi"
        />
        <InfoRow
          icon="business-outline"
          label="District"
          value="Virudhunagar"
        />
        <InfoRow icon="map-outline" label="State" value="Tamil Nadu" />
        <InfoRow icon="mail-outline" label="Pincode" value="626123" />

        <TouchableOpacity
          style={styles.mapBtn}
          onPress={() =>
            Linking.openURL(
              "https://www.google.com/maps/search/?api=1&query=Sivakasi+Tamil+Nadu"
            )
          }
        >
          <Ionicons name="navigate-outline" size={18} color="#fff" />
          <Text style={styles.mapText}>View Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* REUSABLE ROW */
function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color="#ff7f00" />
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
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

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 3,
  },

  appName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ff7f00",
    marginBottom: 6,
  },

  desc: {
    fontSize: 14,
    color: "#444",
    marginBottom: 16,
    lineHeight: 22,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    color: "#888",
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  mapBtn: {
    flexDirection: "row",
    backgroundColor: "#ff7f00",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  mapText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
  },
});
