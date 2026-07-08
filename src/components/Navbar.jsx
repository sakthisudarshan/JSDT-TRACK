import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSettings } from "../services/storageService";

function Navbar() {
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
    <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700/60 shadow-xs h-16 flex items-center justify-between px-8 transition-colors duration-200">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        <span className="text-blue-600 dark:text-blue-400 font-extrabold mr-1.5">{companyName}</span>
        <span className="text-slate-400 dark:text-slate-500 font-light">/</span>
        <span className="ml-1.5 font-semibold text-slate-800 dark:text-slate-200">{pageTitles[location.pathname]}</span>
      </h2>

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