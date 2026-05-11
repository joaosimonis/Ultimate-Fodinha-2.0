import { api } from "@/api/http";
import type { ApiDataResponse } from "@/api/types/api.types";
import { routes } from "@/modules/ranking/api/routes";
import type { FodinhaRankingResponse, TrucoRankingResponse, TrucoTeamRankingResponse } from "@/modules/ranking/types/ranking.types";

const DEFAULT_RANKING_LIMIT = 10;

export const rankingApi = {
  async getFodinhaRanking(limit = DEFAULT_RANKING_LIMIT): Promise<FodinhaRankingResponse[]> {
    const response = await api.get<ApiDataResponse<FodinhaRankingResponse[]>>(routes.list, {
      params: {
        mode: "fodinha",
        limit,
      },
    });

    return response.data;
  },

  async getTrucoRanking(teamSize: 2 | 3, limit = DEFAULT_RANKING_LIMIT): Promise<TrucoRankingResponse[]> {
    const response = await api.get<ApiDataResponse<TrucoRankingResponse[]>>(routes.list, {
      params: {
        mode: "truco",
        team_size: teamSize,
        limit,
      },
    });

    return response.data;
  },

  async getTrucoTeamRanking(teamSize: 2 | 3, limit = DEFAULT_RANKING_LIMIT): Promise<TrucoTeamRankingResponse[]> {
    const response = await api.get<ApiDataResponse<TrucoTeamRankingResponse[]>>(routes.trucoTeams, {
      params: {
        team_size: teamSize,
        limit,
      },
    });

    return response.data;
  },
};
