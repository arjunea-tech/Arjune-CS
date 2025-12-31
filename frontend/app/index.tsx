import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "../Components/utils/AuthContext";
import "./global.css";

export default function Index() {
  const { user, isLoading, logout } = useAuth();
  const [shouldClearAuth, setShouldClearAuth] = useState(false);

  // TEMPORARY: Uncomment the line below to force logout on app start (for testing)
  // useEffect(() => { logout(); }, []);

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // Not logged in - go to login
  if (!user) {
    return <Redirect href="/(auth)/Login" />;
  }

  // Admin user - go to admin panel
  if (user.role === 'admin') {
    return <Redirect href="/(admin)/AdminMain" />;
  }

  // Customer user - go to home tabs
  return <Redirect href="/(tabs)/Home" />;
}
