import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { COLORS } from '../../constant/theme'
import { useCart } from '../CartComponents/CartContext'
import { resolveImageUrl } from '../utils/imageUrl'

const Product = ({ product = {}, horizontal = false }) => {
  const router = useRouter();
  const navigateToProductView = () => {
    const id = product._id || product.id;
    if (id) router.push(`/ProductView?id=${id}`)
    else router.push('/ProductView')
  }

  const { addItem } = useCart();
  const addToCart = (e) => {
    e?.stopPropagation?.();
    addItem(product, 1);
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

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
        <View>
          <Image
            source={{ uri: resolveImageUrl(product.image) }}
            style={{ width: '100%', height: 70, borderRadius: 10 }}
            contentFit="cover"
            transition={200}
          />
          {product.isDiwaliSpecial && (
            <View
              className="absolute top-1 right-1 bg-red-600 px-1.5 py-0.5 rounded-md border border-white"
              style={{ elevation: 2 }}
            >
              <Text className="text-white text-[8px] font-bold">🪔 SPECIAL</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={{ width: '100%', height: 70, borderRadius: 10, backgroundColor: '#f3f4f6' }} />
      )}

      {/* Name */}
      <Text className="mt-4 text-sm font-medium" numberOfLines={2}>
        {product?.name ?? 'Product Name'}
      </Text>

      {/* Price */}
      <View className="mt-1 flex-row items-center flex-wrap">
        {hasDiscount ? (
          <>
            <Text className="text-xs text-gray-500 line-through mr-2">
              ₹{product.price?.toFixed(2)}
            </Text>
            <Text className="text-sm font-semibold text-orange-500">
              ₹{product.discountPrice?.toFixed(2)}
            </Text>
          </>
        ) : (
          <Text className="text-sm font-semibold text-gray-800">
            ₹{product?.price?.toFixed ? product.price.toFixed(2) : (product?.price ?? '0.00')}
          </Text>
        )}
      </View>

      {/* Button */}
      <TouchableOpacity className="mt-3 py-3 rounded-md items-center" style={{ backgroundColor: COLORS.primary }} onPress={addToCart}>
        <Text className="text-white text-sm font-semibold">Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default React.memo(Product)


