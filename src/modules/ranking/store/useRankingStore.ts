import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { PlayerStats, TeamStats } from "../types/ranking.types";

export const useRankingStore = defineStore(
  "ranking",
  () => {
    const fodinhPlayerStats = ref<Record<string, PlayerStats>>({});
    const trucoPlayerStats = ref<Record<string, PlayerStats>>({});
    const trucoTeamStats = ref<Record<string, TeamStats>>({});

    // --- Helpers ---
    const calcWinRate = (wins: number, games: number): number => (games === 0 ? 0 : Math.round((wins / games) * 100));

    const getOrCreatePlayerStats = (store: Record<string, PlayerStats>, playerId: string, playerName: string): PlayerStats => {
      if (!store[playerId]) {
        store[playerId] = { playerId, playerName, wins: 0, losses: 0, gamesPlayed: 0, winRate: 0 };
      }
      return store[playerId];
    };

    const getOrCreateTeamStats = (playerNames: string[]): TeamStats => {
      const key = [...playerNames].sort().join("+");
      if (!trucoTeamStats.value[key]) {
        trucoTeamStats.value[key] = { teamKey: key, playerNames, wins: 0, losses: 0, gamesPlayed: 0, winRate: 0 };
      }
      return trucoTeamStats.value[key];
    };

    // --- Registrar resultado Fodinha ---
    const registerFodinhaResult = (players: { id: string; name: string }[], winnerId: string) => {
      players.forEach((p) => {
        const stats = getOrCreatePlayerStats(fodinhPlayerStats.value, p.id, p.name);
        stats.gamesPlayed += 1;
        if (p.id === winnerId) stats.wins += 1;
        else stats.losses += 1;
        stats.winRate = calcWinRate(stats.wins, stats.gamesPlayed);
      });
    };

    // --- Registrar resultado Truco ---
    const registerTrucoResult = (teams: { players: { id: string; name: string }[] }[], winnerIndex: number) => {
      teams.forEach((team, index) => {
        const isWinner = index === winnerIndex;
        const teamStats = getOrCreateTeamStats(team.players.map((p) => p.name));
        teamStats.gamesPlayed += 1;
        if (isWinner) teamStats.wins += 1;
        else teamStats.losses += 1;
        teamStats.winRate = calcWinRate(teamStats.wins, teamStats.gamesPlayed);

        team.players.forEach((p) => {
          const stats = getOrCreatePlayerStats(trucoPlayerStats.value, p.id, p.name);
          stats.gamesPlayed += 1;
          if (isWinner) stats.wins += 1;
          else stats.losses += 1;
          stats.winRate = calcWinRate(stats.wins, stats.gamesPlayed);
        });
      });
    };

    // --- Getters ordenados ---
    const fodinhRanking = computed(() => Object.values(fodinhPlayerStats.value).sort((a, b) => b.wins - a.wins || b.winRate - a.winRate));

    const trucoPlayerRanking = computed(() => Object.values(trucoPlayerStats.value).sort((a, b) => b.wins - a.wins || b.winRate - a.winRate));

    const trucoTeamRanking = computed(() => Object.values(trucoTeamStats.value).sort((a, b) => b.wins - a.wins || b.winRate - a.winRate));

    const clearAll = () => {
      fodinhPlayerStats.value = {};
      trucoPlayerStats.value = {};
      trucoTeamStats.value = {};
    };

    return {
      fodinhRanking,
      trucoPlayerRanking,
      trucoTeamRanking,
      registerFodinhaResult,
      registerTrucoResult,
      clearAll,
    };
  },
  { persist: true }
);
