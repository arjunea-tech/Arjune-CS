import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { THEME } from './theme'

export default function Button({ children, variant = 'primary', style, onPress, disabled }) {
  const isPrimary = variant === 'primary'
  const isGhost = variant === 'ghost'
  const bg = isPrimary ? THEME.colors.primary : '#fff'
  const color = isPrimary ? '#fff' : THEME.colors.primary
  const border = isGhost ? { borderWidth: 1, borderColor: THEME.colors.primary } : {}

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
      style={[styles.button, { backgroundColor: bg }, border, disabled && styles.disabled, style]}
    >
      <Text style={[styles.text, { color }]}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: THEME.radii.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: { fontWeight: '700', fontSize: THEME.fonts.body },
  disabled: { opacity: 0.6 }
})