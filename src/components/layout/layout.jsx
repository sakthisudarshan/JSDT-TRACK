import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === "INPUT" || 
        activeEl.tagName === "TEXTAREA" || 
        activeEl.tagName === "SELECT" ||
        activeEl.isContentEditable
      );

      if (e.altKey && !isInput) {
        switch (e.key.toLowerCase()) {
          case "d":
            e.preventDefault();
            navigate("/");
            break;
          case "s":
            e.preventDefault();
            navigate("/daily-status");
            break;
          case "h":
            e.preventDefault();
            navigate("/history");
            break;
          case "r":
            e.preventDefault();
            navigate("/reports");
            break;
          case "t":
            e.preventDefault();
            navigate("/settings");
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div className="flex bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
      
      {/* Sidebar Panel */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Sidebar backdrop screen mask */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content body container */}
      <div className="ml-0 lg:ml-64 flex-1 min-h-screen flex flex-col w-full overflow-x-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>

      </div>
    </div>
  );
}

export default Layout;