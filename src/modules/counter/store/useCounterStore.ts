import type { TRUCO_MAX_SCORE_OPTIONS } from "@/modules/truco/constants/truco.constants";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { TRUCO_MAX_SCORE_DEFAULT } from "@/modules/truco/constants/truco.constants";

export type CounterMaxScore = (typeof TRUCO_MAX_SCORE_OPTIONS)[number];

interface CounterTeam {
  name: string;
  score: number;
}

export const useCounterStore = defineStore("traditional-counter", () => {
  const teams = ref<CounterTeam[]>([]);
  const maxScore = ref<CounterMaxScore>(TRUCO_MAX_SCORE_DEFAULT);
  const hasGame = computed(() => teams.value.length === 2);
  const winner = computed(() => teams.value.find((team) => team.score >= maxScore.value) ?? null);

  const setup = (names: [string, string], limit: CounterMaxScore) => {
    maxScore.value = limit;
    teams.value = names.map((name, index) => ({
      name: name.trim() || (index === 0 ? "Equipe A" : "Equipe B"),
      score: 0,
    }));
  };

  const addPoint = (index: number) => {
    const team = teams.value[index];
    if (!team || winner.value) return;
    team.score = Math.min(team.score + 1, maxScore.value);
  };

  const removePoint = (index: number) => {
    const team = teams.value[index];
    if (team) team.score = Math.max(0, team.score - 1);
  };

  const rematch = () => {
    teams.value = teams.value.map((team) => ({ ...team, score: 0 }));
  };

  return { teams, maxScore, hasGame, winner, setup, addPoint, removePoint, rematch };
}, {
  persist: { key: "traditional-counter", pick: ["teams", "maxScore"] },
});
