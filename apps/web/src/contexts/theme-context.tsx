import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

export type ThemePreference = "light" | "dark"

const THEME_KEY = "techmart.theme"

function getStoredPreference(): ThemePreference {
  return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light"
}

interface ThemeContextValue {
  preference: ThemePreference
  setPreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(getStoredPreference)

  useEffect(() => {
    document.documentElement.dataset.theme = preference
  }, [preference])

  const setPreference = useCallback((next: ThemePreference) => {
    localStorage.setItem(THEME_KEY, next)
    setPreferenceState(next)
  }, [])

  const value = useMemo(() => ({ preference, setPreference }), [preference, setPreference])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme deve ser usado dentro de ThemeProvider.")
  return context
}
