import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartProvider } from "../Components/CartComponents/CartContext";
import { AuthProvider, useAuth } from "../Components/utils/AuthContext";
import { NotificationProvider } from "../Components/utils/NotificationContext";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

// Separate component to use hook inside provider
const ProtectedLayout = () => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAdminGroup = segments[0] === "(admin)";

    if (!isAuthenticated) {
      if (!inAuthGroup) {
        router.replace("/(auth)/Login");
      }
    } else {
      // Authenticated
      if (inAuthGroup) {
        if (isAdmin) {
          router.replace("/(admin)/AdminMain");
        } else {
          router.replace("/(tabs)/Home");
        }
      }
    }
  }, [isAuthenticated, segments, isLoading, isAdmin]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "right", "left"]}>
      <StatusBar style="dark" />
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <ProtectedLayout />
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaView>
  );
}
