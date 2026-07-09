const SYNC_KEY_LOCAL = "jsdt-sync-key";

// Initialize a random sync key if none exists
export const initSyncKey = () => {
  let key = localStorage.getItem(SYNC_KEY_LOCAL);
  if (!key) {
    key = "jsdt_sync_" + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    localStorage.setItem(SYNC_KEY_LOCAL, key);
  }
  return key;
};

// Get the current sync key
export const getSyncKey = () => {
  return localStorage.getItem(SYNC_KEY_LOCAL) || initSyncKey();
};

// Set/overwrite sync key (for linking devices)
export const setSyncKey = (key) => {
  localStorage.setItem(SYNC_KEY_LOCAL, key.trim());
};

// Push data for a specific key to cloud bucket (kvdb.io)
export const pushToCloud = async (keyName, data) => {
  const syncKey = getSyncKey();
  if (!syncKey) return;
  try {
    await fetch(`https://kvdb.io/${syncKey}/${keyName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(`Failed to push ${keyName} to cloud:`, error);
  }
};

// Pull all data from cloud bucket and save to local storage
export const pullFromCloud = async (customSyncKey) => {
  const key = customSyncKey || getSyncKey();
  if (!key) return false;
  
  try {
    let success = false;
    
    const entriesRes = await fetch(`https://kvdb.io/${key}/entries`);
    if (entriesRes.ok) {
      const data = await entriesRes.json();
      localStorage.setItem("jsdt-status-data", JSON.stringify(data));
      success = true;
    }

    const membersRes = await fetch(`https://kvdb.io/${key}/members`);
    if (membersRes.ok) {
      const data = await membersRes.json();
      localStorage.setItem("jsdt-team-members", JSON.stringify(data));
      success = true;
    }

    const settingsRes = await fetch(`https://kvdb.io/${key}/settings`);
    if (settingsRes.ok) {
      const data = await settingsRes.json();
      localStorage.setItem("jsdt-settings", JSON.stringify(data));
      success = true;
    }

    if (success && customSyncKey) {
      setSyncKey(customSyncKey);
    }
    return success;
  } catch (error) {
    console.error("Cloud pull failed:", error);
    return false;
  }
};

// Smart startup sync: checks if cloud has data; if not, uploads existing local data!
export const syncOnStartup = async () => {
  const key = getSyncKey();
  if (!key) return;

  try {
    // 1. Sync entries
    const entriesRes = await fetch(`https://kvdb.io/${key}/entries`);
    if (entriesRes.ok) {
      const data = await entriesRes.json();
      localStorage.setItem("jsdt-status-data", JSON.stringify(data));
    } else if (entriesRes.status === 404) {
      const localData = localStorage.getItem("jsdt-status-data");
      if (localData && JSON.parse(localData).length > 0) {
        await pushToCloud("entries", JSON.parse(localData));
      }
    }

    // 2. Sync members
    const membersRes = await fetch(`https://kvdb.io/${key}/members`);
    if (membersRes.ok) {
      const data = await membersRes.json();
      localStorage.setItem("jsdt-team-members", JSON.stringify(data));
    } else if (membersRes.status === 404) {
      const localData = localStorage.getItem("jsdt-team-members");
      if (localData) {
        await pushToCloud("members", JSON.parse(localData));
      }
    }

    // 3. Sync settings
    const settingsRes = await fetch(`https://kvdb.io/${key}/settings`);
    if (settingsRes.ok) {
      const data = await settingsRes.json();
      localStorage.setItem("jsdt-settings", JSON.stringify(data));
    } else if (settingsRes.status === 404) {
      const localData = localStorage.getItem("jsdt-settings");
      if (localData) {
        await pushToCloud("settings", JSON.parse(localData));
      }
    }
  } catch (error) {
    console.error("Startup synchronization failed:", error);
  }
};
