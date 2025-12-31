import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChitHeader() {
  const navigation = useNavigation();
  return (
      <View style={styles.header}>
        {/* Header */}
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
          <Text style={styles.headerTitle}>CHIT SCHEME</Text>
        </TouchableOpacity>
        <View style={{ width: 22 }} />
      </View>
  )
}

const styles = StyleSheet.create({
   header: {
    height: 100,
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingTop: 44,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginTop: -24,
    marginLeft: 25,
  },
});