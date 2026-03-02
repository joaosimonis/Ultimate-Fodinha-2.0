import { defineStore } from "pinia";
import { ref } from "vue";
import type { RegisteredPlayer } from "../types/players.types";

export const usePlayersStore = defineStore(
  "players",
  () => {
    const players = ref<RegisteredPlayer[]>([])

    const addPlayer = (name: string) => {
      players.value.push({
        id: crypto.randomUUID(),
        name,
      })
    }

    const removePlayer = (id: string) => {
      players.value = players.value.filter((p) => p.id !== id)
    }

    return { players, addPlayer, removePlayer }
  },
  { persist: true }
)
