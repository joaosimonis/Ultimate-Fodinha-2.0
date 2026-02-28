import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useFodinhaStore } from "@/modules/fodinha/store/useFodinhaStore";

export function useFodinhaGame() {
  const router = useRouter();
  const fodinhaStore = useFodinhaStore();

  const confirmExit = ref(false);
  const showWinner = ref(false);

  const topThree = computed(() => {
    const winner = fodinhaStore.winner;
    if (!winner) return [];

    const eliminated = fodinhaStore.players
      .filter((player) => player.isEliminated && player.eliminationOrder !== undefined)
      .sort((a, b) => (b.eliminationOrder ?? 0) - (a.eliminationOrder ?? 0));

    return [winner, ...eliminated].slice(0, 3);
  });

  watch(
    () => fodinhaStore.winner,
    (winner) => {
      if (winner) showWinner.value = true;
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
    router.push({ name: "home" });
  };

  const newGameSamePlayers = () => {
    fodinhaStore.reset();
    showWinner.value = false;
  };

  const reconfigure = () => {
    showWinner.value = false;
    router.push({ name: "fodinha-setup" });
  };

  const goHome = () => {
    showWinner.value = false;
    router.push({ name: "home" });
  };

  return {
    fodinhaStore,
    confirmExit,
    showWinner,
    topThree,
    openExitConfirmation,
    closeExitConfirmation,
    exitGame,
    newGameSamePlayers,
    reconfigure,
    goHome,
  };
}
