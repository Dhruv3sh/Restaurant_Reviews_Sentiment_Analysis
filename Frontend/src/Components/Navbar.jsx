// src/Components/Navbar.jsx
import { PAGES } from "../Constants";
import { useTheme } from "../Context/ThemeContext";

const Navbar = ({ activePage, onMenuClick }) => {
  const { mode, toggleTheme } = useTheme();
  const page = PAGES[activePage] || PAGES["dashboard"];

  return (
    <header
      className={`h-16 flex items-center justify-between px-4 md:px-7 border-b  shrink-0 sticky top-0 z-30 backdrop-blur-xl ${mode == "dark" ? "bg-[#0d0f14]  border-white/8" : "bg-slate-50  border-black/8"} bg-[#0d0f14]/85`}
    >
      {/* ── Left: Hamburger + Breadcrumb ── */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-100 transition-colors duration-150 rounded-lg hover:bg-white/5"
        >
          <span className="text-xl leading-none">☰</span>
        </button>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-sm font-body">
          <span className={`${mode == "dark" ? "text-slate-100" : "text-slate-900"}`}>Workspace</span>
          <span className={`${mode == "dark" ? "text-slate-100" : "text-slate-900"}`}>/</span>
          <span className={` font-semibold ${mode == "dark" ? "text-slate-100" : "text-slate-900"}`}>{page.title}</span>
        </div>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-2">
        {/* Search — tablet and up */}
        <div
          className={`hidden md:flex items-center gap-2  ${mode == "dark" ? "bg-[#181c26] " : "bg-slate-50 border  border-black/8"} rounded-lg px-3 py-1.75`}
        >
          <span className="text-slate-500 text-sm select-none">⌕</span>
          <input
            placeholder="Search…"
            className={`
              bg-transparent outline-none text-[13px] w-24 lg:w-36 font-body
              placeholder:text-slate-400
              ${mode == "dark" ? "text-slate-100" : "text-slate-900"}
             `}
          />
          
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={
            mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
          className={`flex items-center justify-center w-9 h-9 rounded-lg  bg-transparent text-slate-500 hover:text-slate-100 hover:bg-white/5 transition-all duration-150 cursor-pointer text-base ${mode === "dark" ? "border border-white/8" : "bg-slate-50 border border-black/8" }`}
        >
          {mode === "dark" ? "☀️" : "🌙"}
        </button>

        {/* Notification Bell */}
        <button className={`relative flex items-center justify-center w-9 h-9 rounded-lg bg-transparent text-slate-500 hover:text-slate-100 hover:bg-white/5 transition-colors duration-150 cursor-pointer  ${mode === "dark" ? "border border-white/8" : "bg-slate-50 border border-black/8" }`}>
          <span className="text-sm">🔔</span>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_6px_rgba(99,102,241,0.7)]" />
        </button>

        {/* Avatar */}
        <div className="flex items-center justify-center w-9 h-9 rounded-full text-[13px] font-bold text-white cursor-pointer bg-linear-to-br from-indigo-500 to-violet-400 border-2 border-white/10 shrink-0">
          JD
        </div>
      </div>
    </header>
  );
};

export default Navbar;
