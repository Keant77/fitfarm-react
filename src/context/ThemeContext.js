import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";

// 1. Membuat Context
const ThemeContext = createContext();

// 2. Membuat Provider
export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    try {
      const savedTheme = localStorage.getItem("app-theme");
      return savedTheme ? savedTheme : "light";
    } catch (error) {
      return "light";
    }
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Mengubah theme
  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "light" ? "dark" : "light"
    );
  };

  // Mengubah theme secara langsung
  const setThemeDirect = (newTheme) => {
    setTheme(newTheme);
  };

  // Menyimpan theme
  useEffect(() => {
    try {
      localStorage.setItem("app-theme", theme);
    } catch (error) {
      console.error("Gagal menyimpan theme:", error);
    }

    document.body.className = theme;
  }, [theme]);

  // Data yang dibagikan melalui Context
  const contextValue = {
    theme,
    toggleTheme,
    setTheme: setThemeDirect,
    isDark: theme === "dark",
    isLight: theme === "light",
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Custom Hook untuk menggunakan Context
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme harus digunakan di dalam ThemeProvider"
    );
  }

  return context;
};

export default ThemeContext;