// src/Context/ThemeContext.jsx
import { createContext, useContext, useState } from "react"

export const themes = {
  dark: {
    bg:          "#0d0f14",
    sidebarBg:   "#0a0c11",
    navbarBg:    "rgba(13,15,20,0.85)",
    cardBg:      "#12151d",
    inputBg:     "#181c26",
    hoverBg:     "rgba(255,255,255,0.06)",
    border:      "rgba(255,255,255,0.08)",
    textPrimary: "#f0f2f8",
    textMuted:   "#6b7280",
    accent:      "#6366f1",
    accentGlow:  "rgba(99,102,241,0.45)",
  },
  light: {
    bg:          "#f5f6fa",
    sidebarBg:   "#ffffff",
    navbarBg:    "rgba(255,255,255,0.85)",
    cardBg:      "#ffffff",
    inputBg:     "#f0f1f5",
    hoverBg:     "rgba(0,0,0,0.04)",
    border:      "rgba(0,0,0,0.08)",
    textPrimary: "#0f1117",
    textMuted:   "#6b7280",
    accent:      "#6366f1",
    accentGlow:  "rgba(99,102,241,0.3)",
  },
}

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(
    // Read saved value from localStorage, fallback to "dark"
    () => localStorage.getItem("theme") || "dark"
  )

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark"
      localStorage.setItem("theme", next)   // Save on every toggle
      return next
    })
  }

  const theme = themes[mode]

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)