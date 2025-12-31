import { useEffect, useMemo, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { categoriesAPI, productsAPI } from '../../Components/api'
import BannerCarousel from '../../Components/HomeComponents/BannerCarousel'
import BestSellingProducts from '../../Components/HomeComponents/BestSellingProducts'
import FilterChips from '../../Components/HomeComponents/FilterChips'
import HomeHeader from '../../Components/HomeComponents/HomeHeader'
import Products from '../../Components/HomeComponents/Products'
import ShopByCategory from '../../Components/HomeComponents/ShopByCategory'
import categoriesData from '../../testing/CategoryTestData.json'
import productsData from '../../testing/ProductsTestData.json'

export default function Home() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeFilter, setActiveFilter] = useState('default')
  const [products, setProducts] = useState(productsData)
  const [categories, setCategories] = useState(categoriesData)
  const [loading, setLoading] = useState(false)

  // Fetch products and categories from backend
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
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mock data if API fails
      setProducts(productsData);
      setCategories(categoriesData);
    } finally {
      setLoading(false);
    }
  };

  // Compute filtered product list based on category, search and filter
  const filteredProducts = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : []

    const qRaw = (search || '').trim().toLowerCase()

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
          parsedCategory = c.id
          break
        }
      }
    }

    // If search included a category name, filter by it; else use selected category
    if (parsedCategory) {
      list = list.filter((p) => String(p.category) === String(parsedCategory))
    } else if (activeCategory && activeCategory !== 'all') {
      list = list.filter((p) => String(p.category) === String(activeCategory))
    }

    // Remove parsed tokens from textual search
    let q = qRaw
    if (priceMatch) q = q.replace(priceMatch[0], '').trim()
    if (parsedCategory) {
      const catName = (categoriesData.find((c) => c.id === parsedCategory)?.name || '').toLowerCase()
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
  }, [search, activeCategory, activeFilter, products])

  // Best selling filtered by category and search
  const bestSelling = useMemo(() => filteredProducts.filter((p) => p.bestSelling), [filteredProducts])

  // Sync activeCategory with parsed category in search (when applicable)
  useEffect(() => {
    const qRaw = (search || '').trim().toLowerCase()
    let parsedCategory = null
    if (qRaw.length > 0) {
      for (const c of categories) {
        if (qRaw.includes((c.name || '').toLowerCase())) {
          parsedCategory = c.id
          break
        }
      }
    }

    if (parsedCategory) setActiveCategory(parsedCategory)
    else if (qRaw.length === 0) setActiveCategory('all')
  }, [search, categories])

  return (
    <View className="flex-1 bg-white">
      <HomeHeader searchValue={search} onChangeText={setSearch} />

      {/* Vertical Scroll */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {search.trim().length > 0 ? (
          // When searching show only products (keeps HomeHeader visible)
          <Products data={filteredProducts} onClear={() => setSearch('')} />
        ) : (
          <>
            <BannerCarousel />
            <ShopByCategory data={categories} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
            <BestSellingProducts data={bestSelling} />
            <FilterChips active={activeFilter} onChange={setActiveFilter} />
            <Products data={filteredProducts} />
          </>
        )}
      </ScrollView>
    </View>
  )
}
