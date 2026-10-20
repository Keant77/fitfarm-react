
import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { AdvancedThemeProvider } from "./context/AdvancedThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./App.css";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Indikator from "./pages/Indikator";
import Aturan from "./pages/Aturan";

function App() {
  const [halaman, setHalaman] = useState(() => {
    const sudahLogin = localStorage.getItem("maizefit_logged_in");

    return sudahLogin === "true" ? "dashboard" : "login";
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

          {/* DATA INDIKATOR */}
          {halaman === "indikator" && (
            <Indikator
              onBack={() => setHalaman("masterData")}
            />
          )}

          {/* DATA ATURAN */}
          {halaman === "aturan" && (
            <Aturan
              onBack={() => setHalaman("masterData")}
            />
          )}
        </NotificationProvider>
      </AdvancedThemeProvider>
    </ThemeProvider>
  );
}

export default App;
