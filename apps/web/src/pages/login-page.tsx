import { useState } from "react"
import type { FormEvent } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { ThemeToggle } from "../components/theme-toggle"
import { useAuth } from "../contexts/auth-context"
import { ApiError } from "../services/http"
import type { UserRole } from "../types/api"

type Mode = "login" | "register"

export function LoginPage() {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("customer")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (mode === "login") {
        await login({ email, password })
      } else {
        await register({ name, email, password, role })
      }
      navigate("/", { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Algo deu errado. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page-toggle">
        <ThemeToggle />
      </div>
      <main className="auth-card">
        <span className="brand">
          Tech<span className="brand-accent">Mart</span>
        </span>
        <p className="auth-subtitle">Entre para explorar o catálogo da loja.</p>
        <div className="auth-tabs">
          <button
            type="button"
            className="auth-tab"
            aria-pressed={mode === "login"}
            onClick={() => switchMode("login")}
          >
            Entrar
          </button>
          <button
            type="button"
            className="auth-tab"
            aria-pressed={mode === "register"}
            onClick={() => switchMode("register")}
          >
            Criar conta
          </button>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="field">
              <label className="field-label" htmlFor="auth-name">
                Nome
              </label>
              <input
                id="auth-name"
                className="field-input"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          )}
          <div className="field">
            <label className="field-label" htmlFor="auth-email">
              E-mail
            </label>
            <input
              id="auth-email"
              className="field-input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="auth-password">
              Senha
            </label>
            <input
              id="auth-password"
              className="field-input"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={mode === "register" ? 8 : undefined}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {mode === "register" && (
            <div className="field">
              <label className="field-label" htmlFor="auth-role">
                Quero usar a loja como
              </label>
              <select
                id="auth-role"
                className="field-input"
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
              >
                <option value="customer">Cliente</option>
                <option value="seller">Vendedor</option>
              </select>
            </div>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="button button-primary" disabled={submitting}>
            {submitting ? "Enviando…" : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>
      </main>
    </div>
  )
}
