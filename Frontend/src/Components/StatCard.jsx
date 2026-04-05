// src/Components/StatCard.jsx
import { useTheme } from "../Context/ThemeContext"

const StatCard = ({ stat }) => {
  const { mode } = useTheme()
  const isDark = mode === "dark"

  return (
    <div
      className={`
        flex flex-col gap-3 rounded-[14px] p-5 cursor-default
        transition-all duration-150
        hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]
        border
        ${isDark
          ? "bg-[#12151d] border-white/8"
          : "bg-white border-black/8 shadow-sm"}
      `}
    >
      {/* Top row: icon + delta badge */}
      <div className="flex justify-between items-start">
        <span className={` text-xl ${isDark ? "text-white" : "text-black"} `}>{stat.icon}</span>
        <span
          className={`
            text-[11px] font-semibold px-2 py-0.5 rounded-full font-body
            ${stat.positive
              ? "text-emerald-500 bg-emerald-500/10"
              : "text-rose-500 bg-rose-500/10"}
          `}
        >
          {stat.delta}
        </span>
      </div>

      {/* Value + label */}
      <div>
        <p className={`text-2xl font-bold tracking-[-0.5px] font-display ${isDark ? "text-slate-100" : "text-slate-900"}`}>
          {stat.value}
        </p>
        <p className="text-xs mt-0.5 font-body text-slate-500">
          {stat.label}
        </p>
      </div>
    </div>
  )
}

export default StatCard