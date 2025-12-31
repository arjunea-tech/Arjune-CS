import { useNavigation } from "@react-navigation/native";
import {
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProfileAvatar from "../../Components/ProfileComponents/ProfileAvatar";
import ProfileCard from "../../Components/ProfileComponents/ProfileCard";

export default function Profile() {
  const navigation = useNavigation();

  const sections = [
    {
      title: "My Chit",
      items: [
        {
          icon: "wallet-outline",
          label: "Chit Balance",
          onPress: () => navigation.navigate("Chit"),
        },
      ],
    },

    {
      title: "Account Settings",
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

    /* ✅ APP + ABOUT US DETAILS */
    {
      title: "App",
      items: [
        {
          icon: "information-circle-outline",
          label: "About CrackerShop",
          message: "Quality crackers at best price",
        },
        {
          icon: "call-outline",
          label: "Mobile Number",
          message: "+91 98765 43210",
          onPress: () => Linking.openURL("tel:+919876543210"),
        },
        {
          icon: "home-outline",
          label: "Address",
          message: "No.12, Main Road, Sivakasi",
        },
        {
          icon: "business-outline",
          label: "District",
          message: "Virudhunagar",
        },
        {
          icon: "map-outline",
          label: "State",
          message: "Tamil Nadu",
        },
        {
          icon: "mail-outline",
          label: "Pincode",
          message: "626123",
        },
        {
          icon: "navigate-outline",
          label: "View Location",
          onPress: () =>
            Linking.openURL(
              "https://www.google.com/maps/search/?api=1&query=Sivakasi+Tamil+Nadu"
            ),
        },

        /* SHARE */
        {
          icon: "share-social-outline",
          label: "Share App",
          onPress: async () => {
            try {
              await Share.share({
                message:
                  "Check out CrackerShop — download the app: https://example.com/download",
              });
            } catch (err) {
              console.log(err);
            }
          },
        },

        /* DOWNLOADS */
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

      <ProfileAvatar />

      <View style={{ flex: 1 }}>
        <ProfileCard sections={sections} />
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => console.log("logout pressed")}
      >
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

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
