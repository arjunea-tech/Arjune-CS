import { StyleSheet, Text, View } from 'react-native';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { THEME } from '../ui/theme';
import { formatCurrency } from '../utils/format';

export default function OrderSummary({ totals = {}, onProceed = () => { }, buttonLabel = 'Proceed to Checkout' }) {
    return (
        <View style={styles.wrapper}>
            <Card>
                <Text style={styles.heading}>Order Summary</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Items Total</Text>
                    <Text style={styles.value}>₹{formatCurrency(totals.itemsTotal || totals.subtotal || 0)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Discount</Text>
                    <Text style={[styles.value, { color: THEME.colors.success }]}>- ₹{formatCurrency(totals.discount ?? 0)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Delivery Fee</Text>
                    <Text style={styles.value}>{totals.shipping === 0 ? 'Free' : `₹${formatCurrency(totals.shipping ?? 0)}`}</Text>
                </View>

                <View style={[styles.row, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Grand Total</Text>
                    <Text style={styles.totalValue}>₹{formatCurrency(totals.grandTotal ?? 0)}</Text>
                </View>

                <View style={{ marginTop: THEME.spacing.md }}>
                    <Button variant="primary" style={styles.button} onPress={onProceed}>
                        {buttonLabel}
                    </Button>
                </View>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { marginTop: THEME.spacing.md },
    heading: { fontWeight: '700', marginBottom: THEME.spacing.sm, fontSize: 16, color: THEME.colors.text },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: THEME.spacing.xs },
    label: { color: THEME.colors.subtext, fontSize: 14 },
    value: { color: THEME.colors.text, fontSize: 14, fontWeight: '600' },
    totalRow: { marginTop: 12, borderTopWidth: 1, borderTopColor: THEME.colors.muted, paddingTop: 12 },
    totalLabel: { fontWeight: '800', fontSize: 16, color: THEME.colors.text },
    totalValue: { fontWeight: '800', fontSize: 18, color: THEME.colors.primary },
    button: { borderRadius: THEME.radii.round, paddingVertical: THEME.spacing.sm, marginTop: THEME.spacing.xs, width: '100%' }
});