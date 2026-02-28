export interface FodinhaSetupPlayer {
  id: string;
  name: string;
}

export interface FodinhaPlayer extends FodinhaSetupPlayer {
  lives: number;
  isEliminated: boolean;
  eliminationOrder?: number;
}

export interface FodinhaSetupPayload {
  players: FodinhaSetupPlayer[];
  initialLives: number;
}
