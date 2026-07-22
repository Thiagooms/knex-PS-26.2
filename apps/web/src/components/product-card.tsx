import { Link } from "react-router-dom"
import { CATEGORY_LABELS } from "../types/api"
import type { Product } from "../types/api"
import { formatPrice } from "../utils/format-price"
import { StockBadge } from "./stock-badge"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <StockBadge product={product} />
      <span className="product-card-category">{CATEGORY_LABELS[product.category]}</span>
      <h3 className="product-card-name">{product.name}</h3>
      <p className="product-card-description">{product.description}</p>
      <p className="product-card-price">{formatPrice(product.price)}</p>
    </Link>
  )
}
