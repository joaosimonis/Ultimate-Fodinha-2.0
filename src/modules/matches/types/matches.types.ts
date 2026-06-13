export type MatchMode = "fodinha" | "truco";
export type MatchStatus = "ongoing" | "finished" | "cancelled";

export interface MatchPlayerResponse {
  id: string;
  match_id: string;
  player_id: string;
  team_id?: string;
  team_name?: string;
  remaining_lives?: number;
  final_score?: number;
  placement: number | null;
  is_winner: boolean;
}

export interface MatchTeamResponse {
  id: string;
  match_id: string;
  team_name: string;
  final_score: number | null;
  placement: number | null;
  is_winner: boolean;
}

export interface MatchLiveStateResponse {
  mode: MatchMode;
  lives?: Record<string, number>;
  scores?: Record<string, number>;
}

export interface MatchResponse {
  id: string;
  mode: MatchMode;
  status: MatchStatus;
  room_code: string;
  host_token?: string;
  lives?: number;
  max_score?: number;
  live_state?: MatchLiveStateResponse;
  created_at: string;
  finished_at?: string;
  cancelled_at?: string;
  players?: MatchPlayerResponse[];
  teams?: MatchTeamResponse[];
}

export interface CreateFodinhaMatchRequest {
  mode: "fodinha";
  lives: number;
}

export interface CreateTrucoMatchRequest {
  mode: "truco";
  max_score: number;
}

export type CreateMatchRequest = CreateFodinhaMatchRequest | CreateTrucoMatchRequest;

export interface AddFodinhaMatchPlayerRequest {
  player_id: string;
}

export interface AddTrucoMatchPlayerRequest {
  player_id: string;
  team_name: string;
}

export interface AddMatchPlayersRequest {
  players: Array<AddFodinhaMatchPlayerRequest | AddTrucoMatchPlayerRequest>;
}

export interface FinishFodinhaMatchPlayerRequest {
  player_id: string;
  remaining_lives: number;
  placement: number;
}

export interface FinishFodinhaMatchRequest {
  players: FinishFodinhaMatchPlayerRequest[];
}

export interface FinishTrucoMatchTeamRequest {
  team_id?: string;
  team_name?: string;
  final_score: number;
}

export interface FinishTrucoMatchRequest {
  teams: FinishTrucoMatchTeamRequest[];
}

export type FinishMatchRequest = FinishFodinhaMatchRequest | FinishTrucoMatchRequest;

export interface ListMatchesQuery {
  status?: "live";
}
