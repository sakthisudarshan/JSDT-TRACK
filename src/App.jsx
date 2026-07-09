import { useEffect } from "react";
import AppRoutes from "./routes";
import { getSettings } from "./services/storageService";
import { syncOnStartup } from "./services/syncService";

function App() {
  useEffect(() => {
    // 1. Run smart bidirectional sync on startup
    syncOnStartup().then(() => {
      // 2. Load setting and apply theme
      const config = getSettings();
      if (config.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    });
  }, []);

  return <AppRoutes />;
}

export default App;