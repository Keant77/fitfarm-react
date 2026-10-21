
import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { AdvancedThemeProvider } from "./context/AdvancedThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./App.css";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  
const [halaman, setHalaman] = useState(() => {
  const sudahLogin = localStorage.getItem("maizefit_logged_in");

  if (sudahLogin !== "true") {
    return "login";
  }

  // Semua halaman setelah login ditangani di dalam AdminDashboard.
  // Nilai halaman lama seperti "indikator" atau "aturan" kembali ke dashboard,
  // sedangkan AdminDashboard memulihkan halaman internal yang valid.
  return "dashboard";
});


  const handleLogin = (username, password) => {
    // LOGIN SEMENTARA
    // Nanti akan diganti dengan backend

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("maizefit_logged_in", "true");
      setHalaman("dashboard");
      return true;
    }

    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem("maizefit_logged_in");
    localStorage.removeItem("maizefit_halaman");
    setHalaman("login");
  };

  return (
    <ThemeProvider>
      <AdvancedThemeProvider>
        <NotificationProvider>
          {/* LOGIN */}
          {halaman === "login" && (
            <Login
              onLogin={handleLogin}
              onRegister={() => alert("Halaman Register")}
            />
          )}

          {/* DASHBOARD ADMIN */}
          {halaman === "dashboard" && (
            <AdminDashboard onLogout={handleLogout} />
          )}

        </NotificationProvider>
      </AdvancedThemeProvider>
    </ThemeProvider>
  );
}

export default App;
