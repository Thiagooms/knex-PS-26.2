import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AppLayout } from "./components/app-layout"
import { ProtectedRoute } from "./components/protected-route"
import { AuthProvider } from "./contexts/auth-context"
import { ThemeProvider } from "./contexts/theme-context"
import { CatalogPage } from "./pages/catalog-page"
import { LoginPage } from "./pages/login-page"

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<CatalogPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
