import { Text, View } from 'react-native'

export default function RecentOrdersCard({ name, orderId, time, price, isPaid }) {
    return (
        <View className="w-12/12 h-20 bg-white rounded-full mt-5 p-5 justify-center align">
            <View className="flex-row justify-between items-center">
                <View className="bg-gray-200 rounded-full p-2 w-12 h-12">
                    {/* for product image */}
                </View>
                <View className="flex-col items-center">
                    <Text className="font-bold">{name}</Text>
                    <Text>{orderId} . {time}</Text>
                </View>
                <View className="flex-col items-center">
                    <Text>{price}</Text>
                    {
                        isPaid ? (
                            <Text className="text-green-500 font-bold text-sm bg-green-100 px-2 py-1 rounded-full">Paid</Text>
                        ) : (
                            <Text className="text-red-500 font-bold text-sm bg-red-100 px-2 py-1 rounded-full">Not Paid</Text>
                        )
                    }
                </View>
            </View>
        </View>
    )
}