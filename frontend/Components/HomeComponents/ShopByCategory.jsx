import { useCallback, useMemo } from 'react'
import { FlatList, Text, View } from 'react-native'
import categoriesData from '../../testing/CategoryTestData.json'
import Categories from './Categories'

const allCategory = { _id: 'all', id: 'all', name: 'All' }

export default function ShopByCategory({ data = categoriesData, activeCategory = 'all', onSelectCategory = () => { } }) {
  const list = useMemo(() => {
    return Array.isArray(data) && data.length > 0 ? [allCategory, ...data] : [allCategory]
  }, [data])

  const renderItem = useCallback(({ item }) => {
    const itemId = item._id || item.id;
    return (
      <Categories
        item={item}
        image={item.image}
        isAll={itemId === 'all'}
        isActive={activeCategory === itemId}
        onPress={() => onSelectCategory(itemId)}
      />
    )
  }, [activeCategory, onSelectCategory])

  return (
    <View className="mt-6 px-4">
      <Text className="text-xl font-bold">Shop By Category</Text>

      <View className="mt-4">
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item._id || item.id || index}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingHorizontal: 4 }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={false}
        />
      </View>
    </View>
  )
}
