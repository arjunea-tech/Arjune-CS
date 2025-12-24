export function formatCurrency(n) {
  if (typeof n !== 'number') n = Number(n) || 0
  return n.toFixed(2)
}
