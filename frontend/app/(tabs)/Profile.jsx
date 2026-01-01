import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProfileAvatar from "../../Components/ProfileComponents/ProfileAvatar";
import ProfileCard from "../../Components/ProfileComponents/ProfileCard";
import { useAuth } from "../../Components/utils/AuthContext";
import { authAPI } from "../../Components/api";

export default function Profile() {
  const navigation = useNavigation();
  const { user, logout, login } = useAuth();

  useEffect(() => {
    refreshUserData();
  }, []);

  const refreshUserData = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.success) {
        // Update context with latest data
        await login({
          token: user.token,
          ...res.data
        });
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/Login');
          },
        },
      ]
    );
  };

  const sections = [
    /* ================= ACCOUNT SETTINGS ================= */
    {
      title: "Account Settings ",
      items: [
        {
          icon: "create-outline",
          label: "Edit Profile",
          onPress: () => navigation.navigate("EditProfile"),
        },
        {
          icon: "location-outline",
          label: "Saved Address",
          onPress: () => navigation.navigate("SavedAddress"),
        },
      ],
    },
    /* ================= APP ================= */
    {
      title: "App",
      items: [
        {
          icon: "information-circle-outline",
          label: "About CrackerShop",
          onPress: () => navigation.navigate("AboutUs"),
        },
        {
          icon: "share-social-outline",
          label: "Share App",
          onPress: async () => {
            try {
              await Share.share({
                message:
                  "Check out CrackerShop — download the app: https://example.com/download",
              });
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          icon: "document-text-outline",
          label: "Download Price List (PDF)",
          onPress: () =>
            Linking.openURL("https://example.com/pricelist.pdf"),
        },
        {
          icon: "download-outline",
          label: "Download Price List (Excel)",
          onPress: () =>
            Linking.openURL("https://example.com/pricelist.xlsx"),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* HEADER BACKGROUND EXTENSION */}
        <View style={styles.headerBackground} />

        <View style={styles.contentWrapper}>
          {/* PROFILE AVATAR */}
          <ProfileAvatar />

          {/* USER INFO DETAILS */}
          <View style={styles.infoSection}>
            {user?.mobileNumber && (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={16} color="#666" />
                <Text style={styles.infoText}>{user.mobileNumber}</Text>
              </View>
            )}
            {user?.address && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.infoText} numberOfLines={2}>{user.address}</Text>
              </View>
            )}
          </View>

          {/* PROFILE OPTIONS */}
          <View style={{ flex: 1 }}>
            <ProfileCard sections={sections} />
          </View>

          {/* LOGOUT */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ff7f00",
  },
  backBtn: {
    marginRight: 10,
  },
  pageTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  headerBackground: {
    height: 60,
    backgroundColor: "#ff7f00",
  },
  contentWrapper: {
    marginTop: -30,
    flex: 1,
  },
  infoSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 15,
    borderRadius: 14,
    marginTop: -10,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#444',
    flex: 1,
  },

  logoutBtn: {
    backgroundColor: "#ff7f00",
    marginHorizontal: 50,
    marginTop: 20,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
