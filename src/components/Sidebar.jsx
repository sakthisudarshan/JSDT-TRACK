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

function Sidebar() {
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
    <div className="w-64 h-screen bg-slate-950 text-white p-6 fixed border-r border-slate-900 shadow-xl no-print">

      <h1 className="text-2xl font-black mb-10 tracking-tight text-white flex items-center gap-2">
        <span className="bg-blue-650 px-2.5 py-1 rounded-xl text-sm font-black text-white">J</span>
        <span>{companyName}</span>
      </h1>

      <div className="space-y-3">

        {menu.map((item) => (

          <NavLink
            key={item.name}
            to={item.path}
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