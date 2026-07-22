import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import type { LoginInput, PublicUser, RegisterInput } from "../types/api"
import { loginUser, registerUser } from "../services/auth-api"
import { SESSION_EXPIRED_EVENT } from "../services/http"
import { clearSession, getStoredUser, setStoredUser, setTokens } from "../services/token-storage"

interface AuthContextValue {
  user: PublicUser | null
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(getStoredUser)

  useEffect(() => {
    const handleSessionExpired = () => setUser(null)
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [])

  const login = useCallback(async (input: LoginInput) => {
    const result = await loginUser(input)
    setTokens(result.accessToken, result.refreshToken)
    setStoredUser(result.user)
    setUser(result.user)
  }, [])

  const register = useCallback(
    async (input: RegisterInput) => {
      await registerUser(input)
      await login({ email: input.email, password: input.password })
    },
    [login],
  )

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider.")
  return context
}
