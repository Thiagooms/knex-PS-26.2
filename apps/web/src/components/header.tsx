import { Link } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { ThemeToggle } from "./theme-toggle"

const ROLE_LABELS = { customer: "cliente", seller: "vendedor" } as const

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="app-header">
      <Link to="/" className="brand">
        Tech<span className="brand-accent">Mart</span>
      </Link>
      <div className="app-header-actions">
        <ThemeToggle />
        {user && (
          <>
            <span className="user-chip">
              {user.name} <span className="user-chip-role">{ROLE_LABELS[user.role]}</span>
            </span>
            <button type="button" className="button button-secondary" onClick={logout}>
              Sair
            </button>
          </>
        )}
      </div>
    </header>
  )
}
