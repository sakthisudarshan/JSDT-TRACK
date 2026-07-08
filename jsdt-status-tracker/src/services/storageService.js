import defaultTeamMembers from "../data/teamMembers";

const STORAGE_KEY = "jsdt-status-data";
const SETTINGS_KEY = "jsdt-settings";
const MEMBERS_KEY = "jsdt-team-members";

// Get all entries
export const getEntries = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Save a new entry
export const saveEntry = (entry) => {
  const entries = getEntries();

  entries.push({
    id: Date.now(),
    date: new Date().toLocaleDateString("en-GB"),
    ...entry,
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

// Replace all entries (used for edit/delete later)
export const saveEntries = (entries) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

// Delete one entry
export const deleteEntry = (id) => {
  const entries = getEntries().filter((item) => item.id !== id);
  saveEntries(entries);
};

// Get one entry by ID (useful for editing later)
export const getEntryById = (id) => {
  return getEntries().find((item) => item.id === id);
};

// Settings CRUD
export const getSettings = () => {
  const settings = localStorage.getItem(SETTINGS_KEY);
  const defaultSettings = {
    companyName: "JSDT",
    theme: "light",
    exportFolder: "C:\\JSDT Status Tracker\\Exports"
  };
  return settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
};

export const saveSettings = (settings) => {
  const current = getSettings();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
};

// Team Members CRUD in LocalStorage
export const getTeamMembers = () => {
  const members = localStorage.getItem(MEMBERS_KEY);
  if (!members) {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(defaultTeamMembers));
    return defaultTeamMembers;
  }
  return JSON.parse(members);
};

export const saveTeamMembers = (members) => {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
};