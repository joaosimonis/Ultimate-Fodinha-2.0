import { api } from "@/api/http";
import type { ApiDataResponse } from "@/api/types/api.types";
import { routes } from "@/modules/matches/api/routes";
import type {
  AddMatchPlayersRequest,
  CreateMatchRequest,
  FinishMatchRequest,
  ListMatchesQuery,
  MatchResponse,
} from "@/modules/matches/types/matches.types";

export const matchesApi = {
  async list(queryParams?: ListMatchesQuery): Promise<MatchResponse[]> {
    const response = await api.get<ApiDataResponse<MatchResponse[]>>(routes.list, {
      params: queryParams,
    });
    return response.data;
  },

  async getById(id: string): Promise<MatchResponse> {
    const response = await api.get<ApiDataResponse<MatchResponse>>(routes.getById(id));
    return response.data;
  },

  async getRoomByCode(roomCode: string): Promise<MatchResponse> {
    const response = await api.get<ApiDataResponse<MatchResponse>>(routes.getRoomByCode(roomCode));
    return response.data;
  },

  async create(payload: CreateMatchRequest): Promise<MatchResponse> {
    const response = await api.post<ApiDataResponse<MatchResponse>>(routes.create, payload);
    return response.data;
  },

  async addPlayers(matchId: string, payload: AddMatchPlayersRequest): Promise<MatchResponse> {
    const response = await api.post<ApiDataResponse<MatchResponse>>(routes.addPlayers(matchId), payload);
    return response.data;
  },

  async finish(matchId: string, payload: FinishMatchRequest): Promise<MatchResponse> {
    const response = await api.patch<ApiDataResponse<MatchResponse>>(routes.finish(matchId), payload);
    return response.data;
  },
};
