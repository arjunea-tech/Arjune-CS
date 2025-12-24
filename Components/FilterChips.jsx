import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

const filters = [
    { id: 'default', label: 'Default' },
    { id: 'az', label: 'A → Z' },
    { id: 'low', label: 'Low → High' },
    { id: 'high', label: 'High → Low' },
]

export default function FilterChips({ active = 'default', onChange = () => {} }) {
    // local fallback state for uncontrolled use
    const [localActive, setLocalActive] = useState(active)

    const handlePress = (id) => {
        setLocalActive(id)
        onChange(id)
    }

    const current = active || localActive

    return (
        <View className="mt-6">
            <Text className="text-xl font-bold px-4 mb-4">Filter Products</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
            >
                {filters.map(item => {
                    const isActive = current === item.id
                    return (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => handlePress(item.id)}
                            className={`px-4 py-2 rounded-full border ${isActive
                                    ? 'bg-orange-500 border-orange-500'
                                    : 'bg-white border-gray-300'
                                }`}
                        >
                            <Text className={isActive ? 'text-white' : 'text-gray-700'}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}
