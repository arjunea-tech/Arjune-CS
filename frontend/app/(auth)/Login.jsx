import { router } from 'expo-router';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';
import { authAPI } from '../../Components/api';
import { FireworkDecoration } from '../../Components/LoginComponents/FireworkDecoration';
import { LoginCard } from '../../Components/LoginComponents/LoginCard';
import { THEME } from '../../Components/ui/theme';
import { useAuth } from '../../Components/utils/AuthContext';

import { useState } from 'react';

export default function Login() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      // Call backend API for authentication
      const response = await authAPI.login(email, password);

      if (response.success) {
        // Save user data with token to context and AsyncStorage
        await login({
          token: response.token,
          ...response.data
        });

        Alert.alert('Login Successful', 'Welcome back!');

        // Redirect based on role
        if (response.data.role === 'admin') {
          router.replace('/(admin)/AdminMain');
        } else {
          router.replace('/(tabs)/Home');
        }
      }
    } catch (error) {
      console.log('Login error:', error);
      const errorMessage = typeof error === 'object'
        ? (error.message || JSON.stringify(error))
        : error;
      Alert.alert('Login Failed', errorMessage || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleSignUp = () => {
    console.log('Sign up clicked');
    router.push('/(auth)/Register');
  };

  const handleForgetPassword = () => {
    console.log('Forget password clicked');
    router.push('/(auth)/ForgetPassword');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Firework Decorations */}
        <FireworkDecoration top={40} left={20} width={100} height={100} />
        <FireworkDecoration top={60} right={30} width={120} height={120} opacity={0.8} />
        <FireworkDecoration top={200} right={60} width={80} height={80} opacity={0.5} />

        {/* Header Title */}
        <Text style={styles.headerTitle}>Name</Text>

        {/* Login Card */}
        <LoginCard
          onLogin={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          onSignUp={handleSignUp}
          onForgetPassword={handleForgetPassword}
          loading={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: THEME.colors.primary,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: THEME.colors.primary,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },
});
