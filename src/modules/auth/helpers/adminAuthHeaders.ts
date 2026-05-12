import { adminAuthStorage } from "@/modules/auth/storage/adminAuthStorage";

export function getAdminAuthHeaders(): Record<string, string> {
  const token = adminAuthStorage.getToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}
