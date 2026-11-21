import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./App.css";

// Layouts
import AdminLayout from "./layouts/AdminLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import MasterData from "./pages/admin/MasterData";
import User from "./pages/admin/User";
import Role from "./pages/admin/Role";
import Kecamatan from "./pages/admin/Kecamatan";
import Lahan from "./pages/admin/Lahan";
import Indikator from "./pages/admin/Indikator";
import Aturan from "./pages/admin/Aturan";
import RiwayatPenilaian from "./pages/admin/RiwayatPenilaian";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC AUTH ROUTES */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* PROTECTED NESTED ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="master" element={<MasterData />} />
        <Route path="user" element={<User />} />
        <Route path="role" element={<Role />} />
        <Route path="kecamatan" element={<Kecamatan />} />
        <Route path="lahan" element={<Lahan />} />
        <Route path="indikator" element={<Indikator />} />
        <Route path="aturan" element={<Aturan />} />
        <Route path="riwayat" element={<RiwayatPenilaian />} />
      </Route>

      {/* ROOT REDIRECT */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
