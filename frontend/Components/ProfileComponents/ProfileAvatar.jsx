import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../utils/AuthContext";

export default function ProfileAvatar() {
  const { user } = useAuth();

  return (
    <View style={styles.avatarWrapper}>
      <View style={styles.avatar}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
        ) : (
          <Ionicons name="person" size={40} color="#666" />
        )}
      </View>
      <Text style={styles.userName}>{user?.name || "Welcome!"}</Text>
      <Text style={styles.userEmail}>{user?.email || ""}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    overflow: 'hidden'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  userEmail: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
});