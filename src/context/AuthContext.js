import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 1,
  name: "Admin MaizeFit",
  username: "admin",
  role: "Administrator",
  email: "admin@maizefit.com",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("maizefit_auth_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(user);

  useEffect(() => {
    if (user) {
      localStorage.setItem("maizefit_auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("maizefit_auth_user");
      localStorage.removeItem("maizefit_logged_in");
    }
  }, [user]);

  const login = async (username, password) => {
    // Akun Demo - siap diganti integrasi API backend nanti
    if (username === "admin" && password === "admin123") {
      setUser(DEMO_USER);
      return { success: true };
    }

    // Cek demo users dari localStorage (jika ada yang register)
    try {
      const demoUsers = JSON.parse(localStorage.getItem("maizefit_demo_users") || "[]");
      const found = demoUsers.find(
        (u) => u.username === username && u.password === password
      );
      if (found) {
        const loggedUser = {
          id: found.id || Date.now(),
          name: found.name || username,
          username: found.username,
          role: "Petugas",
          email: found.email || `${username}@maizefit.com`,
        };
        setUser(loggedUser);
        return { success: true };
      }
    } catch {
      // ignore
    }

    return {
      success: false,
      message: "Username atau password salah! (Demo: admin / admin123)",
    };
  };

  const register = async (userData) => {
    try {
      const demoUsers = JSON.parse(localStorage.getItem("maizefit_demo_users") || "[]");
      if (demoUsers.some((u) => u.username === userData.username)) {
        return { success: false, message: "Username sudah terdaftar!" };
      }
      demoUsers.push(userData);
      localStorage.setItem("maizefit_demo_users", JSON.stringify(demoUsers));
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
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
