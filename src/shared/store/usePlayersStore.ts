import { defineStore } from "pinia";
import { ref } from "vue";
import { getApiErrorMessage } from "@/api/error";
import { playersApi } from "@/modules/players/api";
import type { PlayerResponse } from "@/modules/players/types/players.types";
import type { RegisteredPlayer } from "@/shared/types/players.types";

const toRegisteredPlayer = (player: PlayerResponse): RegisteredPlayer => ({
  id: player.id,
  name: player.name,
});

export const usePlayersStore = defineStore("players", () => {
  const players = ref<RegisteredPlayer[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadPlayers = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await playersApi.list();
      players.value = response.map(toRegisteredPlayer);
    } catch (err) {
      error.value = getApiErrorMessage(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const addPlayer = (name: string) => {
    players.value.push({
      id: crypto.randomUUID(),
      name,
    });
  };

  const removePlayer = (id: string) => {
    players.value = players.value.filter((p) => p.id !== id);
  };

  return { players, isLoading, error, loadPlayers, addPlayer, removePlayer };
});
