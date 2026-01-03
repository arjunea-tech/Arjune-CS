import { Image } from 'expo-image'
import React, { useState } from 'react'
import { Dimensions, Text, View } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import { COLORS } from '../../constant/theme'
import banners from '../../testing/BannerTestData.json'
import { resolveImageUrl } from '../utils/imageUrl'

const { width } = Dimensions.get('window')

const BannerCarousel = ({ data = banners }) => {
  const [activeIndex, setActiveIndex] = useState(0)

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
        scrollAnimationDuration={1000}
        autoPlayInterval={3000}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <View className="mx-4 h-full rounded-2xl overflow-hidden" style={{ width: width - 32 }}>
            <Image
              source={{ uri: resolveImageUrl(item.image) }}
              style={{ width: '100%', height: '100%', borderRadius: 16 }}
              contentFit="cover"
              transition={200}
            />

            {/* Overlay */}
            <View style={{ position: 'absolute', left: 12, bottom: 12 }}>
              <Text className="text-white text-lg font-bold">{item.title}</Text>
              <Text className="text-white text-sm">{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      {/* ✅ Pagination Dots (Simple state-based implementation) */}
      <View className="flex-row justify-center gap-1.5 mt-2">
        {data.map((_, index) => (
          <View
            key={`dot-${index}`}
            style={{
              width: index === activeIndex ? 16 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: index === activeIndex ? COLORS.primary : '#D1D5DB',
            }}
          />
        ))}
      </View>
    </View>
  )
}

export default React.memo(BannerCarousel)
