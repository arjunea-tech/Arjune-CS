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

export default function Register() {
  const handleRegister = async (values) => {
    // values contains: fullName, email, password, confirmPassword
    Alert.alert('Registration Successful', `Welcome, ${values.fullName}!`);
    router.replace('/(tabs)/Home');
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
        {/* Firework Decorations matching your screenshot */}
        <FireworkDecoration top={20} left={-20} width={150} height={150} />
        <FireworkDecoration top={10} right={-20} width={180} height={180} />

        <Text style={styles.headerTitle}>Diwali Glow...</Text>

        <RegisterCard
          onRegister={handleRegister}
          onGoogleLogin={handleGoogleRegister}
        />
        
        {/* Bottom Fireworks */}
        <FireworkDecoration bottom={-20} left={-30} width={150} height={150} />
        <FireworkDecoration bottom={-20} right={-30} width={200} height={200} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: THEME.colors.primary || '#FF3B30', 
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  headerTitle: {
    fontSize: 42,
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'serif', // Cursive style for "Diwali Glow"
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
});