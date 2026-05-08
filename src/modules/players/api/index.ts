import { api } from "@/api/http";
import type { ApiDataResponse, ApiMessageResponse } from "@/api/types/api.types";
import type { CreatePlayerRequest, PlayerResponse } from "@/modules/players/types/players.types";
import { routes } from "@/modules/players/api/routes";

export const playersApi = {
  async list(): Promise<PlayerResponse[]> {
    const response = await api.get<ApiDataResponse<PlayerResponse[]>>(routes.list);
    return response.data;
  },

  async getById(id: string): Promise<PlayerResponse> {
    const response = await api.get<ApiDataResponse<PlayerResponse>>(routes.getById(id));
    return response.data;
  },

  async create(payload: CreatePlayerRequest): Promise<PlayerResponse> {
    const response = await api.post<ApiDataResponse<PlayerResponse>>(routes.create, payload);
    return response.data;
  },

  async remove(id: string): Promise<ApiMessageResponse> {
    return api.delete<ApiMessageResponse>(routes.remove(id));
  },
};
