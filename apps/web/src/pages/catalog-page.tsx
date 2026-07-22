import { useMemo, useState } from "react"
import { CategoryFilter } from "../components/category-filter"
import type { CategoryOption } from "../components/category-filter"
import { EmptyState, ErrorState, LoadingState } from "../components/feedback"
import { ProductCard } from "../components/product-card"
import { SearchBar } from "../components/search-bar"
import { SortControl } from "../components/sort-control"
import type { SortOption } from "../components/sort-control"
import { useProducts } from "../hooks/use-products"
import type { Product } from "../types/api"
import { normalizeText } from "../utils/normalize-text"

const COMPARATORS: Record<SortOption, (a: Product, b: Product) => number> = {
  "name-asc": (a, b) => a.name.localeCompare(b.name, "pt-BR"),
  "name-desc": (a, b) => b.name.localeCompare(a.name, "pt-BR"),
  "price-asc": (a, b) => Number(a.price) - Number(b.price),
  "price-desc": (a, b) => Number(b.price) - Number(a.price),
}

export function CatalogPage() {
  const { products, loading, error, reload } = useProducts()
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<SortOption>("name-asc")
  const [category, setCategory] = useState<CategoryOption>("all")

  const visible = useMemo(() => {
    if (!products) return []
    const query = normalizeText(search)
    const filtered = products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category
      const matchesSearch = !query || normalizeText(product.name).includes(query)
      return matchesCategory && matchesSearch
    })
    return [...filtered].sort(COMPARATORS[sort])
  }, [products, search, sort, category])

  if (loading) return <LoadingState label="Carregando o catálogo…" />
  if (error) return <ErrorState message={error} onRetry={() => void reload()} />
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="Catálogo vazio"
        description="Nenhum produto cadastrado na loja até agora."
      />
    )
  }

  return (
    <section>
      <div className="catalog-toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter value={category} onChange={setCategory} />
        <SortControl value={sort} onChange={setSort} />
      </div>
      {visible.length === 0 ? (
        <EmptyState
          title="Nenhum produto encontrado"
          description="Nenhum produto bate com os filtros atuais."
        />
      ) : (
        <ul className="catalog-grid">
          {visible.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
