import { FlatList, Text, View } from 'react-native'
import categoriesData from '../../testing/CategoryTestData.json'
import Categories from './Categories'

export default function ShopByCategory({ data = categoriesData, activeCategory = 'all', onSelectCategory = () => { } }) {
  // Ensure we always have an "All" category to select
  const allCategory = { id: 'all', name: 'All' }

  const list = Array.isArray(data) && data.length > 0 ? [allCategory, ...data] : [allCategory]

  const renderItem = ({ item }) => {
    const img = item.image || (Array.isArray(data) ? data.find(d => d.id === item.id)?.image : undefined)
    return (
      <Categories
        item={item}
        image={img}
        isAll={item.id === 'all'}
        isActive={activeCategory === item.id}
        onPress={() => onSelectCategory(item.id)}
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
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingHorizontal: 4 }}
        />
      </View>
    </View>
  )
}
