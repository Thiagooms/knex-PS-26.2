export type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc"

const SORT_LABELS: Record<SortOption, string> = {
  "name-asc": "Nome (A–Z)",
  "name-desc": "Nome (Z–A)",
  "price-asc": "Preço (menor primeiro)",
  "price-desc": "Preço (maior primeiro)",
}

interface SortControlProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function SortControl({ value, onChange }: SortControlProps) {
  return (
    <div className="field sort-control">
      <label className="field-label" htmlFor="catalog-sort">
        Ordenar por
      </label>
      <select
        id="catalog-sort"
        className="field-input"
        value={value}
        onChange={(event) => onChange(event.target.value as SortOption)}
      >
        {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
          <option key={option} value={option}>
            {SORT_LABELS[option]}
          </option>
        ))}
      </select>
    </div>
  )
}
