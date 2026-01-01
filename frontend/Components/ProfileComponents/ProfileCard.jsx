import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function Item({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={18} />
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ProfileCard({ sections = [] }) {
  return (
    <View style={styles.card}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
        indicatorStyle="black"
        contentContainerStyle={{ paddingBottom: 12 }}
        style={styles.cardScroll}
      >
        {sections.map((section, i) => (
          <View key={i}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((it, j) => (
              <Item key={j} icon={it.icon} label={it.label} onPress={it.onPress} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
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
});