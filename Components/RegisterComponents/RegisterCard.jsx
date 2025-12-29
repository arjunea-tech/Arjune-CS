import { Checkbox } from 'expo-checkbox';
import { Formik } from 'formik';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import * as YUP from 'yup';
import { CustomButton } from '../LoginComponents/CustomButton';
import { Divider } from '../LoginComponents/Divider';
import { InputField } from '../LoginComponents/InputField';

const { width } = Dimensions.get('window');

const RegisterSchema = YUP.object().shape({
  fullName: YUP.string().required('Name is required'),
  email: YUP.string().email('Invalid email').required('Email is required'),
  password: YUP.string().min(8, 'Too short').required('Required'),
  confirmPassword: YUP.string()
    .oneOf([YUP.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

export function RegisterCard({ onRegister, onGoogleLogin }) {
  const [agree, setAgree] = useState(false);

  return (
    <Formik
      initialValues={{ fullName: '', email: '', password: '', confirmPassword: '' }}
      validationSchema={RegisterSchema}
      onSubmit={(values) => {
        if (!agree) {
          alert("Please agree to the terms");
          return;
        }
        onRegister(values);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create an Account</Text>

          <Text style={styles.label}>Full Name</Text>
          <InputField
            icon="person-outline"
            placeholder=""
            value={values.fullName}
            onChangeText={handleChange('fullName')}
            onBlur={handleBlur('fullName')}
          />

          <Text style={styles.label}>Email</Text>
          <InputField
            icon="mail-outline"
            placeholder=""
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <InputField
            icon="eye-outline"
            isPassword
            placeholder=""
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
          />

          <Text style={styles.label}>Confirm Password</Text>
          <InputField
            placeholder=""
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            isPassword
          />

          <View style={styles.termsContainer}>
            <Checkbox
              value={agree}
              onValueChange={setAgree}
              color={agree ? '#FF4444' : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.termsText}>
              By creating an account, you agree to the{' '}
              <Text style={styles.link}>Terms of service</Text> and{' '}
              <Text style={styles.link}>Policy</Text>.
            </Text>
          </View>

          <CustomButton
            title="Register"
            onPress={handleSubmit}
            customStyle={{ marginTop: 20 }}
          />

          <Divider text="Or Continue" />

          <CustomButton
            title="G"
            variant="google"
            onPress={onGoogleLogin}
            customStyle={styles.googleBtn}
          />
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 40,
    padding: 25,
    width: width - 40,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
    color: '#333',
  },
  termsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 8,
    width: 16,
    height: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#888',
    flex: 1,
  },
  link: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  googleBtn: {
    backgroundColor: '#FF4444',
  }
});