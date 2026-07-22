import type { RefreshResponse } from "../types/api"
import { clearSession, getAccessToken, getRefreshToken, setTokens } from "./token-storage"

const API_URL = import.meta.env.VITE_API_URL ?? ""

export const SESSION_EXPIRED_EVENT = "techmart:session-expired"

interface ApiErrorPayload {
  message: string
  details?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly details?: unknown

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message)
    this.name = "ApiError"
    this.status = status
    this.details = payload.details
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: unknown
  auth?: boolean
}

let refreshInFlight: Promise<boolean> | null = null

async function tryRefreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
    if (!response.ok) return false
    const data = (await response.json()) as RefreshResponse
    setTokens(data.accessToken, data.refreshToken)
    return true
  } catch {
    return false
  }
}

async function execute(path: string, options: RequestOptions): Promise<Response> {
  const headers: Record<string, string> = {}
  if (options.body !== undefined) headers["Content-Type"] = "application/json"
  if (options.auth !== false) {
    const token = getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  try {
    return await fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new ApiError(0, {
      message: "Não foi possível conectar ao servidor. Verifique sua conexão.",
    })
  }
}

async function parseErrorPayload(response: Response): Promise<ApiErrorPayload> {
  const fallback = { message: "Erro inesperado ao falar com o servidor. Tente novamente." }
  try {
    const data = (await response.json()) as { error?: ApiErrorPayload }
    return data.error?.message ? data.error : fallback
  } catch {
    return fallback
  }
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let response = await execute(path, options)

  if (response.status === 401 && options.auth !== false) {
    refreshInFlight ??= tryRefreshTokens().finally(() => {
      refreshInFlight = null
    })
    const refreshed = await refreshInFlight

    if (refreshed) {
      response = await execute(path, options)
    } else {
      clearSession()
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
      throw new ApiError(401, { message: "Sua sessão expirou. Entre novamente." })
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorPayload(response))
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
