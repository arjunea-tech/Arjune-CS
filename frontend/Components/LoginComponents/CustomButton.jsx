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
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={variant === 'google' ? '#4285F4' : '#FFF'}
            />
          )}
          <Text style={[textStyle, icon && { marginLeft: 10 }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#FF7F00',
    borderRadius: 10,
    paddingVertical: 14,
    shadowColor: '#FF7F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
