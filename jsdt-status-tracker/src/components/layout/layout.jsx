import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in a form input
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
      <Sidebar />

      <div className="ml-64 flex-1 min-h-screen">
        <Navbar />

        <div className="p-8">
          {children}
        </div>

      </div>
    </div>
  );
}

export default Layout;