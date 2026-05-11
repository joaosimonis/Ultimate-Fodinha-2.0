import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { TrucoTeam, TrucoSetupPayload, TrucoMatchHistory, TrucoMode } from "../types/truco.types";
import { TRUCO_MAX_SCORE_DEFAULT } from "@/modules/truco/constants/truco.constants";

export const useTrucoStore = defineStore(
  "truco",
  () => {
    const teams = ref<TrucoTeam[]>([]);
    const maxScore = ref(TRUCO_MAX_SCORE_DEFAULT);
    const mode = ref<TrucoMode>("dupla");
    const history = ref<TrucoMatchHistory[]>([]);
    const matchId = ref<string | null>(null);
    const roomCode = ref<string | null>(null);
    const hostToken = ref<string | null>(null);

    const hasGame = computed(() => teams.value.length > 0);
    const winner = computed(() => teams.value.find((t) => t.score >= maxScore.value) ?? null);

    const teamName = (team: TrucoTeam): string => team.name?.trim() || team.players.map((p) => p.name).join(" + ");

    const setup = (payload: TrucoSetupPayload) => {
      matchId.value = payload.matchId;
      roomCode.value = payload.roomCode;
      hostToken.value = payload.hostToken;
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

    const syncScores = (scoresByTeamName: Record<string, number>) => {
      teams.value = teams.value.map((team) => ({
        ...team,
        score: scoresByTeamName[teamName(team)] ?? team.score,
      }));
    };

    const clear = () => {
      teams.value = [];
      maxScore.value = TRUCO_MAX_SCORE_DEFAULT;
      mode.value = "dupla";
      history.value = [];
      matchId.value = null;
      roomCode.value = null;
      hostToken.value = null;
    };

    return {
      teams,
      maxScore,
      mode,
      history,
      matchId,
      roomCode,
      hostToken,
      hasGame,
      winner,
      teamName,
      setup,
      addPoint,
      removePoint,
      reset,
      syncScores,
      clear,
    };
  },
  {
    persist: {
      key: "truco",
      pick: ["teams", "maxScore", "mode", "history", "matchId", "roomCode", "hostToken"],
    },
  }
);
