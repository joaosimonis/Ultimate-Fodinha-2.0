export interface FodinhaSetupPlayer {
  id: string;
  name: string;
  avatarKey: string;
  title: string;
}

export interface FodinhaPlayer extends FodinhaSetupPlayer {
  lives: number;
  isEliminated: boolean;
  eliminationOrder?: number;
}

export interface FodinhaSetupPayload {
  players: FodinhaSetupPlayer[];
  initialLives: number;
  matchId: string;
  roomCode: string;
  hostToken: string;
}
