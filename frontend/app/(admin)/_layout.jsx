import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AdminMain" />
      <Stack.Screen name="AddNewProduct" />
      <Stack.Screen name="Inventory" />
      <Stack.Screen name="Users" />
      <Stack.Screen name="Settings" />
      <Stack.Screen name="Orders" />
      <Stack.Screen name="ChitManagement" />
      <Stack.Screen name="AddChitScheme" />
      <Stack.Screen name="ChitDetails" />
      <Stack.Screen name="Categories" />
      <Stack.Screen name="AddCategory" />
      <Stack.Screen name="BannerManagement" />
      <Stack.Screen name="AddBanner" />
    </Stack>
  )
}