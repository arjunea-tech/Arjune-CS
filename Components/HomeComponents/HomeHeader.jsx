import { MaterialCommunityIcons } from '@expo/vector-icons'
import LottieView from 'lottie-react-native'
import { Text, TextInput, View } from 'react-native'
import { COLORS } from '../../constant/theme'

export default function HomeHeader({ searchValue = '', onChangeText = () => {} }) {
    return (
        <View>
            {/* Header */}
            <View
                className="w-full h-48 rounded-b-3xl px-6 pt-6 pb-4 justify-between overflow-hidden"
                style={{ backgroundColor: COLORS.primary }}
            >
                {/* 🎆 LOTTIE BACKGROUND */}
                <LottieView
                    source={require('../../assets/images/Fireworks Teal and Red.json')}
                    autoPlay
                    loop
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.65,
                    }}
                />

                {/* CONTENT ABOVE LOTTIE */}
                <View className="flex-row w-full items-center justify-between mt-5">
                    <Text className="text-white text-2xl font-bold">NAME</Text>
                    <View className="w-12 h-12 bg-white rounded-full items-center justify-center" />
                </View>

                <View className="h-4" />

                <View className="w-full h-12 bg-white rounded-xl flex-row items-center px-4 shadow-md">
                    <MaterialCommunityIcons name="magnify" size={24} color="#999" />
                    <TextInput
                        placeholder="Search products..."
                        placeholderTextColor="#999"
                        className="flex-1 ml-2 text-gray-800"
                        value={searchValue}
                        onChangeText={onChangeText}
                    />
                </View>
            </View>
        </View>
    )
}