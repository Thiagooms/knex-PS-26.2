import { useCallback, useEffect, useState } from "react"
import type { Product } from "../types/api"
import { ApiError } from "../services/http"
import { fetchProduct, fetchProducts } from "../services/products-api"

const RELATED_LIMIT = 4

interface UseProductResult {
  product: Product | null
  related: Product[]
  loading: boolean
  error: string | null
  notFound: boolean
  reload: () => Promise<void>
}

export function useProduct(id: string): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    setNotFound(false)
    try {
      const [detail, list] = await Promise.all([fetchProduct(id), fetchProducts()])
      setProduct(detail.product)
      setRelated(list.products.filter((item) => item.id !== id).slice(0, RELATED_LIMIT))
    } catch (err) {
      if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
        setNotFound(true)
      } else {
        setError(err instanceof ApiError ? err.message : "Não foi possível carregar o produto.")
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void reload()
  }, [reload])

  return { product, related, loading, error, notFound, reload }
}
