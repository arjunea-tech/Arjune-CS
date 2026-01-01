import { Ionicons } from '@expo/vector-icons'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import productsData from '../../testing/ProductsTestData.json'
import Product from './Product'

export default function Products({ data = productsData, onClear = () => { } }) {
  const list = Array.isArray(data) ? data : []

  const renderItem = ({ item }) => (
    <Product product={item} />
  )

  return (
    <View className="mt-6 px-4">
      <Text className="text-xl font-bold mb-4">Products</Text>

      {list.length === 0 ? (
        <View className="w-full items-center py-12">
          <Ionicons name="close-circle" size={64} color="#FFA500" />
          <Text className="text-2xl font-bold mt-6">No products found</Text>
          <Text className="text-gray-500 mt-2 text-center">Try a different search or clear filters.</Text>
          <TouchableOpacity
            onPress={onClear}
            className="mt-4 px-4 py-2 rounded-md bg-orange-500"
            activeOpacity={0.85}
          >
            <Text className="text-white font-semibold">Clear search</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item) => (item._id || item.id || '').toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}
