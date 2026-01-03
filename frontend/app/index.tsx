import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "../Components/utils/AuthContext";
import "./global.css";

export default function Index() {
  const { isLoading } = useAuth();

  // Redirection is handled by the ProtectedLayout in _layout.tsx
  // This file just serves as the entry point.
  return null;
}
