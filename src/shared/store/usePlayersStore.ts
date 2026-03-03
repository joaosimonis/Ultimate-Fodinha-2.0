import { defineStore } from "pinia";
import { ref } from "vue";
import type { RegisteredPlayer } from "../types/players.types";

const DEFAULT_PLAYERS: RegisteredPlayer[] = [
  { id: crypto.randomUUID(), name: "Ângela" },
  { id: crypto.randomUUID(), name: "Bruno" },
  { id: crypto.randomUUID(), name: "Fabri" },
  { id: crypto.randomUUID(), name: "Geladeira" },
  { id: crypto.randomUUID(), name: "Grade" },
  { id: crypto.randomUUID(), name: "Guto" },
  { id: crypto.randomUUID(), name: "João" },
  { id: crypto.randomUUID(), name: "Laura" },
  { id: crypto.randomUUID(), name: "Leo" },
  { id: crypto.randomUUID(), name: "Messi" },
  { id: crypto.randomUUID(), name: "Murilo" },
  { id: crypto.randomUUID(), name: "Rogus" },
  { id: crypto.randomUUID(), name: "Thaís" },
  { id: crypto.randomUUID(), name: "Thiago" },
];

export const usePlayersStore = defineStore(
  "players",
  () => {
    const players = ref<RegisteredPlayer[]>(DEFAULT_PLAYERS);

    const addPlayer = (name: string) => {
      players.value.push({
        id: crypto.randomUUID(),
        name,
      });
    };

    const removePlayer = (id: string) => {
      players.value = players.value.filter((p) => p.id !== id);
    };

    return { players, addPlayer, removePlayer };
  },
  { persist: true }
);
