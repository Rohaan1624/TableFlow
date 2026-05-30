// src/App.tsx
import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import { AuthPage } from "./auth/authPage"
import AccountConfirmedPage from "./auth/confirmation"
import OnboardingPage from "./pages/onboarding"
import ProtectedRoute from "./auth/protected"
import RequireOnboarding from "#components/requireOnboarding"
import RequireRestaurant from "#components/requireRestaurant"
import Dashboard from "./pages/Dashboard"
import MenuPage from "./pages/Menu"
import { DashboardLayout } from "./pages/dashboardLayout"
import PublicMenuPage from "./pages/publicMenu"
import MenuQRPage from "./pages/QRpage"
import FloorView from "./pages/Tables"
import KitchenView from "./pages/Kitchen"
import SettingsPage from "./pages/Settings"

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/confirmation" element={<AccountConfirmedPage />} />
      <Route path="/public-menu/:id" element={<PublicMenuPage />} />

      {/* Onboarding */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <RequireOnboarding>
              <OnboardingPage />
            </RequireOnboarding>
          </ProtectedRoute>
        }
      />

      {/* Dashboard (protected + requires restaurant) */}
      <Route
        element={
          <ProtectedRoute>
            <RequireRestaurant>
              <DashboardLayout />
            </RequireRestaurant>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/menu"       element={<MenuPage />} />
        <Route path="/qr-code"    element={<MenuQRPage />} />
        <Route path="/tables"     element={<FloorView />} />
        <Route path="/kitchen"    element={<KitchenView />} />
        <Route path="/settings"   element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App