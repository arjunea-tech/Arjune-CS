import { Image, Text, TouchableOpacity, View } from 'react-native'

export default function Categories({ item = {}, image, isAll = false, isActive = false, onPress = () => {} }) {
  const img = image || (item && typeof item.image === 'string' ? item.image : undefined)
  const hasImage = img && typeof img === 'string' && img.trim().length > 0

  // Dev-only debug to help trace disappearing images
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    try {
      // eslint-disable-next-line no-console
      console.log(`Categories render -> id:${item.id} name:${item.name} img:${!!img} isActive:${isActive}`)
    } catch (e) {}
  }

  return (
    <TouchableOpacity
      className="items-center mr-2 mt-2"
      onPress={onPress}
      activeOpacity={0.85}
      style={isActive ? { transform: [{ scale: 1.03 }] } : undefined}
    >
      <View
        className={`w-20 h-20 rounded-3xl bg-gray-200 overflow-hidden items-center justify-center ${isActive ? 'border-2 border-orange-500' : ''}`}
        style={isActive ? { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 8, elevation: 6 } : undefined}
      >
        {isAll ? (
          <View className="w-full h-full bg-white items-center justify-center">
            <Text className="text-base font-bold text-gray-700">All</Text>
          </View>
        ) : (
          <Image
            source={hasImage ? { uri: img } : require('../../assets/images/icon.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        )}
      </View>

      <Text className="text-sm mt-2 w-20 text-center" numberOfLines={1}>
        {isAll ? 'All' : item.name}
      </Text>
    </TouchableOpacity>
  )
}