import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartProvider } from "../Components/CartComponents/CartContext";
import { AuthProvider } from "../Components/utils/AuthContext";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "right", "left"]}>
      <StatusBar style="dark" />
      <AuthProvider>
        <CartProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(admin)" />
          </Stack>
        </CartProvider>
      </AuthProvider>
    </SafeAreaView>
  );
}
