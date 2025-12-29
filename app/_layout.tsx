import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartProvider } from "../Components/CartComponents/CartContext";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "right", "left"]}>
      <StatusBar style="dark" />
      <CartProvider>
        <Stack
          screenOptions={{ 
            headerShown: false,
          }}
        > 
          {/* <Stack.Screen name="(tabs)" /> */}
          {/* <Stack.Screen name="(auth)" /> */}
          <Stack.Screen name="(admin)" />
        </Stack>
      </CartProvider>
    </SafeAreaView>
  );
}
