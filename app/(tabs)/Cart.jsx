import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useCart } from '../../Components/CartComponents/CartContext'
import CartItem from '../../Components/CartComponents/CartItem'
import OrderSummary from '../../Components/CartComponents/OrderSummary'
import Button from '../../Components/ui/Button'
import Card from '../../Components/ui/Card'
import { H1 } from '../../Components/ui/Typography'
import { THEME } from '../../Components/ui/theme'

function CartInner() {
  const { cartItems, totals } = useCart();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <View style={styles.header}><H1>Cart</H1></View>

        {cartItems.length === 0 ? (
          <Card style={{ margin: THEME.spacing.md, alignItems: 'center' }}>
            <Text style={{ color: THEME.colors.subtext }}>Your cart is empty.</Text>
            <Button style={{ marginTop: THEME.spacing.sm }} onPress={() => router.push('/')}>Continue Shopping</Button>
          </Card>
        ) : (
          cartItems.map((it) => <CartItem key={it.product.id} item={it} />)
        )}

        <OrderSummary totals={totals} onProceed={() => router.push('/Checkout')} />
      </ScrollView>
    </View>
  );
}

export default function Cart() {
  return <CartInner />
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: { padding: THEME.spacing.md }
})