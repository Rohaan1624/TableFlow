import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/protected";
import { LoginForm } from "#components/loginForm";
import { AuthPage } from "./auth/authPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />

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