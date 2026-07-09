import { useEffect } from "react";
import AppRoutes from "./routes";
import { getSettings } from "./services/storageService";
import { pullFromCloud } from "./services/syncService";

function App() {
  useEffect(() => {
    // 1. Sync all storage data from cloud bucket on load
    pullFromCloud().then(() => {
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