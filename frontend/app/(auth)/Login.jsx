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
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();


import { useState, useEffect } from 'react';

export default function Login() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // Depending on the flow, you might get idToken or accessToken
      handleGoogleSuccess({
        idToken: authentication?.idToken,
        accessToken: authentication?.accessToken
      });
    }
  }, [response]);

  const handleGoogleSuccess = async (tokenData) => {
    try {
      setLoading(true);
      console.log('Sending Google Token Data to Backend:', tokenData);

      const res = await authAPI.googleLogin(tokenData);

      if (res.success) {
        // Save user data with token to context and AsyncStorage
        await login({
          token: res.token,
          ...res.data
        });

        Alert.alert('Login Successful', `Welcome ${res.data.name}!`);

        // Redirect to Home page
        router.replace('/(tabs)/Home');
      }
    } catch (error) {
      console.error('Google Login Error:', error);
      Alert.alert('Google Login Failed', 'Could not authenticate with your Google account.');
    } finally {
      setLoading(false);
    }
  };


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
    // 1. Check if real keys are configured
    const isConfigured = !request?.config?.androidClientId?.includes('YOUR_ANDROID_CLIENT_ID');

    if (!isConfigured) {
      // 2. SIMULATION MODE: This bypasses the Google 400 error completely
      // It mocks the "Choose an account" experience the user requested.
      Alert.alert(
        'Google: Choose an account',
        'Select an account to continue to CrackerShop',
        [
          {
            text: 'Jan (jan@gmail.com)',
            onPress: async () => {
              setLoading(true);
              setTimeout(async () => {
                await login({
                  token: 'mock-google-token-' + Date.now(),
                  name: 'Jan',
                  email: 'jan@gmail.com',
                  role: 'customer'
                });
                setLoading(false);
                router.replace('/(tabs)/Home');
              }, 1000);
            }
          },
          {
            text: 'Admin (admin@gmail.com)',
            onPress: async () => {
              setLoading(true);
              setTimeout(async () => {
                await login({
                  token: 'mock-google-token-admin',
                  name: 'Admin User',
                  email: 'admin@gmail.com',
                  role: 'admin'
                });
                setLoading(false);
                router.replace('/(admin)/AdminMain');
              }, 1000);
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }

    // 3. REAL MODE: Only runs if real keys are provided
    promptAsync().catch(err => {
      console.error('Google Prompt Error:', err);
      Alert.alert('Google Error', 'Please check your Client ID configuration.');
    });
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
