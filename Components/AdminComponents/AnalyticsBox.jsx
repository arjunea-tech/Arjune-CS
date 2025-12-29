import { Text, View } from 'react-native'

export default function AnalyticsBox({ icon, label, amount, isIncrease, percentage }) {
    return (
        <View className="w-52 h-40 bg-gray-100 rounded-2xl p-5">
            <View className="flex-row items-center justify-between">
                <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                    {icon}
                </View>
                <View className="items-end bg-white rounded-full px-2 py-1">
                    <Text>{isIncrease ? '+' : '-'}{percentage}</Text>
                </View>
            </View>
            {/* analyticsAmountDetails */}
            <View className="mt-5">
                <Text className="text-sm">{label}</Text>
                <Text className="text-2xl font-bold mt-1">{amount}</Text>
            </View>
        </View>
    )
}