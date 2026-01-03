import React from 'react'
import { FlatList, Text, View } from 'react-native'
import productsData from '../../testing/ProductsTestData.json'
import Product from './Product'

const BestSellingProducts = ({ data = productsData }) => {
  const list = React.useMemo(() => (Array.isArray(data) ? data.filter(p => p.bestSelling) : []), [data])

  const renderItem = React.useCallback(({ item }) => (
    <Product product={item} horizontal />
  ), [])

  const keyExtractor = React.useCallback((item) => (item._id || item.id || '').toString(), [])

  if (list.length === 0) return null

  return (
    <View className="mt-6 px-4">
      <Text className="text-xl font-bold mb-4">Best Selling Products</Text>

      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        style={{ paddingBottom: 4 }}
      />
    </View>
  )
}

export default React.memo(BestSellingProducts)
