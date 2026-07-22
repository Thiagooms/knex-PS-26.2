export type UserRole = "customer" | "seller"

export interface PublicUser {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export const PRODUCT_CATEGORIES = [
  "electronics",
  "computers",
  "phones",
  "accessories",
  "gaming",
  "home",
  "others",
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  electronics: "Eletrônicos",
  computers: "Computadores",
  phones: "Celulares",
  accessories: "Acessórios",
  gaming: "Games",
  home: "Casa",
  others: "Outros",
}

export interface Product {
  id: string
  name: string
  description: string
  price: string
  stock: number
  category: ProductCategory
  alreadySold: boolean
  createdAt: string
  updatedAt: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: PublicUser
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
}
