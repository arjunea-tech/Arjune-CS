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
  fullName: YUP.string().required('Name is required'),
  email: YUP.string().email('Invalid email').required('Email is required'),
  password: YUP.string().min(8, 'Too short').required('Required'),
  confirmPassword: YUP.string()
    .oneOf([YUP.ref('password'), null], 'Passwords must match')
    .required('Required'),
  mobileNumber: YUP.string().required('Mobile number is required'),
  address: YUP.string().required('Address is required'),
  pincode: YUP.string().length(6, 'Invalid pincode').required('Pincode is required'),
  district: YUP.string().required('District is required'),
  state: YUP.string().required('State is required'),
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
            iconColor="#FF6B35"
            placeholder="Full Name"
            value={values.fullName}
            onChangeText={handleChange('fullName')}
            onBlur={handleBlur('fullName')}
          />
          {errors.fullName && touched.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

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
          {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <InputField
            icon="call"
            iconColor="#FF6B35"
            placeholder="Mobile Number"
            value={values.mobileNumber}
            onChangeText={handleChange('mobileNumber')}
            onBlur={handleBlur('mobileNumber')}
            keyboardType="phone-pad"
          />
          {errors.mobileNumber && touched.mobileNumber && <Text style={styles.errorText}>{errors.mobileNumber}</Text>}

          <InputField
            icon="location"
            iconColor="#FF6B35"
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
                iconColor="#FF6B35"
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
                iconColor="#FF6B35"
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
            iconColor="#FF6B35"
            placeholder="State"
            value={values.state}
            onChangeText={handleChange('state')}
            onBlur={handleBlur('state')}
          />
          {errors.state && touched.state && <Text style={styles.errorText}>{errors.state}</Text>}

          <InputField
            icon="lock-closed"
            iconColor="#FF6B35"
            isPassword
            placeholder="Password"
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
          />
          {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <InputField
            icon="lock-closed"
            iconColor="#FF6B35"
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
    borderRadius: 24,
    padding: 32,
    width: width - 40,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  avatarRow: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
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
    color: '#999',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
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