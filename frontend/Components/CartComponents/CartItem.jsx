import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../ui/theme';
import { useCart } from './CartContext';

export default function CartItem({ item }) {
  const { product, quantity } = item;
  const { setQuantity, removeItem } = useCart();

  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <View style={styles.left}>
          {product?.image ? (
            <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, { backgroundColor: THEME.colors.muted, alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={{ color: '#777' }}>No image</Text>
            </View>
          )}
        </View>

        <View style={styles.center}>
          <Text numberOfLines={2} style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>
            ₹{(product.discountPrice && product.discountPrice < product.price)
              ? product.discountPrice.toFixed(2)
              : (product.price || 0).toFixed(2)}
          </Text>
        </View>

        <View style={styles.right}>
          <View style={styles.qtyRow}>
            <TouchableOpacity accessibilityLabel="Decrease quantity" onPress={() => setQuantity(product._id || product.id, Math.max(0, quantity - 1))} style={styles.qtyBtn}>
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{quantity}</Text>
            <TouchableOpacity accessibilityLabel="Increase quantity" onPress={() => setQuantity(product._id || product.id, quantity + 1)} style={styles.qtyBtn}>
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity accessibilityLabel="Remove item" onPress={() => removeItem(product._id || product.id)} style={styles.removeBtn}>
            <Ionicons name="trash-outline" size={18} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: THEME.spacing.md, marginTop: THEME.spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radii.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.soft
  },
  left: { width: 72, marginRight: THEME.spacing.md },
  image: { width: 64, height: 64, borderRadius: THEME.radii.md },
  center: { flex: 1 },
  title: { fontSize: THEME.fonts.body, fontWeight: '700', color: THEME.colors.text },
  price: { color: THEME.colors.subtext, marginTop: 6 },
  right: { alignItems: 'center' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: THEME.colors.border, borderRadius: THEME.radii.sm, overflow: 'hidden' },
  qtyBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: THEME.colors.muted },
  qtyText: { fontSize: THEME.fonts.subtitle },
  qty: { minWidth: 26, textAlign: 'center', paddingHorizontal: 8 },
  removeBtn: { marginTop: THEME.spacing.sm }
});