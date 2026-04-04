// src/Pages/Home.jsx
import StatCard from "../Components/StatCard"
import ActivityRow from "../Components/ActivityRow"
import { PAGES, STATS, ACTIVITY } from "../Constants"
import { useTheme } from "../Context/ThemeContext"

const Home = ({ activePage }) => {
  const { mode } = useTheme()
  const isDark = mode === "dark"
  const page = PAGES[activePage] || PAGES["dashboard"]

  return (
    <main className={`flex-1 overflow-y-auto p-2 pl-6 ${isDark ? "bg-[#0d0f14]" : "bg-slate-50"}`}>

      {/* Page Header */}
      <div className="mb-10">
        <h1 className={`text-[28px] font-bold tracking-[-0.8px] font-display ${isDark ? "text-slate-100" : "text-slate-900"}`}>
          {page.title}
        </h1>
        <p className="text-sm mt-1.5 font-body text-slate-500">
          {page.desc}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Activity Panel */}
      <div
        className={`
          rounded-[14px] p-7 border
          ${isDark
            ? "bg-[#12151d] border-white/8"
            : "bg-white border-black/8 shadow-sm"}
        `}
      >
        {/* Panel header */}
        <div className="flex justify-between items-center mb-5">
          <span className={`text-base font-semibold font-display ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            Recent Activity
          </span>
          <button
            className={`
              text-xs rounded-lg px-3.5 py-1.5 font-body border
              text-slate-500 bg-transparent cursor-pointer
              transition-colors duration-150
              ${isDark
                ? "border-white/8 hover:bg-white/5 hover:text-slate-100"
                : "border-black/8 hover:bg-black/5 hover:text-slate-900"}
            `}
          >
            View all →
          </button>
        </div>

        {/* Rows */}
        {ACTIVITY.map((item, i) => (
          <ActivityRow
            key={item.id}
            item={item}
            isLast={i === ACTIVITY.length - 1}
          />
        ))}
      </div>

    </main>
  )
}

export default Home