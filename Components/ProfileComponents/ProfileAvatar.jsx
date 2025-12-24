import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export default function ProfileAvatar() {
  return (
    <View style={styles.avatarWrapper}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={40} color="#000" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});