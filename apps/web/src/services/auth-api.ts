import type { LoginInput, LoginResponse, PublicUser, RegisterInput } from "../types/api"
import { request } from "./http"

export function registerUser(input: RegisterInput): Promise<{ user: PublicUser }> {
  return request<{ user: PublicUser }>("/auth/register", {
    method: "POST",
    body: input,
    auth: false,
  })
}

export function loginUser(input: LoginInput): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", { method: "POST", body: input, auth: false })
}
