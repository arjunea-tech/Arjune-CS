import { FlatList, Text, View } from 'react-native'
import productsData from '../../testing/ProductsTestData.json'
import Product from './Product'

export default function BestSellingProducts({ data = productsData }) {
  const list = Array.isArray(data) ? data.filter(p => p.bestSelling) : []

  const renderItem = ({ item }) => (
    <Product product={item} horizontal />
  )

  if (list.length === 0) return null

  return (
    <View className="mt-6 px-4">
      <Text className="text-xl font-bold mb-4">Best Selling Products</Text>

      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item) => (item._id || item.id || '').toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        style={{ paddingBottom: 4 }}
      />
    </View>
  )
}
