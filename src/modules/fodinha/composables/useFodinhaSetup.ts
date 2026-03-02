import { computed, ref } from "vue";
import { FODINHA_DEFAULT_LIVES, FODINHA_LIVES_OPTIONS, FODINHA_MIN_PLAYERS } from "@/modules/fodinha/constants/fodinha.constants";
import type { FodinhaSetupPlayer } from "@/modules/fodinha/types/fodinha.types";

export function useFodinhaSetup() {
  const players = ref<FodinhaSetupPlayer[]>([]);
  const playerNameInput = ref("");
  const playerError = ref("");
  const selectedLives = ref(FODINHA_DEFAULT_LIVES);

  const canAddPlayer = computed(() => playerNameInput.value.trim().length > 0);
  const canStart = computed(() => players.value.length >= FODINHA_MIN_PLAYERS);

  const addPlayer = () => {
    const name = playerNameInput.value.trim();

    if (!name) return;

    if (players.value.some((player) => player.name.toLowerCase() === name.toLowerCase())) {
      playerError.value = "Já existe um jogador com esse nome.";
      return;
    }

    players.value.push({ id: crypto.randomUUID(), name });
    playerNameInput.value = "";
    playerError.value = "";
  };

  const removePlayer = (playerId: string) => {
    players.value = players.value.filter((player) => player.id !== playerId);
  };

  return {
    players,
    playerNameInput,
    playerError,
    selectedLives,
    livesOptions: FODINHA_LIVES_OPTIONS,
    minPlayers: FODINHA_MIN_PLAYERS,
    canAddPlayer,
    canStart,
    addPlayer,
    removePlayer,
  };
}
