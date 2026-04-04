import { useState, cloneElement } from "react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import { useTheme } from "../Context/ThemeContext";

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const { theme,mode  } = useTheme()
  return (
    <>
      <div className={`flex min-h-screen text-[#f0f2f8] ${mode == "dark" ? "bg-[#0d0f14]" : "bg-slate-50"} text-[${theme.textPrimary}]`}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          collapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          active={activePage}
          onNav={setActivePage}
        />

        {/* Right column */}
        <div className="flex flex-col flex-1 min-w-0">
          <Navbar 
          activePage={activePage} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
          <main className={`flex-1 p-4 md:p-1 overflow-y-auto ${mode == "dark" ? "bg-[#0d0f14]" : "bg-slate-50"} text-[${theme.textPrimary}]`}>
            {cloneElement(children, { activePage })}
          </main>
        </div>

      </div>
    </>
  )
}

export default Layout