import { Dimensions, Image, Text, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, { Pagination } from 'react-native-reanimated-carousel'
import { COLORS } from '../../constant/theme'
import banners from '../../testing/BannerTestData.json'

const { width } = Dimensions.get('window')

export default function BannerCarousel({ data = banners }) {
  const progress = useSharedValue(0)

  // If there are no banners, render a placeholder so layout remains consistent
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <View className="mt-4 px-4">
        <View
          className="h-36 rounded-2xl bg-gray-200 items-center justify-center"
          style={{ width: width - 32 }}
        >
          <Text className="text-gray-500">No banners available</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="mt-4">
      <Carousel
        width={width}
        height={140}
        autoPlay
        loop
        data={data}
        scrollAnimationDuration={3000}
        onProgressChange={(_, absoluteProgress) => {
          progress.value = absoluteProgress
        }}
        renderItem={({ item }) => (
          <View className="mx-4 h-full rounded-2xl overflow-hidden" style={{ width: width - 32 }}>
            <Image
              source={{ uri: item.image }}
              style={{ width: '100%', height: '100%', borderRadius: 16 }}
              resizeMode="cover"
            />

            {/* Overlay */}
            <View style={{ position: 'absolute', left: 12, bottom: 12 }}>
              <Text className="text-white text-lg font-bold">{item.title}</Text>
              <Text className="text-white text-sm">{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      {/* ✅ Pagination Dots */}
      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: '#D1D5DB',
        }}
        activeDotStyle={{
          backgroundColor: COLORS.primary,
        }}
        containerStyle={{
          gap: 6,
          marginTop: 10,
          alignSelf: 'center',
        }}
      />
    </View>
  )
}
