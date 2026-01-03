import { useEffect, useMemo, useState, useCallback } from 'react'
import { FlatList, View, Text, TouchableOpacity, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { categoriesAPI, productsAPI, bannersAPI } from '../../Components/api'
import BannerCarousel from '../../Components/HomeComponents/BannerCarousel'
import BestSellingProducts from '../../Components/HomeComponents/BestSellingProducts'
import FilterChips from '../../Components/HomeComponents/FilterChips'
import HomeHeader from '../../Components/HomeComponents/HomeHeader'
import Product from '../../Components/HomeComponents/Product'
import ShopByCategory from '../../Components/HomeComponents/ShopByCategory'
import categoriesData from '../../testing/CategoryTestData.json'
import productsData from '../../testing/ProductsTestData.json'
import bannerData from '../../testing/BannerTestData.json'
import ProductHorizontalList from '../../Components/HomeComponents/ProductHorizontalList'

export default function Home() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeFilter, setActiveFilter] = useState('default')
  const [products, setProducts] = useState(productsData)
  const [categories, setCategories] = useState(categoriesData)
  const [banners, setBanners] = useState(bannerData)
  const [loading, setLoading] = useState(false)

  // Debounce search input
  useEffect(() => {
    if (search === '') {
      setDebouncedSearch('')
      return
    }
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 400)
    return () => clearTimeout(handler)
  }, [search])

  // Fetch products, categories, and banners from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch products
      const productsResponse = await productsAPI.getProducts();
      if (productsResponse.success) {
        setProducts(productsResponse.data);
      }

      // Fetch categories
      const categoriesResponse = await categoriesAPI.getCategories();
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }

      // Fetch banners
      const bannersResponse = await bannersAPI.getBanners();
      if (bannersResponse.success) {
        setBanners(bannersResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mock data if API fails
      setProducts(productsData);
      setCategories(categoriesData);
      setBanners(bannerData);
    } finally {
      setLoading(false);
    }
  };

  // Compute filtered product list based on category, search and filter
  const filteredProducts = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : []

    const qRaw = (debouncedSearch || '').trim().toLowerCase()

    // Parse price (formats: "under 100", "below 100", "<100", "price:<100")
    let priceMax = null
    const priceRegex = /(?:under|below|less than|price\s*[:<]?|<|<=)\s*\$?\s*(\d+(?:\.\d+)?)/i
    const priceMatch = qRaw.match(priceRegex)
    if (priceMatch) priceMax = parseFloat(priceMatch[1])

    // Parse category by name
    let parsedCategory = null
    if (qRaw.length > 0) {
      for (const c of categories) {
        if (qRaw.includes((c.name || '').toLowerCase())) {
          parsedCategory = c._id || c.id
          break
        }
      }
    }

    // If search included a category name, filter by it; else use selected category
    const targetCategory = parsedCategory || (activeCategory !== 'all' ? activeCategory : null);

    if (targetCategory) {
      list = list.filter((p) => {
        const pCatId = typeof p.category === 'object' && p.category ? (p.category._id || p.category.id) : p.category;
        return String(pCatId) === String(targetCategory);
      });
    }

    // Remove parsed tokens from textual search
    let q = qRaw
    if (priceMatch) q = q.replace(priceMatch[0], '').trim()
    if (parsedCategory) {
      const catName = (categories.find((c) => (c._id || c.id) === parsedCategory)?.name || '').toLowerCase()
      if (catName) q = q.replace(new RegExp(catName, 'i'), '').trim()
    }

    // Text search (name/description)
    if (q.length > 0) {
      list = list.filter((p) => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q))
    }

    // Price upper bound
    if (priceMax !== null) {
      list = list.filter((p) => (p.price || 0) <= priceMax)
    }

    // Sorting based on filter
    if (activeFilter === 'az') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    } else if (activeFilter === 'low') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (activeFilter === 'high') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0))
    }

    return list
  }, [debouncedSearch, activeCategory, activeFilter, products, categories])

  // Best selling filtered by category and search
  const bestSelling = useMemo(() => filteredProducts.filter((p) => p.bestSelling), [filteredProducts])

  // Featured Products
  const featuredProducts = useMemo(() => filteredProducts.filter((p) => p.isFeatured), [filteredProducts])

  // Diwali Specials
  const diwaliSpecials = useMemo(() => filteredProducts.filter((p) => p.isDiwaliSpecial), [filteredProducts])

  // New Arrival Products (Last 10 added)
  const newArrivals = useMemo(() => {
    return [...filteredProducts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
  }, [filteredProducts])

  // Sync activeCategory with parsed category in search (when applicable)
  useEffect(() => {
    const qRaw = (search || '').trim().toLowerCase()
    let parsedCategory = null
    if (qRaw.length > 0) {
      for (const c of categories) {
        if (qRaw.includes((c.name || '').toLowerCase())) {
          parsedCategory = c._id || c.id
          break
        }
      }
    }

    if (parsedCategory) setActiveCategory(parsedCategory)
  }, [debouncedSearch, categories])

  const renderProductItem = useCallback(({ item }) => (
    <Product product={item} />
  ), [])

  return (
    <View className="flex-1 bg-white">
      <HomeHeader searchValue={search} onChangeText={setSearch} />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) => (item._id || item.id || index).toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={renderProductItem}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        ListHeaderComponent={
          debouncedSearch.trim().length > 0 ? null : (
            <View>
              <BannerCarousel data={banners} />
              <ShopByCategory data={categories} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

              <ProductHorizontalList title="Featured Products" data={featuredProducts} />
              <ProductHorizontalList title="Diwali Specials" data={diwaliSpecials} />
              <ProductHorizontalList title="New Arrival Products" data={newArrivals} />

              <BestSellingProducts data={bestSelling} />
              <FilterChips active={activeFilter} onChange={setActiveFilter} />
              <Text className="text-xl font-bold px-4 mt-6 mb-4">Products</Text>
            </View>
          )
        }
        ListEmptyComponent={
          debouncedSearch.trim().length > 0 ? (
            <View className="w-full items-center py-12 px-4">
              <Ionicons name="close-circle" size={64} color="#FFA500" />
              <Text className="text-2xl font-bold mt-6 text-center">No products found</Text>
              <Text className="text-gray-500 mt-2 text-center">Try a different search or clear filters.</Text>
              <TouchableOpacity
                onPress={() => setSearch('')}
                className="mt-4 px-4 py-2 rounded-md bg-orange-500"
                activeOpacity={0.85}
              >
                <Text className="text-white font-semibold">Clear search</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  )
}
