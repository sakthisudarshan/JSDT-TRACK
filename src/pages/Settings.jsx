import Layout from "../components/layout/layout";
import { useState, useEffect } from "react";
import { 
  getSettings, 
  saveSettings, 
  getTeamMembers, 
  saveTeamMembers 
} from "../services/storageService";

import { 
  Save, 
  UserPlus, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  Palette,
  Building,
  FolderOpen,
  Users,
  Cloud
} from "lucide-react";

function Settings() {
  // Settings states
  const [companyName, setCompanyName] = useState("");
  const [exportFolder, setExportFolder] = useState("");
  const [theme, setTheme] = useState("light");

  // Team members states
  const [members, setMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState("");
  
  // Member edit inline states
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const [success, setSuccess] = useState("");



  // Load configuration
  useEffect(() => {
    const config = getSettings();
    const membersList = getTeamMembers();
    Promise.resolve().then(() => {
      setCompanyName(config.companyName || "JSDT");
      setExportFolder(config.exportFolder || "C:\\JSDT Status Tracker\\Exports");
      setTheme(config.theme || "light");
      setMembers(membersList);
    });
  }, []);

  // Save Company and Folder Settings
  const handleSaveGeneral = (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      alert("Company Name is required.");
      return;
    }
    saveSettings({ companyName, exportFolder });
    triggerSuccess("General settings updated!");
  };

  // Save Theme Settings and apply class
  const handleSaveTheme = (newTheme) => {
    setTheme(newTheme);
    saveSettings({ theme: newTheme });
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    triggerSuccess(`Theme changed to ${newTheme}!`);
  };

  // Add a new Team Member
  const handleAddMember = (e) => {
    e.preventDefault();
    const name = newMemberName.trim();
    if (!name) return;

    if (members.some(m => m.toLowerCase() === name.toLowerCase())) {
      alert("Member name already exists.");
      return;
    }

    const updated = [...members, name];
    setMembers(updated);
    saveTeamMembers(updated);
    setNewMemberName("");
    triggerSuccess(`Added ${name} to team!`);
  };

  // Delete a Team Member
  const handleDeleteMember = (index) => {
    const name = members[index];
    if (confirm(`Remove ${name} from the team?`)) {
      const updated = members.filter((_, i) => i !== index);
      setMembers(updated);
      saveTeamMembers(updated);
      triggerSuccess(`Removed ${name} from team!`);
    }
  };

  // Start inline editing of member name
  const handleStartEditMember = (index, value) => {
    setEditingIndex(index);
    setEditingValue(value);
  };

  // Save edited member name
  const handleSaveEditMember = (index) => {
    const newVal = editingValue.trim();
    if (!newVal) return;

    const updated = [...members];
    updated[index] = newVal;
    setMembers(updated);
    saveTeamMembers(updated);
    setEditingIndex(null);
    triggerSuccess(`Renamed team member to ${newVal}!`);
  };

  const triggerSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };



  return (
    <Layout>
      <div className="max-w-6xl mx-auto animate-fade-in space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Workspace Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Configure project parameters, color modes, team roster, and cloud synchronization.
          </p>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-medium animate-pulse flex items-center gap-2">
            ✅ {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: General Settings & Themes */}
          <div className="space-y-8">
            
            {/* General Settings */}
            <form onSubmit={handleSaveGeneral} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-700/50 pb-3">
                <Building size={18} className="text-blue-500" />
                <span>General Workspace</span>
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. JSDT"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Export Folder (Future Ready)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <FolderOpen size={16} />
                  </span>
                  <input
                    type="text"
                    value={exportFolder}
                    onChange={(e) => setExportFolder(e.target.value)}
                    placeholder="C:\Exports"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Save size={16} />
                <span>Save Workspace</span>
              </button>
            </form>

            {/* Theme Customizer */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-700/50 pb-3">
                <Palette size={18} className="text-blue-500" />
                <span>Appearance / Theme</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {/* Light Theme Card */}
                <button
                  type="button"
                  onClick={() => handleSaveTheme("light")}
                  className={`p-4 border rounded-2xl text-left transition cursor-pointer flex flex-col justify-between h-28 relative ${
                    theme === "light" 
                      ? "border-blue-500 bg-blue-50/20 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 font-bold" 
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="text-sm font-semibold">Light Mode</span>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-6 rounded-lg border border-slate-300 dark:border-slate-700"></div>
                  {theme === "light" && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  )}
                </button>

                {/* Dark Theme Card */}
                <button
                  type="button"
                  onClick={() => handleSaveTheme("dark")}
                  className={`p-4 border rounded-2xl text-left transition cursor-pointer flex flex-col justify-between h-28 relative ${
                    theme === "dark" 
                      ? "border-blue-500 bg-blue-50/20 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 font-bold" 
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="text-sm font-semibold">Dark Mode</span>
                  <div className="w-full bg-slate-950 h-6 rounded-lg border border-slate-800"></div>
                  {theme === "dark" && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Cloud Sync Section */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-700/50 pb-3">
                <Cloud size={18} className="text-blue-500" />
                <span>Cloud Status</span>
              </h2>

              <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-850 rounded-2xl">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <div className="text-xs font-semibold">
                  Universally Synchronized
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                All team members opening this application share the exact same bug/task metrics database. Any changes you make will be visible on all teammates' screens instantly. No keys or configuration required.
              </p>
            </div>

          </div>

          {/* Right Column: Team Roster */}
          <div>
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-700/50 pb-3">
                <Users size={18} className="text-blue-500" />
                <span>Team Roster</span>
              </h2>

              <form onSubmit={handleAddMember} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter full name..."
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 transition text-sm cursor-pointer"
                >
                  <UserPlus size={16} />
                  <span>Add</span>
                </button>
              </form>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {members.map((name, i) => (
                  <div 
                    key={name}
                    className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 transition"
                  >
                    {editingIndex === i ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="flex-1 bg-white dark:bg-slate-900 border border-blue-400 dark:border-blue-500 rounded-lg px-2.5 py-1 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveEditMember(i)}
                          className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="p-1 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          {name}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEditMember(i, name)}
                            className="p-1.5 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 border border-slate-200 dark:border-slate-700/60 rounded-lg transition"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(i)}
                            className="p-1.5 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border border-slate-200 dark:border-slate-700/60 rounded-lg transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
}

export default Settings;