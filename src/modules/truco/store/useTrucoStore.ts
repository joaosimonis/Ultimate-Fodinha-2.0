import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { TrucoTeam, TrucoSetupPayload, TrucoMatchHistory, TrucoMode } from "../types/truco.types";
import { useRankingStore } from "@/modules/ranking/store/useRankingStore";

export const useTrucoStore = defineStore(
  "truco",
  () => {
    const teams = ref<TrucoTeam[]>([]);
    const maxScore = ref(24);
    const mode = ref<TrucoMode>("dupla");
    const history = ref<TrucoMatchHistory[]>([]);

    const hasGame = computed(() => teams.value.length > 0);
    const winner = computed(() => teams.value.find((t) => t.score >= maxScore.value) ?? null);

    const teamName = (team: TrucoTeam): string => team.name?.trim() || team.players.map((p) => p.name).join(" + ");

    const setup = (payload: TrucoSetupPayload) => {
      maxScore.value = payload.maxScore;
      mode.value = payload.mode;
      history.value = [];
      teams.value = payload.teams.map((t) => ({
        id: crypto.randomUUID(),
        name: t.name,
        players: t.players,
        score: 0,
      }));
    };

    const addPoint = (teamId: string) => {
      const team = teams.value.find((t) => t.id === teamId);
      if (!team || winner.value) return;

      team.score = Math.min(team.score + 1, maxScore.value);

      history.value.push({
        teamId: team.id,
        teamName: teamName(team),
        point: team.score,
        timestamp: Date.now(),
      });

      // Registra no ranking quando vencer
      if (team.score >= maxScore.value) {
        const rankingStore = useRankingStore();
        const winnerIndex = teams.value.findIndex((t) => t.id === teamId);
        rankingStore.registerTrucoResult(
          teams.value.map((t) => ({ players: t.players })),
          winnerIndex
        );
      }
    };

    const removePoint = (teamId: string) => {
      const team = teams.value.find((t) => t.id === teamId);
      if (!team || team.score === 0) return;
      team.score -= 1;
    };

    const reset = () => {
      teams.value = teams.value.map((t) => ({ ...t, score: 0 }));
      history.value = [];
    };

    const clear = () => {
      teams.value = [];
      maxScore.value = 24;
      mode.value = "dupla";
      history.value = [];
    };

    return {
      teams,
      maxScore,
      mode,
      history,
      hasGame,
      winner,
      teamName,
      setup,
      addPoint,
      removePoint,
      reset,
      clear,
    };
  },
  {
    persist: {
      key: "truco",
      pick: ["teams", "maxScore", "mode", "history"],
    },
  }
);
