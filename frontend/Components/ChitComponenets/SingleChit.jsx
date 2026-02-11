import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SingleChit({
  index,
  name = "Chit Scheme",
  amount = "₹0",
  period = "--",
  payingAmt = "--",
  bonus = "--",
  provided = "--",
  isOpen = false,
  onToggle = () => { },
  onJoin = () => { },
  onViewDetails = () => { },
}) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.row} onPress={() => onToggle(index)}>
        <Text style={styles.label}>Chit name :</Text>
        <Text style={styles.value}>{name}</Text>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={18} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.joinBtn} onPress={() => onJoin(index)}>
        <Ionicons name="people-outline" size={18} color="#fff" />
        <Text style={styles.joinText}>Join Chit</Text>
      </TouchableOpacity>

      {isOpen && (
        <>
          <Text style={styles.info}>Amount: {amount}</Text>
          <Text style={styles.info}>Chit Period: {period}</Text>
          <Text style={styles.info}>Paying Amt: {payingAmt}</Text>
          <Text style={styles.info}>Bonus: {bonus}</Text>
          <Text style={styles.info}>Provided: {provided}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    fontSize: 14,
    color: "#333",
  },

  value: {
    flex: 1,
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },

  joinBtn: {
    backgroundColor: "#ff7f00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 12,
  },

  joinText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },

  info: {
    fontSize: 13,
    color: "#333",
    marginTop: 4,
  },
});