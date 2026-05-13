import { onUnmounted, ref, shallowRef } from "vue";
import type { MatchLiveStateResponse, MatchResponse } from "@/modules/matches/types/matches.types";
import type { RoomSocketMessage, RoomSocketStatus, RoomStateUpdateRequest, RoomViewerCountPayload } from "@/modules/rooms/types/roomSocket.types";

const buildRoomSocketUrl = (roomCode: string): string => {
  const baseUrl = (import.meta.env.VITE_WS_BASE_URL ?? "ws://localhost:8080").replace(/\/$/, "");
  return `${baseUrl}/api/v1/ws/rooms/${encodeURIComponent(roomCode)}`;
};

const parseSocketMessage = (data: string): RoomSocketMessage => {
  return JSON.parse(data) as RoomSocketMessage;
};

export function useRoomSocket() {
  const socket = shallowRef<WebSocket | null>(null);
  const status = ref<RoomSocketStatus>("idle");
  const error = ref("");
  const roomSnapshot = ref<MatchResponse | null>(null);
  const liveState = ref<MatchLiveStateResponse | null>(null);
  const viewerCount = ref(0);
  const lastMessage = ref<RoomSocketMessage | null>(null);

  const isConnected = () => socket.value?.readyState === WebSocket.OPEN;

  const handleMessage = (message: RoomSocketMessage) => {
    lastMessage.value = message;

    if (message.type === "room_snapshot") {
      const snapshot = message.payload as MatchResponse | undefined;
      roomSnapshot.value = snapshot ?? null;
      liveState.value = snapshot?.live_state ?? null;
      return;
    }

    if (message.type === "viewer_count_updated") {
      const payload = message.payload as RoomViewerCountPayload | undefined;
      viewerCount.value = payload?.viewer_count ?? 0;
      return;
    }

    if (message.type === "room_state_updated") {
      liveState.value = (message.payload as MatchLiveStateResponse | undefined) ?? null;
      return;
    }

    if (message.type === "error") {
      error.value = message.error ?? "Erro na conexão da sala.";
      status.value = "error";
    }
  };

  const close = () => {
    socket.value?.close();
    socket.value = null;
    status.value = "closed";
  };

  const connect = (roomCode: string) => {
    close();

    error.value = "";
    status.value = "connecting";

    const nextSocket = new WebSocket(buildRoomSocketUrl(roomCode));
    socket.value = nextSocket;

    nextSocket.addEventListener("open", () => {
      status.value = "connected";
    });

    nextSocket.addEventListener("message", (event) => {
      try {
        handleMessage(parseSocketMessage(String(event.data)));
      } catch {
        error.value = "Mensagem inválida recebida da sala.";
        status.value = "error";
      }
    });

    nextSocket.addEventListener("error", () => {
      error.value = "Erro ao conectar com a sala.";
      status.value = "error";
    });

    nextSocket.addEventListener("close", () => {
      if (socket.value === nextSocket) {
        socket.value = null;
      }

      if (status.value !== "error") {
        status.value = "closed";
      }
    });
  };

  const sendMessage = (message: object): boolean => {
    if (!isConnected()) {
      error.value = "A sala ainda não está conectada.";
      return false;
    }

    socket.value?.send(JSON.stringify(message));
    return true;
  };

  const sendPing = () => sendMessage({ type: "ping" });

  const sendRoomState = (payload: MatchLiveStateResponse, hostToken: string) => {
    const message: RoomStateUpdateRequest = {
      type: "room_state_updated",
      host_token: hostToken,
      payload,
    };

    return sendMessage(message);
  };

  onUnmounted(close);

  return {
    status,
    error,
    roomSnapshot,
    liveState,
    viewerCount,
    lastMessage,
    connect,
    close,
    sendPing,
    sendRoomState,
  };
}
