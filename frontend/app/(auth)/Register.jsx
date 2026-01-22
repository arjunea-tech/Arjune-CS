import { router } from 'expo-router';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';

import { FireworkDecoration } from '../../Components/LoginComponents/FireworkDecoration';
import { RegisterCard } from '../../Components/RegisterComponents/RegisterCard';
import { THEME } from '../../Components/ui/theme';
import { authAPI } from '../../Components/api';
import "../../Components/RegisterComponents/RegisterCard"
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

import { useState, useEffect } from 'react';


export default function Register() {
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleSuccess(authentication.accessToken);
    }
  }, [response]);

  const handleGoogleSuccess = async (token) => {
    try {
      setLoading(true);
      console.log('Google Token:', token);
      // const res = await authAPI.googleLogin(token);
      // Handle success redirection...
    } catch (error) {
      Alert.alert('Google Login Failed', 'Could not authenticate with Google.');
    } finally {
      setLoading(false);
    }
  };


  const handleRegister = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Required fields only
      formData.append('name', values.fullName);
      formData.append('email', values.email);
      formData.append('password', values.password);
      
      // Optional fields - only append if they have values
      if (values.mobileNumber && values.mobileNumber.trim()) {
        formData.append('mobileNumber', values.mobileNumber);
      }
      if (values.address && values.address.trim()) {
        formData.append('address', values.address);
      }
      if (values.pincode && values.pincode.trim()) {
        formData.append('pincode', values.pincode);
      }
      if (values.district && values.district.trim()) {
        formData.append('district', values.district);
      }
      if (values.state && values.state.trim()) {
        formData.append('state', values.state);
      }

      if (values.avatar) {
        const localUri = values.avatar;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append('avatar', { uri: localUri, name: filename, type });
      }

      console.log('[REGISTER] Attempting registration with:', { name: values.fullName, email: values.email });
      
      const res = await authAPI.register(formData);
      if (res.success) {
        console.log('[REGISTER] Success');
        Alert.alert('Registration Successful', `Welcome, ${values.fullName}!`);
        router.replace('/(auth)/Login');
      } else {
        const errorMsg = res.error || 'Registration failed';
        console.error('[REGISTER] Error:', errorMsg);
        Alert.alert('Error', errorMsg);
      }
    } catch (error) {
      console.error('[REGISTER] Exception:', error.message);
      let errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      if (error.response?.data?.details) {
        errorMessage = error.response.data.details.map(d => `${d.field}: ${d.message}`).join('\n');
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    promptAsync();
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
        {/* Firework Decorations matching Login page */}
        <FireworkDecoration top={40} left={20} width={100} height={100} />
        <FireworkDecoration top={60} right={30} width={120} height={120} opacity={0.8} />
        <FireworkDecoration top={200} right={60} width={80} height={80} opacity={0.5} />

        <Text style={styles.headerTitle}>Name</Text>

        <RegisterCard
          onRegister={handleRegister}
          onGoogleLogin={handleGoogleRegister}
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
    textAlign: 'center',
  },
});