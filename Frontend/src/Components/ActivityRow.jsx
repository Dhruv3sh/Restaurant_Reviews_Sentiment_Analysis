// src/Components/ActivityRow.jsx
import { useTheme } from "../Context/ThemeContext"

const ActivityRow = ({ item, isLast }) => {
  const { mode } = useTheme()
  const isDark = mode === "dark"

  return (
    <div
      className={`
        flex items-center gap-3.5 py-3
        ${!isLast && (isDark ? "border-b border-white/6" : "border-b border-black/6")}
      `}
    >
      {/* Avatar circle — dynamic hue via inline style (no Tailwind equivalent for hsl) */}
      <div
        className="shrink-0 w-9 h-9 rounded-full opacity-85"
        style={{ background: `hsl(${item.hue}, 70%, 50%)` }}
      />

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-medium font-body ${isDark ? "text-slate-100" : "text-slate-900"}`}>
          {item.label}
        </p>
        <p className="text-[11px] mt-0.5 font-body text-slate-500">
          Total Reviews given {item.hue}
        </p>
      </div>

      {/* Tag badge */}
      <span
        className={`
          text-[11px] rounded-full px-2.5 py-0.5 font-body text-slate-500 shrink-0
          ${isDark ? "border border-white/8" : "border border-black/8"}
        `}
      >
        {item.time}
      </span>
    </div>
  )
}

export default ActivityRow