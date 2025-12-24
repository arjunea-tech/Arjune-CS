import { ScrollView, Text, View } from 'react-native'
import categoriesData from '../testing/CategoryTestData.json'
import Categories from './Categories'

export default function ShopByCategory({ data = categoriesData, activeCategory = 'all', onSelectCategory = () => {} }) {
  // Ensure we always have an "All" category to select
  const allCategory = { id: 'all', name: 'All' }

  const list = Array.isArray(data) && data.length > 0 ? [allCategory, ...data] : [allCategory]

  return (
    <View className="mt-6 px-4">
      <Text className="text-xl font-bold">Shop By Category</Text>

      <View className="mt-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingHorizontal: 4 }}
        >
          {list.map((item) => {
            const img = item.image || (Array.isArray(data) ? data.find(d => d.id === item.id)?.image : undefined)
            return (
              <Categories
                key={`${item.id}-${activeCategory === item.id ? 'active' : 'idle'}`}
                item={item}
                image={img}
                isAll={item.id === 'all'}
                isActive={activeCategory === item.id}
                onPress={() => onSelectCategory(item.id)}
              />
            )
          })}
        </ScrollView>
      </View>
    </View>
  )
}
