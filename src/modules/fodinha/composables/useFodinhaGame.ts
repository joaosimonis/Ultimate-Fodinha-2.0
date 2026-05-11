import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { getApiErrorMessage } from "@/api/error";
import { useFodinhaStore } from "@/modules/fodinha/store/useFodinhaStore";
import { matchesApi } from "@/modules/matches/api";

export function useFodinhaGame() {
  const router = useRouter();
  const fodinhaStore = useFodinhaStore();

  const confirmExit = ref(false);
  const showWinner = ref(Boolean(fodinhaStore.winner));
  const isFinishing = ref(false);
  const isStartingRematch = ref(false);
  const finishError = ref("");

  const topThree = computed(() => {
    const winner = fodinhaStore.winner;
    if (!winner) return [];

    const eliminated = fodinhaStore.players
      .filter((player) => player.isEliminated && player.eliminationOrder !== undefined)
      .sort((a, b) => (b.eliminationOrder ?? 0) - (a.eliminationOrder ?? 0));

    return [winner, ...eliminated].slice(0, 3);
  });

  const getPlacement = (playerId: string) => {
    const winner = fodinhaStore.winner;
    if (winner?.id === playerId) return 1;

    const player = fodinhaStore.players.find((p) => p.id === playerId);
    if (!player?.eliminationOrder) return fodinhaStore.players.length;

    return fodinhaStore.players.length - player.eliminationOrder + 1;
  };

  const finishMatch = async () => {
    if (!fodinhaStore.matchId || isFinishing.value) return;

    isFinishing.value = true;
    finishError.value = "";

    try {
      await matchesApi.finish(fodinhaStore.matchId, {
        players: fodinhaStore.players.map((player) => ({
          player_id: player.id,
          remaining_lives: player.lives,
          placement: getPlacement(player.id),
        })),
      });
    } catch (error) {
      finishError.value = getApiErrorMessage(error);
    } finally {
      isFinishing.value = false;
    }
  };

  watch(
    () => fodinhaStore.winner,
    (winner) => {
      if (winner) {
        showWinner.value = true;
        void finishMatch();
      }
    }
  );

  const openExitConfirmation = () => {
    confirmExit.value = true;
  };

  const closeExitConfirmation = () => {
    confirmExit.value = false;
  };

  const exitGame = () => {
    confirmExit.value = false;
    fodinhaStore.clear();
    router.push({ name: "home" });
  };

  const newGameSamePlayers = async () => {
    if (isFinishing.value || isStartingRematch.value) return;

    const rematchPlayers = fodinhaStore.players.map((player) => ({
      id: player.id,
      name: player.name,
      avatarKey: player.avatarKey,
      title: player.title,
    }));

    if (rematchPlayers.length === 0) return;

    isStartingRematch.value = true;
    finishError.value = "";

    try {
      const match = await matchesApi.create({
        mode: "fodinha",
        lives: fodinhaStore.initialLives,
      });

      await matchesApi.addPlayers(match.id, {
        players: rematchPlayers.map((player) => ({
          player_id: player.id,
        })),
      });

      fodinhaStore.setup({
        matchId: match.id,
        roomCode: match.room_code,
        hostToken: match.host_token ?? "",
        players: rematchPlayers,
        initialLives: fodinhaStore.initialLives,
      });

      showWinner.value = false;
    } catch (error) {
      finishError.value = getApiErrorMessage(error);
    } finally {
      isStartingRematch.value = false;
    }
  };

  const reconfigure = () => {
    showWinner.value = false;
    fodinhaStore.clear();
    router.push({ name: "fodinha-setup" });
  };

  const goHome = () => {
    showWinner.value = false;
    fodinhaStore.clear();
    router.push({ name: "home" });
  };

  return {
    fodinhaStore,
    confirmExit,
    showWinner,
    topThree,
    isFinishing,
    isStartingRematch,
    finishError,
    openExitConfirmation,
    closeExitConfirmation,
    exitGame,
    newGameSamePlayers,
    reconfigure,
    goHome,
  };
}
