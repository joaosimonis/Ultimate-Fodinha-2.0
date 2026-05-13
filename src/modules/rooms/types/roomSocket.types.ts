import type { MatchLiveStateResponse, MatchResponse } from "@/modules/matches/types/matches.types";

export type RoomSocketMessageType = "room_snapshot" | "viewer_count_updated" | "room_state_updated" | "pong" | "error";

export interface RoomSocketMessage<TPayload = unknown> {
  type: RoomSocketMessageType | string;
  room_code?: string;
  host_token?: string;
  payload?: TPayload;
  error?: string;
}

export interface RoomViewerCountPayload {
  viewer_count: number;
}

export type RoomSnapshotMessage = RoomSocketMessage<MatchResponse> & {
  type: "room_snapshot";
};

export type RoomViewerCountMessage = RoomSocketMessage<RoomViewerCountPayload> & {
  type: "viewer_count_updated";
};

export type RoomStateUpdatedMessage<TPayload = MatchLiveStateResponse> = RoomSocketMessage<TPayload> & {
  type: "room_state_updated";
};

export type RoomPongMessage = RoomSocketMessage & {
  type: "pong";
};

export type RoomErrorMessage = RoomSocketMessage & {
  type: "error";
  error: string;
};

export interface RoomPingMessage {
  type: "ping";
}

export interface RoomStateUpdateRequest<TPayload = MatchLiveStateResponse> {
  type: "room_state_updated";
  host_token: string;
  payload: TPayload;
}

export type RoomSocketStatus = "idle" | "connecting" | "connected" | "closed" | "error";
