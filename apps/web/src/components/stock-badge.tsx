import type { Product } from "../types/api"

const LOW_STOCK_THRESHOLD = 3

export function StockBadge({ product }: { product: Product }) {
  if (product.stock === 0) {
    return <span className="stock-badge stock-badge-out">esgotado</span>
  }
  if (product.stock <= LOW_STOCK_THRESHOLD) {
    return <span className="stock-badge stock-badge-low">últimas {product.stock} un.</span>
  }
  return <span className="stock-badge">em estoque · {product.stock} un.</span>
}
