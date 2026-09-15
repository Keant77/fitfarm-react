import { useState } from "react";
import "./App.css";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Indikator from "./pages/Indikator";
import Aturan from "./pages/Aturan";

function App() {
  const [halaman, setHalaman] = useState("login");

  const handleLogin = (username, password) => {

  // LOGIN SEMENTARA
  // Nanti akan diganti dengan backend

  if (username === "admin" && password === "admin123") {
    setHalaman("dashboard");
    return true;
  }

  return false;
};

  const handleLogout = () => {
    setHalaman("login");
  };

  return (
    <>
      {/* LOGIN */}
      {halaman === "login" && (
        <Login
          onLogin={handleLogin}
          onRegister={() => alert("Halaman Register")}
        />
      )}

      {/* DASHBOARD ADMIN */}
      {halaman === "dashboard" && (
        <AdminDashboard
          onLogout={handleLogout}
        />
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
    </>
  );
}

export default App;