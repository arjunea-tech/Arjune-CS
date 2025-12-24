import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left']}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      > 
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="ProductView" />
      </Stack>
    </SafeAreaView>
  );
}
