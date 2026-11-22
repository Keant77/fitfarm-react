import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

/**
 * Demo user tetap — siap diganti autentikasi backend.
 * Password TIDAK disimpan di state maupun localStorage.
 */
const DEMO_USER = {
  id: 1,
  name: "Admin MaizeFit",
  username: "admin",
  role: "Administrator",
  email: "admin@maizefit.com",
};

/**
 * Hardcoded demo accounts — hanya untuk pengembangan.
 * Saat backend sudah ada, seluruh blok ini diganti dengan
 * satu panggilan ke endpoint POST /auth/login.
 */
const DEMO_ACCOUNTS = [
  { username: "admin", password: "admin123", user: DEMO_USER },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("maizefit_auth_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(user);

  // Sinkronisasi user ke localStorage — hanya simpan profil, BUKAN password
  useEffect(() => {
    try {
      if (user) {
        // Pastikan password tidak ikut tersimpan
        const { password: _omit, ...safeUser } = user;
        localStorage.setItem("maizefit_auth_user", JSON.stringify(safeUser));
      } else {
        localStorage.removeItem("maizefit_auth_user");
      }
    } catch {
      // localStorage tidak tersedia (mode privat / kebijakan browser)
    }
  }, [user]);

  const login = async (username, password) => {
    // Cek akun demo hardcoded
    const match = DEMO_ACCOUNTS.find(
      (a) => a.username === username && a.password === password,
    );
    if (match) {
      setUser(match.user);
      return { success: true };
    }

    // Cek akun yang didaftarkan via register()
    // Hanya menyimpan flag keberadaan akun, bukan password plain-text
    try {
      const registeredAccounts = JSON.parse(
        localStorage.getItem("maizefit_registered_accounts") || "[]",
      );
      const found = registeredAccounts.find(
        (a) => a.username === username && a.passwordHash === btoa(password),
      );
      if (found) {
        const loggedUser = {
          id: found.id,
          name: found.name,
          username: found.username,
          role: "Petugas",
          email: found.email || `${found.username}@maizefit.com`,
        };
        setUser(loggedUser);
        return { success: true };
      }
    } catch {
      // abaikan — fallback ke pesan gagal
    }

    return {
      success: false,
      message: "Username atau password salah. (Demo: admin / admin123)",
    };
  };

  const register = async (userData) => {
    try {
      const accounts = JSON.parse(
        localStorage.getItem("maizefit_registered_accounts") || "[]",
      );

      if (accounts.some((a) => a.username === userData.username)) {
        return { success: false, message: "Username sudah terdaftar." };
      }

      // Simpan password sebagai base64 (bukan plain text).
      // Ini bukan enkripsi yang aman — hanya untuk demo.
      // Ganti dengan bcrypt / backend auth di produksi.
      const account = {
        id: Date.now(),
        name: userData.name,
        username: userData.username,
        email: userData.email,
        passwordHash: btoa(userData.password),
      };

      accounts.push(account);
      localStorage.setItem(
        "maizefit_registered_accounts",
        JSON.stringify(accounts),
      );

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};

export default AuthContext;
