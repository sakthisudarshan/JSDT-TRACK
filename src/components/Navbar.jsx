import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSettings } from "../services/storageService";
import { Menu } from "lucide-react";

function Navbar({ onMenuToggle }) {
  const location = useLocation();
  const [companyName, setCompanyName] = useState("JSDT");

  useEffect(() => {
    // Keep setting in sync
    const config = getSettings();
    Promise.resolve().then(() => {
      setCompanyName(config.companyName || "JSDT");
    });
  }, []); // runs on mount

  const pageTitles = {
    "/": "Dashboard",
    "/daily-status": "Daily Status",
    "/history": "History",
    "/reports": "Reports",
    "/settings": "Settings",
  };

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700/60 shadow-xs h-16 flex items-center justify-between px-4 sm:px-8 transition-colors duration-200">
      
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-xl transition cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <span className="text-blue-600 dark:text-blue-400 font-extrabold">{companyName}</span>
          <span className="text-slate-400 dark:text-slate-500 font-light">/</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px] sm:max-w-none">
            {pageTitles[location.pathname]}
          </span>
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm tracking-wide">
          SS
        </div>

        <div className="hidden sm:block">
          <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
            Sakthi Sudarshan
          </p>

          <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
            QA Engineer
          </p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;