import { useNavigation } from "@react-navigation/native";
import { Linking, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfileAvatar from "../../Components/ProfileComponents/ProfileAvatar";
import ProfileCard from "../../Components/ProfileComponents/ProfileCard";
import ProfileHeader from "../../Components/ProfileComponents/ProfileHeader";

export default function Profile() {
  const navigation = useNavigation();
  const sections = [
    {
      title: 'My Shopping',
      items: [
        { icon: 'cube-outline', label: 'My orders', onPress: () => navigation.navigate('Orders') },
      ],
    },
    {
      title: 'My Chit',
      items: [
        { icon: 'wallet-outline', label: 'Chit Balance', onPress: () => navigation.navigate('Chit') },
      ],
    },
    {
      title: 'Account Settings',
      items: [
        { icon: 'create-outline', label: 'Edit Profile', onPress: () => navigation.navigate('EditProfile') },
        { icon: 'location-outline', label: 'Saved Address', onPress: () => navigation.navigate('SavedAddress') },
        { icon: 'card-outline', label: 'Payment Method', onPress: () => navigation.navigate('Payment') },
        { icon: 'settings-outline', label: 'Settings', onPress: () => navigation.navigate('Settings') },
      ],
    },
    {
      title: 'App',
      items: [
        {
          icon: 'share-social-outline',
          label: 'Share App',
          onPress: async () => {
            try {
              await Share.share({ message: 'Check out CrackerShop — download the app: https://example.com/download' });
            } catch (err) {
              console.log(err);
            }
          },
        },
        { icon: 'document-text-outline', label: 'Download Price List (PDF)', onPress: () => Linking.openURL('https://example.com/pricelist.pdf') },
        { icon: 'download-outline', label: 'Download Price List (Excel)', onPress: () => Linking.openURL('https://example.com/pricelist.xlsx') },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <ProfileHeader onBack={() => navigation.goBack()} />

      <ProfileAvatar />

      <View style={{ flex: 1 }}>
        <ProfileCard sections={sections} />
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => console.log("logout pressed")}
        className="mb-5"
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

  /* HEADER */
  header: {
    height: 110,
    backgroundColor: "#ff7f00",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: -200
  },

  profileDot: {
    width: 24,
    height: 24,
  },

  avatarWrapper: {
    alignItems: "center",
    marginTop: -40,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  /* CARD */
  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 46,
    borderRadius: 14,
  },

  sectionTitle: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  itemText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#222",
  },

  cardScroll: {
    maxHeight: 380,
  },

  /* LOGOUT */
  logoutBtn: {
    backgroundColor: "#ff7f00",
    marginHorizontal: 50,
    marginTop: 20,
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
