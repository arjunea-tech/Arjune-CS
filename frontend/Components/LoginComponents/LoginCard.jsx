import { Formik } from 'formik';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as YUP from 'yup';
import { CustomButton } from './CustomButton';
import { Divider } from './Divider';
import { InputField } from './InputField';

const { width } = Dimensions.get('window');

const LoginSchema = YUP.object().shape({
  email: YUP.string().email('Invalid email').required('Email is required'),
  password: YUP.string()
    .min(8, 'Password too short')
    .required('Password is required'),
});

export function LoginCard({
  onLogin,
  onGoogleLogin,
  onSignUp,
  onForgetPassword,
  loading,
}) {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={(values) => {
        onLogin(values.email, values.password);
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.card}>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Celebrate Diwali with us</Text>
          <Text style={styles.subtitle}>Login to Continue.</Text>

          <InputField
            icon="mail"
            iconColor="#FF6B35"
            placeholder="Email Address"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {touched.email && errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}

          <InputField
            icon="lock-closed"
            placeholder="Password"
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            isPassword
          />
          {touched.password && errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          <CustomButton
            title="LOGIN"
            onPress={() => handleSubmit()}
            loading={loading}
            disabled={loading}
            customStyle={{ marginTop: 24 }}
          />

          <TouchableOpacity
            style={styles.forgetPasswordContainer}
            onPress={onForgetPassword}
          >
            <Text style={styles.forgetPassword}>Forget Password?</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={onSignUp}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <Divider />

          <CustomButton
            title="Continue with Google"
            icon="logo-google"
            variant="google"
            onPress={onGoogleLogin}
          />
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 32,
    width: width - 40,
    maxWidth: 400,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  forgetPasswordContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgetPassword: {
    fontSize: 13,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    fontSize: 13,
  },
  signupLink: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FF4444',
  },
});
