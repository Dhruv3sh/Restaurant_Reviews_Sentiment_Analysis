// src/Components/Sidebar.jsx
import { NavLink } from "react-router-dom"
import { NAV_ITEMS } from "../Constants"
import { useTheme } from "../Context/ThemeContext"

// isOpen  → mobile slide-in visibility
// collapsed → desktop collapsed width
const Sidebar = ({ isOpen, onClose, collapsed, onToggle, active, onNav }) => {
  const { mode } = useTheme()

  const isDark = mode === "dark"

  return (
    <>
      {/* 1. Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* 2. Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 md:sticky md:top-0
          flex flex-col shrink-0 overflow-hidden h-screen
          border-r transition-all duration-300 ease-in-out
          w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "md:w-20" : "md:w-64"}
          ${isDark
            ? "bg-[#0a0c11] border-white/8"
            : "bg-white border-black/8"}
        `}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center gap-3 px-5 shrink-0 border-b ${isDark ? "border-white/8" : "border-black/8"}`}>
          <div className="flex items-center justify-center shrink-0 w-8 h-8 bg-indigo-500 rounded-[10px] shadow-[0_0_18px_rgba(99,102,241,0.45)] text-white text-sm">
            ✦
          </div>
          <span
            className={`
              font-bold text-[17px] tracking-[-0.5px] whitespace-nowrap font-display transition-opacity duration-300
              ${collapsed ? "md:opacity-0 md:pointer-events-none" : "opacity-100"}
              ${isDark ? "text-slate-100" : "text-slate-900"}
            `}
          >
            RRS
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-2.5 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id
            return (
              <NavLink key={item.id} to={item.href}>
                <button
                key={item.id}
                onClick={() => {
                  onNav(item.id)
                  if (window.innerWidth < 768) onClose()
                }}
                className={`
                  flex items-center gap-3 w-full px-3.5 py-2.5 text-sm rounded-[10px]
                  transition-all duration-150 whitespace-nowrap text-left
                  ${isActive
                    ? "bg-indigo-500 text-white shadow-[0_0_14px_rgba(99,102,241,0.45)] font-semibold"
                    : isDark
                      ? "text-slate-500 hover:bg-white/5 hover:text-slate-100"
                      : "text-slate-900 hover:bg-black/5 hover:text-slate-900"
                  }
                `}
              >
                <span className="text-[18px] shrink-0">{item.icon}</span>
                <span
                  className={`transition-opacity duration-300 ${collapsed ? "md:opacity-0 md:pointer-events-none" : "opacity-100"}`}
                >
                  {item.label}
                </span>
              </button>
              </NavLink>
            )
          })}
        </nav>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggle}
          className={`
            hidden md:flex items-center gap-2.5 m-2.5 p-2.5 text-sm rounded-[10px]
            border transition-all duration-150
            ${isDark
              ? "text-slate-500 border-white/8 hover:bg-white/5 hover:text-slate-100"
              : "text-slate-500 border-black/8 hover:bg-black/5 hover:text-slate-900"
            }
          `}
        >
          <span className={`text-base transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}>
            ›
          </span>
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>
    </>
  )
}

export default Sidebar