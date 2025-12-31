import { Image } from 'expo-image'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { COLORS } from '../../constant/theme'
import { useCart } from '../CartComponents/CartContext'

const Product = ({ product = {}, horizontal = false }) => {
  const navigateToProductView = () => {
    if (product?.id) router.push(`/ProductView?id=${product.id}`)
    else router.push('/ProductView')
  }

  const { addItem } = useCart();
  const addToCart = (e) => {
    e?.stopPropagation?.();
    addItem(product, 1);
  }

  return (
    <TouchableOpacity
      className={`
        bg-[#f5f5f5] rounded-xl p-2
        ${horizontal ? 'w-36 mr-4' : 'w-[47.5%] mb-4'}
      `}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2,
      }}

      onPress={navigateToProductView}
    >
      {/* Image */}
      {product?.image ? (
        <Image
          source={{ uri: product.image }}
          style={{ width: '100%', height: 70, borderRadius: 10 }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View className="h-[70px] bg-[#ddd] rounded-lg" />
      )}

      {/* Name */}
      <Text className="mt-4 text-sm font-medium" numberOfLines={2}>
        {product?.name ?? 'Product Name'}
      </Text>

      {/* Price */}
      <Text className="text-xs text-gray-600 mt-1">
        ${product?.price?.toFixed ? product.price.toFixed(2) : (product?.price ?? '0.00')}
      </Text>

      {/* Button */}
      <TouchableOpacity className="mt-3 py-3 rounded-md items-center" style={{ backgroundColor: COLORS.primary }} onPress={() => addToCart()}>
        <Text className="text-white text-sm font-semibold">Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default React.memo(Product)


