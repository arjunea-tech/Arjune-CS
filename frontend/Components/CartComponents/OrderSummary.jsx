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
                <View style={styles.row}><Text>Subtotal</Text><Text>${formatCurrency(totals.subtotal ?? 0)}</Text></View>
                <View style={styles.row}><Text>Offer Discount</Text><Text>${formatCurrency(totals.discount ?? 0)}</Text></View>
                <View style={styles.row}><Text>Shipping</Text><Text>{totals.shipping === 0 ? 'Free' : `$${formatCurrency(totals.shipping ?? 0)}`}</Text></View>
                <View style={[styles.row, { marginTop: 8, borderTopWidth: 1, borderTopColor: THEME.colors.muted, paddingTop: 8 }]}>
                    <Text style={{ fontWeight: '700' }}>Grand TOTAL</Text>
                    <Text style={{ fontWeight: '700' }}>${formatCurrency(totals.grandTotal ?? 0)}</Text>
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
    heading: { fontWeight: '700', marginBottom: THEME.spacing.sm },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: THEME.spacing.sm },
    button: { borderRadius: THEME.radii.round, paddingVertical: THEME.spacing.sm , marginTop: THEME.spacing.md, width: '100%' }
});