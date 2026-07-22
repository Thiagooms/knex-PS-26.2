export function formatPrice(price: string): string {
  const [integerPart = "0", decimalPart = ""] = price.split(".")
  const cents = decimalPart.padEnd(2, "0").slice(0, 2)
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `R$ ${grouped},${cents}`
}
