import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";

const ThemeContext = createContext();

const THEME_DEFAULTS = {
  primary: "#0F6D3A",
  secondary: "#F4C430",
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem("app-theme") || "light";
    } catch {
      return "light";
    }
  });

  const [primaryColor, setPrimaryColorState] = useState(() => {
    try {
      return localStorage.getItem("app-primary-color") || THEME_DEFAULTS.primary;
    } catch {
      return THEME_DEFAULTS.primary;
    }
  });

  const [secondaryColor, setSecondaryColorState] = useState(() => {
    try {
      return localStorage.getItem("app-secondary-color") || THEME_DEFAULTS.secondary;
    } catch {
      return THEME_DEFAULTS.secondary;
    }
  });

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
  }, []);

  const setPrimaryColor = useCallback((color) => {
    setPrimaryColorState(color);
    try {
      localStorage.setItem("app-primary-color", color);
    } catch {}
  }, []);

  const setSecondaryColor = useCallback((color) => {
    setSecondaryColorState(color);
    try {
      localStorage.setItem("app-secondary-color", color);
    } catch {}
  }, []);

  const resetTheme = useCallback(() => {
    setThemeState("light");
    setPrimaryColorState(THEME_DEFAULTS.primary);
    setSecondaryColorState(THEME_DEFAULTS.secondary);
    try {
      localStorage.removeItem("app-primary-color");
      localStorage.removeItem("app-secondary-color");
      localStorage.setItem("app-theme", "light");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("app-theme", theme);
    } catch {}

    document.body.className = theme;
    document.documentElement.style.setProperty("--primary", primaryColor);
    document.documentElement.style.setProperty("--accent", secondaryColor);
  }, [theme, primaryColor, secondaryColor]);

  const isDark = theme === "dark";

  const contextValue = useMemo(
    () => ({
      theme,
      mode: theme,
      isDark,
      isLight: !isDark,
      toggleTheme,
      setTheme,
      primaryColor,
      secondaryColor,
      setPrimaryColor,
      setSecondaryColor,
      resetTheme,
    }),
    [
      theme,
      isDark,
      toggleTheme,
      setTheme,
      primaryColor,
      secondaryColor,
      setPrimaryColor,
      setSecondaryColor,
      resetTheme,
    ]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Alias untuk kompatibilitas
export const useAdvancedTheme = useTheme;

export default ThemeContext;
