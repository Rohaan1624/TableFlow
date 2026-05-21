import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/protected";
import { AuthPage } from "./auth/authPage";
import AccountConfirmedPage from "./auth/confirmation";
import OnboardingPage from "./pages/onboarding";
import RequireOnboarding from "#components/requireOnboarding";
import Dashboard from "./pages/Dashboard";
import RequireRestaurant from "#components/requireRestaurant";


function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/confirmation" element={<AccountConfirmedPage />} />
      <Route path="/onboarding"
        element={
          <ProtectedRoute>
            <RequireOnboarding >
              <OnboardingPage />
            </RequireOnboarding>
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <RequireRestaurant>
              <Dashboard />
            </RequireRestaurant>
          </ProtectedRoute>
        }
      >
        {/* <Route path="/" element={<FacturaListView />} />
        <Route path="/resumen" element={<Resumen />} />
        <Route path="/productos" element={<ReferenciasListView />} />
        <Route path="/clientes" element={<ClientesListView />} />
        <Route path="/compras" element={<CompraListView />}></Route>
        <Route path="/e-facturas" element={<FacturaWizard />}></Route> */}
      </Route>

      {/* <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<FacturaListView />} />
        <Route path="/resumen" element={<Resumen />} />
        <Route path="/productos" element={<ReferenciasListView />} />
        <Route path="/clientes" element={<ClientesListView/>} />
        <Route path="/compras" element={<CompraListView />}></Route>
        <Route path="/e-facturas" element={<FacturaWizard />}></Route>
      </Route> */}

    </Routes>
  );
}

export default App;