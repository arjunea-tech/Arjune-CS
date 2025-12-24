import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constant/theme';
import productsData from '../testing/ProductsTestData.json';

export default function ProductView() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Read id and load product from test data
  const id = params?.id;
  const product = productsData.find(p => String(p.id) === String(id));

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Not Found</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={{ color: '#fff', fontSize: 18, marginBottom: 10 }}>Product not found.</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}>
            <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* FIXED HERO SECTION */}
      <View style={styles.heroContainer}>
        <View style={styles.imageCard}>
          {product?.image ? (
            <Image source={{ uri: product.image }} style={styles.fullImage} resizeMode="cover" />
          ) : (
            <View style={[styles.fullImage, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#ddd' }]}>
              <Text style={{ color: '#777' }}>No image</Text>
            </View>
          )}

          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>${product.price?.toFixed(2) ?? '0.00'}</Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.buyBtnContainer}>
          <View style={styles.buyBtn}>
            <MaterialCommunityIcons name="shopping" size={20} color="#fff" />
            <Text style={styles.buyBtnText}>Buy Now</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* SCROLLABLE PANEL */}
      <View style={styles.detailsPanel}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.sectionTitle}>Video</Text>

          <TouchableOpacity style={styles.videoContainer}>
            <View style={styles.playIconBg}>
              <MaterialCommunityIcons name="play" size={40} color="#fff" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primary },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  backButton: { padding: 5 },
  heroContainer: { backgroundColor: COLORS.primary, paddingBottom: 50, alignItems: 'center', zIndex: 1 },
  imageCard: {
    width: '90%',
    height: 240,
    backgroundColor: '#000',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  fullImage: { width: '100%', height: '100%' },
  priceBadge: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBadgeText: { textAlign: 'center', color: '#000', fontWeight: 'bold', fontSize: 13 },
  buyBtnContainer: { position: 'absolute', bottom: 25, zIndex: 10 },
  buyBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 35,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
  },
  buyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginLeft: 10 },
  detailsPanel: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -25,
    paddingHorizontal: 25,
    paddingTop: 45,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  description: { fontSize: 16, color: '#444', marginTop: 10, lineHeight: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 30, color: '#000' },
  videoContainer: {
    marginTop: 15,
    height: 180,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  playIconBg: {
    width: 80,
    height: 55,
    backgroundColor: '#FF4444',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});