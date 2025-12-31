import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export function InputField({
  icon,
  iconColor = '#666',
  isPassword = false,
  ...textInputProps
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Ionicons
        name={icon}
        size={20}
        color={iconColor}
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        secureTextEntry={isPassword && !showPassword}
        {...textInputProps}
      />
      {isPassword && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginTop: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  eyeIcon: {
    padding: 4,
  },
});