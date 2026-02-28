import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { FODINHA_DEFAULT_LIVES } from "@/modules/fodinha/constants/fodinha.constants";
import type { FodinhaPlayer, FodinhaSetupPayload } from "@/modules/fodinha/fodinha.types";

export const useFodinhaStore = defineStore("fodinha", () => {
  const players = ref<FodinhaPlayer[]>([]);
  const initialLives = ref(FODINHA_DEFAULT_LIVES);
  const eliminationCounter = ref(0);

  const activePlayers = computed(() => players.value.filter((p) => !p.isEliminated));
  const winner = computed(() => (activePlayers.value.length === 1 ? activePlayers.value[0] : null));

  const setup = (payload: FodinhaSetupPayload) => {
    initialLives.value = payload.initialLives;
    eliminationCounter.value = 0;
    players.value = payload.players.map((p) => ({
      id: p.id,
      name: p.name,
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

  return {
    players,
    initialLives,
    activePlayers,
    winner,
    setup,
    removeLife,
    addLife,
    reset,
  };
});
