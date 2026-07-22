import { ThemeProvider } from "./contexts/theme-context"
import { ThemeToggle } from "./components/theme-toggle"

export function App() {
  return (
    <ThemeProvider>
      <div className="app-shell">
        <header className="app-header">
          <span className="brand">
            Tech<span className="brand-accent">Mart</span>
          </span>
          <ThemeToggle />
        </header>
        <main className="app-main" />
      </div>
    </ThemeProvider>
  )
}
