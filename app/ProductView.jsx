import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../Components/ui/Button';
import { THEME } from '../Components/ui/theme';
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

        <View style={styles.buyBtnContainer}>
          <Button style={styles.buyBtn} onPress={() => {}}>
            <MaterialCommunityIcons name="shopping" size={18} color="#fff" />
            <Text style={styles.buyBtnText}>Buy Now</Text>
          </Button>
        </View>
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
  safeArea: { flex: 1, backgroundColor: THEME.colors.primary },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
  },
  headerTitle: { color: '#fff', fontSize: THEME.fonts.title, fontWeight: 'bold' },
  backButton: { padding: 5 },
  heroContainer: { backgroundColor: THEME.colors.primary, paddingBottom: 56, alignItems: 'center', zIndex: 1 },
  imageCard: {
    width: '90%',
    height: 260,
    backgroundColor: '#000',
    borderRadius: THEME.radii.lg,
    overflow: 'hidden',
    ...THEME.shadows.medium
  },
  fullImage: { width: '100%', height: '100%' },
  priceBadge: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    minWidth: 80,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBadgeText: { textAlign: 'center', color: '#000', fontWeight: '700', fontSize: THEME.fonts.subtitle },
  buyBtnContainer: { position: 'absolute', bottom: 22, zIndex: 10 },
  buyBtn: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: THEME.radii.round,
    alignItems: 'center'
  },
  buyBtnText: { color: '#fff', fontWeight: '700', fontSize: THEME.fonts.body, marginLeft: 10 },
  detailsPanel: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: THEME.radii.lg,
    borderTopRightRadius: THEME.radii.lg,
    marginTop: -25,
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.lg,
  },
  title: { fontSize: 22, fontWeight: '800', color: THEME.colors.text },
  description: { fontSize: THEME.fonts.body, color: THEME.colors.subtext, marginTop: 10, lineHeight: 24 },
  sectionTitle: { fontSize: THEME.fonts.title, fontWeight: '700', marginTop: THEME.spacing.lg, color: THEME.colors.text },
  videoContainer: {
    marginTop: 15,
    height: 180,
    borderRadius: THEME.radii.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surface,
  },
  playIconBg: {
    width: 80,
    height: 55,
    backgroundColor: THEME.colors.primary,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});