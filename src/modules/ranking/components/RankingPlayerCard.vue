<template>
  <v-card rounded="lg" :elevation="position <= 3 ? 2 : 1">
    <v-card-text class="pa-4">
      <div class="d-flex align-center ga-3">
        <!-- Posição -->
        <div class="position-badge">
          <span v-if="position === 1">🥇</span>
          <span v-else-if="position === 2">🥈</span>
          <span v-else-if="position === 3">🥉</span>
          <span v-else class="text-caption text-medium-emphasis font-weight-bold">{{ position }}</span>
        </div>

        <!-- Avatar -->
        <v-avatar size="48">
          <v-img :src="getAvatarUrl(stats.playerName)" :alt="stats.playerName" />
        </v-avatar>

        <!-- Nome + stats -->
        <div class="flex-grow-1">
          <p class="text-subtitle-2 font-weight-bold mb-1">{{ stats.playerName }}</p>
          <div class="d-flex ga-3">
            <span class="text-caption text-medium-emphasis">{{ stats.gamesPlayed }} jogos</span>
            <span class="text-caption text-success font-weight-bold">{{ stats.wins }}V</span>
            <span class="text-caption text-error font-weight-bold">{{ stats.losses }}D</span>
          </div>
        </div>

        <!-- Win rate -->
        <div class="text-right">
          <p class="text-h6 font-weight-black" :class="winRateColor">{{ stats.winRate }}%</p>
          <p class="text-caption text-medium-emphasis">taxa</p>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getAvatarUrl } from "@/shared/utils/avatar";
import type { PlayerStats } from "../types/ranking.types";

const props = defineProps<{
  stats: PlayerStats;
  position: number;
}>();

const winRateColor = computed(() => {
  if (props.stats.winRate >= 60) return "text-success";
  if (props.stats.winRate >= 40) return "text-warning";
  return "text-error";
});
</script>

<style scoped>
.position-badge {
  width: 28px;
  text-align: center;
  font-size: 22px;
  flex-shrink: 0;
}
</style>
