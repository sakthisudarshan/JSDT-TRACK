import {
  LayoutDashboard,
  ClipboardList,
  History as HistoryIcon,
  FileBarChart,
  Settings as SettingsIcon,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useState, useEffect } from "react";
import { getSettings } from "../services/storageService";

function Sidebar({ isOpen, onClose }) {
  const [companyName, setCompanyName] = useState("JSDT");

  useEffect(() => {
    const config = getSettings();
    Promise.resolve().then(() => {
      setCompanyName(config.companyName || "JSDT");
    });
  }, []);

  const menu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/",
    },
    {
      name: "Daily Status",
      icon: <ClipboardList size={20} />,
      path: "/daily-status",
    },
    {
      name: "History",
      icon: <HistoryIcon size={20} />,
      path: "/history",
    },
    {
      name: "Reports",
      icon: <FileBarChart size={20} />,
      path: "/reports",
    },
    {
      name: "Settings",
      icon: <SettingsIcon size={20} />,
      path: "/settings",
    },
  ];

  return (
    <div className={`w-64 h-screen bg-slate-950 text-white p-6 fixed border-r border-slate-900 shadow-xl no-print top-0 left-0 transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`}>

      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <span className="bg-blue-650 px-2.5 py-1 rounded-xl text-sm font-black text-white">J</span>
          <span>{companyName}</span>
        </h1>
        {/* Close Button on Mobile */}
        <button 
          onClick={onClose}
          className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          title="Close Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">

        {menu.map((item) => (

          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-700"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>

        ))}

      </div>

    </div>
  );
}

export default Sidebar;