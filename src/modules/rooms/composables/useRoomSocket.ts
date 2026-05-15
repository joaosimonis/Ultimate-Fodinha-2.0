import { onUnmounted, ref, shallowRef } from "vue";
import type { MatchLiveStateResponse, MatchResponse } from "@/modules/matches/types/matches.types";
import type { RoomSocketMessage, RoomSocketStatus, RoomStateUpdateRequest, RoomViewerCountPayload } from "@/modules/rooms/types/roomSocket.types";

const buildRoomSocketUrl = (roomCode: string): string => {
  const baseUrl = (import.meta.env.VITE_WS_BASE_URL ?? "wss://ultimate-fodinha-api.onrender.com/api/v1").replace(/\/$/, "");
  return `${baseUrl}/ws/rooms/${encodeURIComponent(roomCode)}`;
};

const parseSocketMessage = (data: string): RoomSocketMessage => {
  return JSON.parse(data) as RoomSocketMessage;
};

const RECONNECT_DELAYS_MS = [1000, 2000, 5000, 10000, 15000];

export function useRoomSocket() {
  const socket = shallowRef<WebSocket | null>(null);
  const status = ref<RoomSocketStatus>("idle");
  const error = ref("");
  const roomSnapshot = ref<MatchResponse | null>(null);
  const liveState = ref<MatchLiveStateResponse | null>(null);
  const viewerCount = ref(0);
  const lastMessage = ref<RoomSocketMessage | null>(null);
  let roomCode = "";
  let reconnectAttempt = 0;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let wasClosedManually = false;

  const isConnected = () => socket.value?.readyState === WebSocket.OPEN;

  const clearReconnectTimeout = () => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
  };

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
    }
  };

  const openSocket = (nextRoomCode: string, isReconnect = false) => {
    error.value = "";
    status.value = isReconnect ? "reconnecting" : "connecting";

    const nextSocket = new WebSocket(buildRoomSocketUrl(nextRoomCode));
    socket.value = nextSocket;

    nextSocket.addEventListener("open", () => {
      reconnectAttempt = 0;
      status.value = "connected";
      error.value = "";
    });

    nextSocket.addEventListener("message", (event) => {
      try {
        handleMessage(parseSocketMessage(String(event.data)));
      } catch {
        error.value = "Mensagem inválida recebida da sala.";
      }
    });

    nextSocket.addEventListener("error", () => {
      error.value = "Erro ao conectar com a sala.";
    });

    nextSocket.addEventListener("close", () => {
      if (socket.value !== nextSocket) {
        return;
      }

      socket.value = null;

      if (wasClosedManually) {
        status.value = "closed";
        return;
      }

      scheduleReconnect();
    });
  };

  const scheduleReconnect = () => {
    if (!roomCode) {
      status.value = "closed";
      return;
    }

    if (reconnectAttempt >= RECONNECT_DELAYS_MS.length) {
      status.value = "error";
      error.value = "Conexão com a sala perdida.";
      return;
    }

    const delay = RECONNECT_DELAYS_MS[reconnectAttempt];
    reconnectAttempt += 1;
    status.value = "reconnecting";
    error.value = "Reconectando com a sala...";

    clearReconnectTimeout();
    reconnectTimeout = setTimeout(() => {
      openSocket(roomCode, true);
    }, delay);
  };

  const close = () => {
    wasClosedManually = true;
    clearReconnectTimeout();
    socket.value?.close();
    socket.value = null;
    status.value = "closed";
  };

  const connect = (nextRoomCode: string) => {
    close();

    roomCode = nextRoomCode;
    reconnectAttempt = 0;
    wasClosedManually = false;
    openSocket(nextRoomCode);
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
