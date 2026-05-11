import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { FODINHA_DEFAULT_LIVES } from "@/modules/fodinha/constants/fodinha.constants";
import type { FodinhaPlayer, FodinhaSetupPayload } from "@/modules/fodinha/types/fodinha.types";

export const useFodinhaStore = defineStore(
  "fodinha",
  () => {
    const players = ref<FodinhaPlayer[]>([]);
    const initialLives = ref(FODINHA_DEFAULT_LIVES);
    const eliminationCounter = ref(0);
    const matchId = ref<string | null>(null);
    const roomCode = ref<string | null>(null);
    const hostToken = ref<string | null>(null);

    const hasGame = computed(() => players.value.length > 0);
    const activePlayers = computed(() => players.value.filter((p) => !p.isEliminated));
    const winner = computed(() => (activePlayers.value.length === 1 ? activePlayers.value[0] : null));

    const setup = (payload: FodinhaSetupPayload) => {
      matchId.value = payload.matchId;
      roomCode.value = payload.roomCode;
      hostToken.value = payload.hostToken;
      initialLives.value = payload.initialLives;
      eliminationCounter.value = 0;
      players.value = payload.players.map((p) => ({
        id: p.id,
        name: p.name,
        avatarKey: p.avatarKey,
        title: p.title,
        lives: payload.initialLives,
        isEliminated: false,
        eliminationOrder: undefined,
      }));
    };

    const removeLife = (playerId: string) => {
      const player = players.value.find((p) => p.id === playerId);
      if (!player || player.isEliminated) return;

      player.lives -= 1;

      if (player.lives <= 0) {
        player.lives = 0;
        player.isEliminated = true;
        eliminationCounter.value += 1;
        player.eliminationOrder = eliminationCounter.value;

      }
    };

    const addLife = (playerId: string) => {
      const player = players.value.find((p) => p.id === playerId);
      if (!player || player.isEliminated) return;

      if (player.lives >= initialLives.value) {
        return;
      }

      player.lives += 1;
    };

    const reset = () => {
      players.value = players.value.map((p) => ({
        ...p,
        lives: initialLives.value,
        isEliminated: false,
        eliminationOrder: undefined,
      }));
      eliminationCounter.value = 0;
    };

    const syncLives = (livesByPlayerId: Record<string, number>) => {
      players.value = players.value.map((player) => {
        const lives = livesByPlayerId[player.id] ?? player.lives;

        return {
          ...player,
          lives,
          isEliminated: lives <= 0,
        };
      });
    };

    const clear = () => {
      players.value = [];
      initialLives.value = FODINHA_DEFAULT_LIVES;
      eliminationCounter.value = 0;
      matchId.value = null;
      roomCode.value = null;
      hostToken.value = null;
    };

    return {
      players,
      initialLives,
      eliminationCounter,
      matchId,
      roomCode,
      hostToken,
      hasGame,
      activePlayers,
      winner,
      setup,
      removeLife,
      addLife,
      reset,
      syncLives,
      clear,
    };
  },
  {
    persist: {
      key: "fodinha",
      pick: ["players", "initialLives", "eliminationCounter", "matchId", "roomCode", "hostToken"],
    },
  }
);
