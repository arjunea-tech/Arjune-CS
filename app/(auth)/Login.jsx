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
import { LoginCard } from '../../Components/LoginComponents/LoginCard';
import { THEME } from '../../Components/ui/theme';
import users from "../../testing/UserTestData.json";

export default function Login() {
  const handleLogin = async (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      Alert.alert('Login Successful', `Welcome back, ${email}!`);
      router.replace('/(tabs)/Home');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password.');
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
