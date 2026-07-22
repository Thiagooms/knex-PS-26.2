import type { Product } from "../types/api"
import { request } from "./http"

export function fetchProducts(): Promise<{ products: Product[] }> {
  return request<{ products: Product[] }>("/products")
}

export function fetchProduct(id: string): Promise<{ product: Product }> {
  return request<{ product: Product }>(`/products/${id}`)
}
