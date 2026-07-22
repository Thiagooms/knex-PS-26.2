export type UserRole = "customer" | "seller"

export interface PublicUser {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: string
  stock: number
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
