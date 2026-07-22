import { useCallback, useEffect, useState } from "react"
import type { Product } from "../types/api"
import { ApiError } from "../services/http"
import { fetchProducts } from "../services/products-api"

interface UseProductsResult {
  products: Product[] | null
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProducts()
      setProducts(data.products)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível carregar o catálogo.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  return { products, loading, error, reload }
}
