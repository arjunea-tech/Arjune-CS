import { Linking, StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { settingsAPI } from "../Components/api";

export default function AboutUs() {
  const navigation = useNavigation();
  const [aboutUs, setAboutUs] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      setLoading(true);
      const resAbout = await settingsAPI.getAboutUs();
      const resSettings = await settingsAPI.getSettings();
      if (resAbout.success) {
        setAboutUs(resAbout.data);
      }
      if (resSettings.success) {
        setSettings(resSettings.data);
      }
    } catch (error) {
      console.error('Error fetching About Us:', error);
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
          <Text style={styles.headerTitle}>About Us</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF7F00" />
        </View>
      </View>
    );
  }

  const defaultAboutUs = {
    title: 'CrackerShop',
    description: 'CrackerShop provides high-quality crackers at affordable prices with safe and fast delivery.',
    mission: '',
    vision: ''
  };

  const data = aboutUs || defaultAboutUs;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* CONTENT */}
        <View style={styles.card}>
          <Text style={styles.appName}>{data.title || 'CrackerShop'}</Text>
          {data.description && (
            <Text style={styles.desc}>
              {data.description}
            </Text>
          )}

          {/* Mission Section */}
          {data.mission && (
            <View style={styles.sectionBox}>
              <View style={styles.sectionHeader}>
                <Ionicons name="checkmark-circle" size={20} color="#FF7F00" />
                <Text style={styles.sectionTitle}>Our Mission</Text>
              </View>
              <Text style={styles.sectionText}>{data.mission}</Text>
            </View>
          )}

          {/* Vision Section */}
          {data.vision && (
            <View style={styles.sectionBox}>
              <View style={styles.sectionHeader}>
                <Ionicons name="eye-outline" size={20} color="#FF7F00" />
                <Text style={styles.sectionTitle}>Our Vision</Text>
              </View>
              <Text style={styles.sectionText}>{data.vision}</Text>
            </View>
          )}
        </View>

        {/* Contact Section */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contact Us</Text>
          {settings?.contact?.phone && (
            <InfoRow icon="call-outline" label="Mobile" value={settings.contact.phone} />
          )}
          {settings?.contact?.address && (
            <InfoRow
              icon="home-outline"
              label="Address"
              value={settings.contact.address}
            />
          )}
          {settings?.contact?.email && (
            <InfoRow icon="mail-outline" label="Email" value={settings.contact.email} />
          )}

          {/* View Location Button */}
          <TouchableOpacity
            style={styles.mapBtn}
            onPress={() => {
              // Use coordinates if available, otherwise fall back to address
              if (settings?.contact?.latitude && settings?.contact?.longitude) {
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${settings.contact.latitude},${settings.contact.longitude}`;
                Linking.openURL(mapsUrl);
              } else {
                const query = encodeURIComponent(settings?.contact?.address || 'Sivakasi Tamil Nadu');
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${query}`
                );
              }
            }}
          >
            <Ionicons name="navigate-outline" size={18} color="#fff" />
            <Text style={styles.mapText}>View Location on Map</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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

  contactCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 3,
    marginBottom: 30,
  },

  contactTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ff7f00",
    marginBottom: 14,
  },

  sectionBox: {
    backgroundColor: "#f9f9f9",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ff7f00",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ff7f00",
    marginLeft: 8,
  },

  sectionText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
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
