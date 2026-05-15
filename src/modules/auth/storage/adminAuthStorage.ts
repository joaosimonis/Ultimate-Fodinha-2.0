const ADMIN_ACCESS_TOKEN_KEY = "ultimate-fodinha:admin-access-token";

export const adminAuthStorage = {
  getToken(): string | null {
    return sessionStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
  },

  setToken(token: string): void {
    sessionStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, token);
  },

  removeToken(): void {
    sessionStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
  },

  hasToken(): boolean {
    return Boolean(sessionStorage.getItem(ADMIN_ACCESS_TOKEN_KEY));
  },
};
