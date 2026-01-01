import { Image, StyleSheet, Text, View } from 'react-native';
// import productsData from '../../testing/ProductsTestData.json';
import { THEME } from '../ui/theme';
import { formatCurrency } from '../utils/format';

export default function OrderItem({ item }) {
  const total = (item.price || 0) * item.qty;

  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <Image source={item.image ? { uri: item.image } : null} style={styles.image} />
        <View style={{ flex: 1, paddingLeft: 12 }}>
          <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.meta}>Qty: {item.qty}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.price}>${formatCurrency(total)}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: THEME.spacing.md, marginTop: THEME.spacing.sm },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.colors.surface, borderRadius: THEME.radii.md, padding: THEME.spacing.md, ...THEME.shadows.soft },
  image: { width: 64, height: 64, borderRadius: THEME.radii.sm, backgroundColor: THEME.colors.muted },
  title: { fontWeight: '700', fontSize: THEME.fonts.subtitle, color: THEME.colors.text },
  meta: { color: THEME.colors.subtext, marginTop: 6 },
  right: { marginLeft: 12, alignItems: 'flex-end' },
  price: { fontWeight: '700', color: THEME.colors.text }
})