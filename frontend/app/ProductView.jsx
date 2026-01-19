import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { THEME } from '../Components/ui/theme';
import { productsAPI } from '../Components/api';
import { resolveImageUrl } from '../Components/utils/imageUrl';
import { useCart } from '../Components/CartComponents/CartContext';

export default function ProductView() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await productsAPI.getProduct(id);
      if (res.success) {
        setProduct(res.data);
        setSelectedImage(resolveImageUrl(res.data.image));
      }
    } catch (e) {
      console.log('Error fetching product:', e);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  if (!product) {
    // Fallback: Show loading or error, or try finding in global store if implemented.
    // For this user request, we assume data propagation works via list. 
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details</Text>
          <View style={{ width: 28 }} />
        </View>
        <View className="flex-1 items-center justify-center">
          <Text>Product not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const originalPrice = product.price || 0;
  const hasDiscount = product.discountPrice && product.discountPrice < originalPrice;
  const currentPrice = hasDiscount ? product.discountPrice : originalPrice;
  // Calculate percentage logic for display
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

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
          <Image source={{ uri: selectedImage }} style={styles.fullImage} />

          {/* ROUND PRICE BADGE */}
          <View style={styles.priceBadge}>
            <Text style={styles.discountedPrice}>₹{currentPrice.toFixed(0)}</Text>
            {hasDiscount && (
              <>
                <Text style={styles.originalPrice}>₹{originalPrice}</Text>
                <Text style={styles.discountText}>{discountPercent}% OFF</Text>
              </>
            )}
          </View>
        </View>

        {/* Gallery Thumbnails */}
        {productImages.length > 1 && (
          <View style={styles.thumbnailContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {productImages.map((img, index) => {
                const resolvedImg = resolveImageUrl(img);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedImage(resolvedImg)}
                    style={[
                      styles.thumbnail,
                      selectedImage === resolvedImg && styles.activeThumbnail
                    ]}
                  >
                    <Image source={{ uri: resolvedImg }} style={styles.thumbnailImage} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* BUTTONS (MOVED UP) */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.whiteBtn}
            onPress={() => addItem(product, 1)}
          >
            <MaterialCommunityIcons name="cart-outline" size={18} color="#ff7f00" />
            <Text style={styles.btnText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.whiteBtn}
            onPress={() => {
              addItem(product, 1);
              router.push('/Checkout');
            }}
          >
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
    paddingBottom: 10
  },

  imageCard: {
    width: '90%',
    height: 260,
    backgroundColor: '#000',
    borderRadius: 50,
    overflow: 'hidden'
  },

  fullImage: {
    width: '100%',
    height: '100%'
  },

  priceBadge: {
    position: 'absolute',
    bottom: -15,
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

  /* 🔼 BUTTONS MOVED UP HERE */
  buttonRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 20   // ⬅️ reduced from 50
  },

  whiteBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
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
    marginTop: 0,
    borderRadius: 22,
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
  },
  thumbnailContainer: {
    flexDirection: 'row',
    marginTop: 35,
    paddingHorizontal: 16
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden'
  },
  activeThumbnail: {
    borderColor: THEME.colors.primary,
    borderWidth: 2
  },
  thumbnailImage: {
    width: '100%',
    height: '100%'
  }
});
