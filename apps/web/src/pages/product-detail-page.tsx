import { Link, useParams } from "react-router-dom"
import { EmptyState, ErrorState, LoadingState } from "../components/feedback"
import { ProductCard } from "../components/product-card"
import { StockBadge } from "../components/stock-badge"
import { useProduct } from "../hooks/use-product"
import { formatDate } from "../utils/format-date"
import { formatPrice } from "../utils/format-price"

export function ProductDetailPage() {
  const { id = "" } = useParams()
  const { product, related, loading, error, notFound, reload } = useProduct(id)

  return (
    <article className="product-detail">
      <Link to="/" className="back-link">
        ← Voltar ao catálogo
      </Link>
      {loading && <LoadingState label="Carregando o produto…" />}
      {notFound && (
        <EmptyState
          title="Produto não encontrado"
          description="Ele pode ter sido removido do catálogo."
        />
      )}
      {error && <ErrorState message={error} onRetry={() => void reload()} />}
      {!loading && !notFound && !error && product && (
        <>
          <header className="product-detail-header">
            <StockBadge product={product} />
            <h2 className="product-detail-name">{product.name}</h2>
            <p className="product-detail-price">{formatPrice(product.price)}</p>
          </header>
          <p className="product-detail-description">{product.description}</p>
          <dl className="product-detail-specs">
            <div>
              <dt>Estoque</dt>
              <dd>{product.stock} un.</dd>
            </div>
            <div>
              <dt>Cadastrado em</dt>
              <dd>{formatDate(product.createdAt)}</dd>
            </div>
            <div>
              <dt>Atualizado em</dt>
              <dd>{formatDate(product.updatedAt)}</dd>
            </div>
          </dl>
          {related.length > 0 && (
            <section>
              <h3 className="related-title">Outros produtos</h3>
              <ul className="catalog-grid">
                {related.map((item) => (
                  <li key={item.id}>
                    <ProductCard product={item} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </article>
  )
}
