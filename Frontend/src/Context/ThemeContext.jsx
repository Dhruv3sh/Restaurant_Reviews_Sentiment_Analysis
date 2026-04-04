// src/context/ThemeContext.jsx
import { createContext, useContext, useState } from "react"
 
// ── 1. Define all colors for both themes in one place ─────────────────────────
export const themes = {
  dark: {
    bg:         "#0d0f14",
    sidebarBg:  "#0a0c11",
    navbarBg:   "rgba(13,15,20,0.85)",
    cardBg:     "#12151d",
    inputBg:    "#181c26",
    hoverBg:    "rgba(255,255,255,0.06)",
    border:     "rgba(255,255,255,0.08)",
    textPrimary:"#f0f2f8",
    textMuted:  "#6b7280",
    accent:     "#6366f1",
    accentGlow: "rgba(99,102,241,0.45)",
  },
  light: {
    bg:         "#f5f6fa",
    sidebarBg:  "#ffffff",
    navbarBg:   "rgba(255,255,255,0.85)",
    cardBg:     "#ffffff",
    inputBg:    "#f0f1f5",
    hoverBg:    "rgba(0,0,0,0.04)",
    border:     "rgba(0,0,0,0.08)",
    textPrimary:"#0f1117",
    textMuted:  "#6b7280",
    accent:     "#6366f1",
    accentGlow: "rgba(99,102,241,0.3)",
  },
}
 
// ── 2. Create the context ──────────────────────────────────────────────────────
const ThemeContext = createContext(null)
 
// ── 3. Provider wraps the whole app ───────────────────────────────────────────
export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("dark")           // "dark" | "light"
  const toggleTheme = () => setMode((m) => m === "dark" ? "light" : "dark")
  const theme = themes[mode]                          // current color object
 
  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
 
// ── 4. Custom hook — use this in any component ────────────────────────────────
export const useTheme = () => useContext(ThemeContext)