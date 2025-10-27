import { ConversionHistoryItem, AppSettings } from "@/types/infrastructure";

const HISTORY_KEY = "iac_conversion_history";
const SETTINGS_KEY = "iac_settings";
const MAX_HISTORY_ITEMS = 10;

export function getHistory(): ConversionHistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading history:", error);
    return [];
  }
}

export function addToHistory(item: Omit<ConversionHistoryItem, "id" | "timestamp">): void {
  if (typeof window === "undefined") return;

  try {
    const history = getHistory();
    const newItem: ConversionHistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    history.unshift(newItem);

    // Keep only the last MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Error saving to history:", error);
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing history:", error);
  }
}

export function getHistoryItem(id: string): ConversionHistoryItem | null {
  const history = getHistory();
  return history.find((item) => item.id === id) || null;
}

export function getSettings(): AppSettings {
  if (typeof window === "undefined") {
    return {
      defaultProvider: "aws",
      defaultFormats: ["terraform"],
      theme: "light",
    };
  }

  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading settings:", error);
  }

  return {
    defaultProvider: "aws",
    defaultFormats: ["terraform"],
    theme: "light",
  };
}

export function saveSettings(settings: Partial<AppSettings>): void {
  if (typeof window === "undefined") return;

  try {
    const currentSettings = getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}

export function clearSettings(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error("Error clearing settings:", error);
  }
}
