import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { TrucoTeam, TrucoSetupPayload, TrucoMatchHistory, TrucoMode } from "../types/truco.types";

export const useTrucoStore = defineStore("truco", () => {
  const teams = ref<TrucoTeam[]>([]);
  const maxScore = ref(24);
  const mode = ref<TrucoMode>("dupla");
  const history = ref<TrucoMatchHistory[]>([]);

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

  return {
    teams,
    maxScore,
    mode,
    history,
    winner,
    teamName,
    setup,
    addPoint,
    removePoint,
    reset,
  };
});
