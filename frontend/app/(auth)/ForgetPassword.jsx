import { Formik } from 'formik';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import * as YUP from 'yup';

import { CustomButton } from '../../Components/LoginComponents/CustomButton';
import { InputField } from '../../Components/LoginComponents/InputField';
import { THEME } from '../../Components/ui/theme';
import users from "../../testing/UserTestData.json";

const ResetPasswordSchema = YUP.object().shape({
  email: YUP.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: YUP.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),

  confirmPassword: YUP.string()
    .oneOf([YUP.ref('password')], 'Passwords do not match')
    .required('Confirm password is required'),
});

export default function ResetPassword() {
  const handleResetPassword = async (email, password) => {
    try {
        // Simulate API call to reset password
        const user = users.find(u => u.email === email);
        if (user) {
          user.password = password;
          users.filter(u => u.id !== user.id);
          users.push(user);
        } else {
          Alert.alert('Error', 'Email not found.');
          return;
        }
    }catch (error) {
      console.error('Error resetting password:', error);
    }
    Alert.alert(
      'Password Reset Successful',
      `Password updated for ${email}`
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email and create a new password
          </Text>

          <Formik
            initialValues={{
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={ResetPasswordSchema}
            onSubmit={(values) =>
              handleResetPassword(values.email, values.password)
            }
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                {/* Email */}
                <InputField
                  icon="mail"
                  iconColor="#FF6B35"
                  placeholder="Email Address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                {/* New Password */}
                <InputField
                  icon="lock-closed"
                  placeholder="New Password"
                  isPassword
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                {/* Confirm Password */}
                <InputField
                  icon="lock-closed"
                  placeholder="Confirm Password"
                  isPassword
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>
                    {errors.confirmPassword}
                  </Text>
                )}

                <CustomButton
                  title="RESET PASSWORD"
                  onPress={handleSubmit}
                  customStyle={{ marginTop: 24 }}
                />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
