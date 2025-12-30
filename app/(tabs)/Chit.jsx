import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChitHeader from "../../Components/ChitComponenets/ChitHeader";
import SingleChit from "../../Components/ChitComponenets/SingleChit";

export default function Chit() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigation = useNavigation();

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* 🔙 Header like Orders */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Chit Schemes</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {[
          {
            name: "300 Chit Scheme",
            amount: "₹300",
            period: "10 Months",
            payingAmt: "₹30 / Month",
            bonus: "₹50",
            provided: "Monthly",
          },
          {
            name: "500 Chit Scheme",
            amount: "₹500",
            period: "10 Months",
            payingAmt: "₹50 / Month",
            bonus: "₹80",
            provided: "Monthly",
          },
          {
            name: "1000 Chit Scheme",
            amount: "₹1000",
            period: "10 Months",
            payingAmt: "₹100 / Month",
            bonus: "₹150",
            provided: "Monthly",
          },
        ].map((plan, i) => (
          <SingleChit
            key={i}
            index={i}
            name={plan.name}
            amount={plan.amount}
            period={plan.period}
            payingAmt={plan.payingAmt}
            bonus={plan.bonus}
            provided={plan.provided}
            isOpen={openIndex === i}
            onToggle={toggle}
            onJoin={() => navigation.navigate("Profile")}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff7f00",
  },

  /* Header like Orders */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backBtn: {
    marginRight: 10,
  },
  pageTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },

  /* (Kept for SingleChit usage if needed) */
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
    backgroundColor: "#f50000ff",
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
