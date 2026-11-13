const HOME_SPLASH_STORAGE_KEY = "ultimate-fodinha:splash-shown";
let hasShownInMemory = false;

export const homeSplashStorage = {
  hasShown(): boolean {
    if (hasShownInMemory) return true;

    try {
      hasShownInMemory = typeof window !== "undefined" && window.sessionStorage.getItem(HOME_SPLASH_STORAGE_KEY) === "1";
    } catch {
      // Storage may be unavailable; the in-memory marker still covers navigation.
    }

    return hasShownInMemory;
  },

  markShown(): void {
    hasShownInMemory = true;

    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(HOME_SPLASH_STORAGE_KEY, "1");
      }
    } catch {
      // The presentation must never prevent access when storage is blocked.
    }
  },
};
