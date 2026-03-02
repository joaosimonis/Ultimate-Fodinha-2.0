export interface TrucoPlayer {
  id: string;
  name: string;
}

export interface TrucoTeam {
  id: string
  name?: string      
  players: TrucoPlayer[]
  score: number
}

export interface TrucoMatchHistory {
  teamId: string;
  teamName: string;
  point: number;
  timestamp: number;
}

export interface TrucoSetupPayload {
  teams: { name?: string; players: TrucoPlayer[] }[]
  maxScore: number;
  mode: TrucoMode;
}

export type TrucoMode = "dupla" | "trio";
