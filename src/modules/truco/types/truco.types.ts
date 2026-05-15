export interface TrucoPlayer {
  id: string;
  name: string;
  avatarKey: string;
  title: string;
}

export interface TrucoTeam {
  id: string;
  name: string;
  players: TrucoPlayer[];
  score: number;
}

export interface TrucoMatchHistory {
  teamId: string;
  teamName: string;
  point: number;
  timestamp: number;
}

export interface TrucoSetupPayload {
  teams: { name: string; players: TrucoPlayer[] }[];
  maxScore: number;
  mode: TrucoMode;
  matchId: string;
  roomCode: string;
  hostToken: string;
}

export type TrucoMode = "dupla" | "trio";
