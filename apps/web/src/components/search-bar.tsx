interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="field search-bar">
      <label className="field-label" htmlFor="catalog-search">
        Buscar
      </label>
      <input
        id="catalog-search"
        type="search"
        className="field-input"
        placeholder="Nome do produto…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
