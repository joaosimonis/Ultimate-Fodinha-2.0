export interface PlayerStats {
  playerId: string;
  playerName: string;
  wins: number;
  losses: number;
  gamesPlayed: number;
  winRate: number;
}

export interface TeamStats {
  teamKey: string;
  playerNames: string[];
  wins: number;
  losses: number;
  gamesPlayed: number;
  winRate: number;
}

export type RankingMode = "fodinha" | "truco";
