import { ScrollView, Text, View } from 'react-native'
import productsData from '../../testing/ProductsTestData.json'
import Product from './Product'

export default function BestSellingProducts({ data = productsData }) {
  const list = Array.isArray(data) ? data.filter(p => p.bestSelling) : []
  if (list.length === 0) return null

  return (
    <View className="mt-6 px-4">
      <Text className="text-xl font-bold mb-4">Best Selling Products</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        style={{ paddingBottom: 4 }}
      >
        {list.map((product) => (
          <Product key={product.id} product={product} horizontal />
        ))}
      </ScrollView>
    </View>
  )
}
