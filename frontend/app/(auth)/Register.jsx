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

export default function Register() {
  const handleRegister = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.fullName);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('mobileNumber', values.mobileNumber);
      formData.append('address', values.address);
      formData.append('pincode', values.pincode);
      formData.append('district', values.district);
      formData.append('state', values.state);

      if (values.avatar) {
        const localUri = values.avatar;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append('avatar', { uri: localUri, name: filename, type });
      }

      const res = await authAPI.register(formData);
      if (res.success) {
        Alert.alert('Registration Successful', `Welcome, ${values.fullName}!`);
        router.replace('/(auth)/Login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Registration failed');
    }
  };

  const handleGoogleRegister = () => {
    console.log('Google registration clicked');
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