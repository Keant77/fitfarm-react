import React, {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useEffect,
} from "react";

/* =================================
   ACTION TYPES
================================= */

const THEME_ACTIONS = {
  TOGGLE_THEME: "TOGGLE_THEME",
  SET_THEME: "SET_THEME",
  SET_PRIMARY_COLOR: "SET_PRIMARY_COLOR",
  SET_SECONDARY_COLOR: "SET_SECONDARY_COLOR",
  RESET_THEME: "RESET_THEME",
};

/* =================================
   THEME COLORS
================================= */

const themes = {
  light: {
    primary: "#0F6D3A",
    primaryDark: "#0B4F2A",
    primaryLight: "#EAF6EF",

    accent: "#F4C430",
    accentLight: "#FFF8E1",

    background: "#F9FAFB",
    surface: "#FFFFFF",

    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    textHint: "#9CA3AF",

    border: "#E5E7EB",

    success: "#16A34A",
    warning: "#F59E0B",
    error: "#DC2626",
  },

  dark: {
    primary: "#087C51",
    primaryDark: "#064A2B",
    primaryLight: "#123C2C",

    accent: "#F4C430",
    accentLight: "#3D3415",

    background: "#111827",
    surface: "#1F2937",

    textPrimary: "#F9FAFB",
    textSecondary: "#D1D5DB",
    textHint: "#9CA3AF",

    border: "#374151",

    success: "#22C55E",
    warning: "#F59E0B",
    error: "#F87171",
  },
};

/* =================================
   INITIAL THEME
================================= */

const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem("app-theme");

    if (savedTheme === "dark") {
      return "dark";
    }

    return "light";
  } catch (error) {
    return "light";
  }
};

/* =================================
   INITIAL STATE
================================= */

const initialMode = getInitialTheme();

const initialState = {
  mode: initialMode,
  themes: themes,
  primaryColor: themes[initialMode].primary,
  secondaryColor: themes[initialMode].accent,
};

/* =================================
   THEME REDUCER
================================= */

const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.TOGGLE_THEME: {
      const newMode =
        state.mode === "light" ? "dark" : "light";

      return {
        ...state,
        mode: newMode,
      };
    }

    case THEME_ACTIONS.SET_THEME:
      return {
        ...state,
        mode: action.payload,
      };

    case THEME_ACTIONS.SET_PRIMARY_COLOR:
      return {
        ...state,
        primaryColor: action.payload,
      };

    case THEME_ACTIONS.SET_SECONDARY_COLOR:
      return {
        ...state,
        secondaryColor: action.payload,
      };

    case THEME_ACTIONS.RESET_THEME:
      return {
        ...state,
        mode: "light",
        primaryColor: themes.light.primary,
        secondaryColor: themes.light.accent,
      };

    default:
      return state;
  }
};

/* =================================
   CONTEXT
================================= */

const AdvancedThemeContext = createContext();

/* =================================
   PROVIDER
================================= */

export const AdvancedThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    themeReducer,
    initialState
  );

  /* =================================
     CURRENT COLORS
  ================================= */

  const colors = state.themes[state.mode];

  /* =================================
     THEME ACTIONS
  ================================= */

  const toggleTheme = () => {
    dispatch({
      type: THEME_ACTIONS.TOGGLE_THEME,
    });
  };

  const setTheme = (theme) => {
    dispatch({
      type: THEME_ACTIONS.SET_THEME,
      payload: theme,
    });
  };

  const setPrimaryColor = (color) => {
    dispatch({
      type: THEME_ACTIONS.SET_PRIMARY_COLOR,
      payload: color,
    });
  };

  const setSecondaryColor = (color) => {
    dispatch({
      type: THEME_ACTIONS.SET_SECONDARY_COLOR,
      payload: color,
    });
  };

  const resetTheme = () => {
    dispatch({
      type: THEME_ACTIONS.RESET_THEME,
    });
  };

  /* =================================
     SAVE THEME
  ================================= */
useEffect(() => {
  try {
    localStorage.setItem(
      "app-theme",
      state.mode
    );

    document.body.className = state.mode;

    document.documentElement.style.setProperty(
      "--primary",
      state.primaryColor
    );

    document.documentElement.style.setProperty(
      "--accent",
      state.secondaryColor
    );
  } catch (error) {
    console.error(
      "Gagal menyimpan theme:",
      error
    );
  }
}, [
  state.mode,
  state.primaryColor,
  state.secondaryColor,
]);

  /* =================================
     MEMOIZED CONTEXT VALUE
  ================================= */

  const contextValue = useMemo(
    () => ({
      theme: state.mode,
      mode: state.mode,
      colors,

      primaryColor: state.primaryColor,
      secondaryColor: state.secondaryColor,

      toggleTheme,
      setTheme,
      setPrimaryColor,
      setSecondaryColor,
      resetTheme,

      isDark: state.mode === "dark",
      isLight: state.mode === "light",
    }),
    [
      state.mode,
      state.primaryColor,
      state.secondaryColor,
      colors,
    ]
  );

  return (
    <AdvancedThemeContext.Provider
      value={contextValue}
    >
      {children}
    </AdvancedThemeContext.Provider>
  );
};

/* =================================
   CUSTOM HOOK
================================= */

export const useAdvancedTheme = () => {
  const context = useContext(
    AdvancedThemeContext
  );

  if (!context) {
    throw new Error(
      "useAdvancedTheme harus digunakan di dalam AdvancedThemeProvider"
    );
  }

  return context;
};

export default AdvancedThemeContext;