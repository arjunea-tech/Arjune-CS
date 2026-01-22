import { memo } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { resolveImageUrl } from '../utils/imageUrl'

const Categories = memo(({ item = {}, image, isAll = false, isActive = false, onPress = () => { } }) => {
  const imgString = image || (item && typeof item.image === 'string' ? item.image : undefined)
  const source = isAll || !imgString
    ? null
    : (imgString ? { uri: resolveImageUrl(imgString) } : null)

  return (
    <TouchableOpacity
      className="items-center mr-2 mt-2"
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View
        className={`w-20 h-20 rounded-3xl bg-gray-200 overflow-hidden items-center justify-center border-2 ${isActive ? 'border-orange-500' : 'border-transparent'}`}
      >
        {isAll ? (
          <View className="w-full h-full bg-white items-center justify-center">
            <Text className="text-base font-bold text-gray-700">All</Text>
          </View>
        ) : source ? (
          <Image
            source={source}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            fadeDuration={0}
          />
        ) : (
          <View className="w-full h-full bg-orange-50 items-center justify-center">
            <Text className="text-2xl font-bold text-orange-400">
              {item.name ? item.name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        )}
      </View>

      <Text className={`text-sm mt-2 w-20 text-center ${isActive ? 'font-bold text-orange-500' : 'text-gray-600'}`} numberOfLines={1}>
        {isAll ? 'All' : item.name}
      </Text>
    </TouchableOpacity>
  )
})

export default Categories