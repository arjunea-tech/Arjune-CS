import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { THEME } from '../Components/ui/theme';
import productsData from '../testing/ProductsTestData.json';

export default function ProductView() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const id = params?.id;
  const product = productsData.find(p => String(p.id) === String(id));

  if (!product) return null;

  const originalPrice = product.price;
  const discount = 5;
  const discountedPrice = originalPrice - (originalPrice * discount) / 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* IMAGE + PRICE */}
      <View style={styles.heroContainer}>
        <View style={styles.imageCard}>
          <Image source={{ uri: product.image }} style={styles.fullImage} />

          {/* ROUND PRICE BADGE */}
          <View style={styles.priceBadge}>
            <Text style={styles.discountedPrice}>₹{discountedPrice.toFixed(0)}</Text>
            <Text style={styles.originalPrice}>₹{originalPrice}</Text>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.whiteBtn}>
            <MaterialCommunityIcons name="cart-outline" size={18} color="#ff7f00" />
            <Text style={styles.btnText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.whiteBtn}>
            <MaterialCommunityIcons name="flash" size={18} color="#ff7f00" />
            <Text style={styles.btnText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* DETAILS */}
      <View style={styles.detailsPanel}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.sectionTitle}>Video</Text>

          <View style={styles.videoContainer}>
            <MaterialCommunityIcons name="play" size={40} color="#ff7f00" />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.primary
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },

  heroContainer: {
    alignItems: 'center',
    paddingBottom: 20
  },

  imageCard: {
    width: '90%',
    height: 260,
    backgroundColor: '#000',
    borderRadius: 20,
    overflow: 'hidden'
  },

  fullImage: {
    width: '100%',
    height: '100%'
  },

  priceBadge: {
    position: 'absolute',
    bottom: -35,
    alignSelf: 'center',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6
  },

  discountedPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000'
  },

  originalPrice: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through'
  },

  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ff7f00'
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 50
  },

  whiteBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 4
  },

  btnText: {
    marginLeft: 8,
    color: '#ff7f00',
    fontWeight: '700'
  },

  detailsPanel: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginTop: -20,
    padding: 16
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000'
  },

  description: {
    fontSize: 15,
    color: '#444',
    marginTop: 8,
    lineHeight: 22
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20
  },

  videoContainer: {
    marginTop: 15,
    height: 180,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#ff7f00',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
