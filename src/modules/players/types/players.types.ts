export interface PlayerUltimate {
  name: string;
  description: string;
}

export interface PlayerResponse {
  id: string;
  name: string;
  avatar_key: string;
  title: string;
  lore: string;
  ultimate: PlayerUltimate;
  created_at: string;
}

export interface CreatePlayerRequest {
  name: string;
  avatar_key: string;
  title: string;
  lore: string;
  ultimate: PlayerUltimate;
}
