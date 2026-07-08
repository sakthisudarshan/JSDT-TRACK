import { useEffect } from "react";
import AppRoutes from "./routes";
import { getSettings } from "./services/storageService";

function App() {
  useEffect(() => {
    // Load setting and apply theme
    const config = getSettings();
    if (config.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <AppRoutes />;
}

export default App;