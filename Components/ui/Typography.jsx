import { Text } from 'react-native'
import { THEME } from './theme'

export const H1 = ({ children, style }) => <Text style={[{ fontSize: THEME.fonts.title, fontWeight: '800', color: THEME.colors.text }, style]}>{children}</Text>
export const P = ({ children, style }) => <Text style={[{ fontSize: THEME.fonts.body, color: THEME.colors.subtext }, style]}>{children}</Text>
export const Small = ({ children, style }) => <Text style={[{ fontSize: THEME.fonts.small, color: THEME.colors.subtext }, style]}>{children}</Text>
