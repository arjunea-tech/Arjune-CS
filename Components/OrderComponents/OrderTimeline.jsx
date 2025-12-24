import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'
import { THEME } from '../ui/theme'

export default function OrderTimeline({ steps = [] }) {
  return (
    <View style={styles.container}>
      {steps.map((s, i) => (
        <View key={s.key} style={styles.row}>
          <View style={styles.left}>
            <View style={[styles.circle, s.done ? styles.circleDone : styles.circlePending]}>
              {s.done ? (
                <MaterialCommunityIcons name="check" size={14} color="#fff" />
              ) : (
                <MaterialCommunityIcons name="clock-outline" size={12} color="#666" />
              )}
            </View>
            {i !== steps.length - 1 && <View style={styles.connector} />}
          </View>

          <View style={styles.right}>
            <Text style={styles.label}>{s.label}</Text>
            {s.date ? <Text style={styles.date}>{s.date}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: THEME.colors.surface, borderRadius: THEME.radii.lg, padding: THEME.spacing.md, ...THEME.shadows.medium },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: THEME.spacing.md },
  left: { width: 44, alignItems: 'center' },
  circle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  circleDone: { backgroundColor: THEME.colors.success },
  circlePending: { backgroundColor: THEME.colors.surface, borderWidth: 1, borderColor: THEME.colors.border },
  connector: { width: 2, flex: 1, backgroundColor: THEME.colors.muted, marginTop: 6 },
  right: { flex: 1, paddingLeft: THEME.spacing.sm },
  label: { fontWeight: '700', color: THEME.colors.text, fontSize: THEME.fonts.subtitle },
  date: { color: THEME.colors.subtext, marginTop: 6 }
})