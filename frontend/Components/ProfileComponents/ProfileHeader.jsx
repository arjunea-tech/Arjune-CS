import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileHeader({ onBack = () => {} }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>PROFILE</Text>
      <View style={styles.profileDot} />
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginLeft: -200,
  },

  profileDot: {
    width: 24,
    height: 24,
  },
});