import { Checkbox } from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as YUP from 'yup';
import { CustomButton } from '../LoginComponents/CustomButton';
import { Divider } from '../LoginComponents/Divider';
import { InputField } from '../LoginComponents/InputField';

const { width } = Dimensions.get('window');

const RegisterSchema = YUP.object().shape({
  fullName: YUP.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters').required('Name is required'),
  email: YUP.string().email('Invalid email').required('Email is required'),
  password: YUP.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: YUP.string()
    .oneOf([YUP.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  mobileNumber: YUP.string().matches(/^[0-9]{10}$/, 'Mobile must be 10 digits').optional(),
  address: YUP.string().optional(),
  pincode: YUP.string().matches(/^[0-9]{6}$/, 'Pincode must be 6 digits').optional(),
  district: YUP.string().optional(),
  state: YUP.string().optional(),
});

export function RegisterCard({ onRegister, onGoogleLogin, loading }) {
  const [agree, setAgree] = useState(false);

  const pickImage = async (setFieldValue) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFieldValue('avatar', result.assets[0].uri);
    }
  };

  return (
    <Formik
      initialValues={{
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatar: null,
        mobileNumber: '',
        address: '',
        pincode: '',
        district: '',
        state: ''
      }}
      validationSchema={RegisterSchema}
      onSubmit={(values) => {
        if (!agree) {
          alert("Please agree to the terms");
          return;
        }
        onRegister(values);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Join the Celebration!</Text>
          <Text style={styles.subtitle}>Create an account to start shopping</Text>

          {/* Avatar Picker */}
          <View style={styles.avatarRow}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => pickImage(setFieldValue)}
            >
              {values.avatar ? (
                <Image source={{ uri: values.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="camera-outline" size={30} color="#FF6B35" />
                  <Text style={styles.avatarText}>Profile Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <InputField
            icon="person"
            iconColor="#FF7F00"
            placeholder="Full Name"
            value={values.fullName}
            onChangeText={handleChange('fullName')}
            onBlur={handleBlur('fullName')}
          />
          {errors.fullName && touched.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

          <InputField
            icon="mail"
            iconColor="#FF7F00"
            placeholder="Email Address"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <InputField
            icon="call"
            iconColor="#FF7F00"
            placeholder="Mobile Number"
            value={values.mobileNumber}
            onChangeText={handleChange('mobileNumber')}
            onBlur={handleBlur('mobileNumber')}
            keyboardType="phone-pad"
          />
          {errors.mobileNumber && touched.mobileNumber && <Text style={styles.errorText}>{errors.mobileNumber}</Text>}

          <InputField
            icon="location"
            iconColor="#FF7F00"
            placeholder="Address (House No, Street...)"
            value={values.address}
            onChangeText={handleChange('address')}
            onBlur={handleBlur('address')}
            multiline
          />
          {errors.address && touched.address && <Text style={styles.errorText}>{errors.address}</Text>}

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <InputField
                icon="pin"
                iconColor="#FF7F00"
                placeholder="Pincode"
                value={values.pincode}
                onChangeText={async (pin) => {
                  setFieldValue('pincode', pin);
                  if (pin.length === 6) {
                    try {
                      const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
                      const data = await response.json();
                      if (data[0].Status === "Success") {
                        setFieldValue('district', data[0].PostOffice[0].District);
                        setFieldValue('state', data[0].PostOffice[0].State);
                      }
                    } catch (e) {
                      console.error("Pincode error:", e);
                    }
                  }
                }}
                onBlur={handleBlur('pincode')}
                keyboardType="number-pad"
                maxLength={6}
              />
              {errors.pincode && touched.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <InputField
                icon="business"
                iconColor="#FF7F00"
                placeholder="District"
                value={values.district}
                onChangeText={handleChange('district')}
                onBlur={handleBlur('district')}
              />
              {errors.district && touched.district && <Text style={styles.errorText}>{errors.district}</Text>}
            </View>
          </View>

          <InputField
            icon="earth"
            iconColor="#FF7F00"
            placeholder="State"
            value={values.state}
            onChangeText={handleChange('state')}
            onBlur={handleBlur('state')}
          />
          {errors.state && touched.state && <Text style={styles.errorText}>{errors.state}</Text>}

          <InputField
            icon="lock-closed"
            iconColor="#FF7F00"
            isPassword
            placeholder="Password"
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
          />
          {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <InputField
            icon="lock-closed"
            iconColor="#FF7F00"
            placeholder="Confirm Password"
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            isPassword
          />
          {errors.confirmPassword && touched.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          <View style={styles.termsContainer}>
            <Checkbox
              value={agree}
              onValueChange={setAgree}
              color={agree ? '#FF7F00' : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.termsText}>
              By creating an account, you agree to the{' '}
              <Text style={styles.link}>Terms of service</Text> and{' '}
              <Text style={styles.link}>Policy</Text>.
            </Text>
          </View>

          <CustomButton
            title="REGISTER"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            customStyle={{ marginTop: 24 }}
          />

          <Divider text="Or Continue" />

          <CustomButton
            title="Continue with Google"
            icon="logo-google"
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
    borderRadius: 20,
    padding: 24,
    width: width - 40,
    maxWidth: 400,
    shadowColor: '#FF7F00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
    borderTopWidth: 4,
    borderTopColor: '#FF7F00',
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    color: '#FF7F00',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 18,
    fontWeight: '500',
  },
  avatarRow: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF3E0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF7F00',
    borderStyle: 'dashed',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 11,
    color: '#FF7F00',
    marginTop: 4,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#E53935',
    fontSize: 11,
    marginTop: 3,
    marginLeft: 8,
    fontWeight: '500',
  },
  termsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 10,
    width: 18,
    height: 18,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    lineHeight: 18,
  },
  link: {
    color: '#FF7F00',
    fontWeight: '700',
  },
  googleBtn: {
    backgroundColor: '#FF7F00',
  }
});