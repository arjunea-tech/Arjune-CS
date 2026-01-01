import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

export function CustomButton({
  title,
  icon,
  variant = 'primary',
  customStyle,
  loading,
  ...touchableProps
}) {
  const buttonStyle =
    variant === 'google' ? styles.googleButton : styles.primaryButton;
  const textStyle =
    variant === 'google' ? styles.googleButtonText : styles.primaryButtonText;

  return (
    <TouchableOpacity
      style={[buttonStyle, customStyle, loading && { opacity: 0.8 }]}
      disabled={loading}
      {...touchableProps}
    >
      {loading ? (
        <ActivityIndicator color="#FFF" size="small" />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={20} color="#FFF" />}
          <Text style={[textStyle, icon && { marginLeft: 8 }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#FF4444',
    borderRadius: 10,
    paddingVertical: 14,
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#FF4444',
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  googleButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
