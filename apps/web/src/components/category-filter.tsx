import { CATEGORY_LABELS, PRODUCT_CATEGORIES } from "../types/api"
import type { ProductCategory } from "../types/api"

export type CategoryOption = ProductCategory | "all"

interface CategoryFilterProps {
  value: CategoryOption
  onChange: (value: CategoryOption) => void
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="field category-filter">
      <label className="field-label" htmlFor="catalog-category">
        Categoria
      </label>
      <select
        id="catalog-category"
        className="field-input"
        value={value}
        onChange={(event) => onChange(event.target.value as CategoryOption)}
      >
        <option value="all">Todas</option>
        {PRODUCT_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {CATEGORY_LABELS[category]}
          </option>
        ))}
      </select>
    </div>
  )
}
