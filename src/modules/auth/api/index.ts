import { api } from "@/api/http";
import type { ApiDataResponse } from "@/api/types/api.types";
import { routes } from "@/modules/auth/api/routes";
import { adminAuthStorage } from "@/modules/auth/storage/adminAuthStorage";
import type { AdminLoginRequest, AdminLoginResponse } from "@/modules/auth/types/auth.types";

export const authApi = {
  async login(payload: AdminLoginRequest): Promise<AdminLoginResponse> {
    const response = await api.post<ApiDataResponse<AdminLoginResponse>>(routes.login, payload);
    adminAuthStorage.setToken(response.data.access_token);

    return response.data;
  },
};
