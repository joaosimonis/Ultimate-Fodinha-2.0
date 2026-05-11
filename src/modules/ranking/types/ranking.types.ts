export interface FodinhaRankingResponse {
  position: number;
  player_id: string;
  name: string;
  avatar_key: string;
  games_played: number;
  gold_medals: number;
  silver_medals: number;
  bronze_medals: number;
  podiums: number;
}

export interface TrucoRankingResponse {
  position: number;
  player_id: string;
  name: string;
  avatar_key: string;
  games_played: number;
  wins: number;
  losses: number;
  win_rate: number;
}

export interface TrucoTeamRankingPlayerResponse {
  id: string;
  name: string;
  avatar_key: string;
}

export interface TrucoTeamRankingResponse {
  position: number;
  team_key: string;
  players: TrucoTeamRankingPlayerResponse[];
  games_played: number;
  wins: number;
  losses: number;
  win_rate: number;
  points_for: number;
  points_against: number;
  point_diff: number;
  last_played_at: string;
}

export interface FodinhaRankingQuery {
  mode: "fodinha";
  limit?: number;
}

export interface TrucoRankingQuery {
  mode: "truco";
  team_size: 2 | 3;
  limit?: number;
}

export type RankingQuery = FodinhaRankingQuery | TrucoRankingQuery;
