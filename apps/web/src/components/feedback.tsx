interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

interface EmptyStateProps {
  title: string
  description?: string
}

export function LoadingState({ label = "Carregando…" }: { label?: string }) {
  return (
    <div className="feedback" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="feedback" role="alert">
      <p className="feedback-title">Algo deu errado</p>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="button button-secondary" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="feedback">
      <p className="feedback-title">{title}</p>
      {description && <p>{description}</p>}
    </div>
  )
}
