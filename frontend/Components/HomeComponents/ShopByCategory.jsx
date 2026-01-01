import { FlatList, Text, View } from 'react-native'
import categoriesData from '../../testing/CategoryTestData.json'
import Categories from './Categories'

export default function ShopByCategory({ data = categoriesData, activeCategory = 'all', onSelectCategory = () => { } }) {
  // Ensure we always have an "All" category to select
  const allCategory = { _id: 'all', id: 'all', name: 'All' }

  const list = Array.isArray(data) && data.length > 0 ? [allCategory, ...data] : [allCategory]

  const renderItem = ({ item }) => {
    // Prefer _id, fallback to id
    const itemId = item._id || item.id;
    const img = item.image || (Array.isArray(data) ? data.find(d => (d._id || d.id) === itemId)?.image : undefined)
    return (
      <Categories
        item={item}
        image={img}
        isAll={itemId === 'all'}
        isActive={activeCategory === itemId}
        onPress={() => onSelectCategory(itemId)}
      />
    )
  }

  return (
    <View className="mt-6 px-4">
      <Text className="text-xl font-bold">Shop By Category</Text>

      <View className="mt-4">
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item) => (item._id || item.id || '').toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingHorizontal: 4 }}
        />
      </View>
    </View>
  )
}
