import { defineStore } from "pinia";
import { ref } from "vue";
import { getApiErrorMessage } from "@/api/error";
import { playersApi } from "@/modules/players/api";
import type { CreatePlayerRequest, PlayerResponse } from "@/modules/players/types/players.types";
import type { RegisteredPlayer } from "@/modules/players/types/players.types";

const toRegisteredPlayer = (player: PlayerResponse): RegisteredPlayer => ({
  id: player.id,
  name: player.name,
  avatarKey: player.avatar_key,
  title: player.title,
});

export const usePlayersStore = defineStore("players", () => {
  const players = ref<RegisteredPlayer[]>([]);
  const isLoading = ref(false);
  const hasLoaded = ref(false);
  const error = ref<string | null>(null);

  const loadPlayers = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await playersApi.list();
      players.value = response.map(toRegisteredPlayer);
      hasLoaded.value = true;
    } catch (err) {
      error.value = getApiErrorMessage(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createPlayer = async (payload: CreatePlayerRequest) => {
    error.value = null;

    const response = await playersApi.create(payload);
    const player = toRegisteredPlayer(response);
    players.value = [...players.value, player];
    return player;
  };

  const removePlayer = async (id: string) => {
    error.value = null;

    try {
      await playersApi.remove(id);
      players.value = players.value.filter((p) => p.id !== id);
    } catch (err) {
      error.value = getApiErrorMessage(err);
      throw err;
    }
  };

  return { players, isLoading, hasLoaded, error, loadPlayers, createPlayer, removePlayer };
});
