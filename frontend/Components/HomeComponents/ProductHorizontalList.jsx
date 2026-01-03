import React from 'react'
import { FlatList, Text, View } from 'react-native'
import Product from './Product'

const ProductHorizontalList = ({ title, data = [] }) => {
    if (!data || data.length === 0) return null

    const renderItem = React.useCallback(({ item }) => (
        <Product product={item} horizontal />
    ), [])

    const keyExtractor = React.useCallback((item) => (item._id || item.id || '').toString(), [])

    return (
        <View className="mt-6 px-4">
            <Text className="text-xl font-bold mb-4">{title}</Text>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
                style={{ paddingBottom: 4 }}
            />
        </View>
    )
}

export default React.memo(ProductHorizontalList)
