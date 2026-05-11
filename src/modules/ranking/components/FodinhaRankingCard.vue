<template>
  <v-card rounded="lg" :elevation="position <= 3 ? 2 : 1">
    <v-card-text class="pa-4">
      <div class="d-flex align-center ga-3">
        <div class="position-badge">
          <span v-if="position === 1">🥇</span>
          <span v-else-if="position === 2">🥈</span>
          <span v-else-if="position === 3">🥉</span>
          <span v-else class="text-caption text-medium-emphasis font-weight-bold">{{ position }}</span>
        </div>

        <v-avatar size="48">
          <v-img :src="getPlayerAvatarUrl(stats.avatar_key)" :alt="stats.name" />
        </v-avatar>

        <div class="flex-grow-1">
          <p class="text-subtitle-2 font-weight-bold mb-0">{{ stats.name }}</p>
          <p class="games-played text-medium-emphasis mb-0">{{ stats.games_played }} jogos</p>
        </div>

        <div class="medals">
          <span class="medal">🥇 {{ stats.gold_medals }}</span>
          <span class="medal">🥈 {{ stats.silver_medals }}</span>
          <span class="medal">🥉 {{ stats.bronze_medals }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { getPlayerAvatarUrl } from "@/shared/utils/avatar";
import type { FodinhaRankingResponse } from "@/modules/ranking/types/ranking.types";

defineProps<{
  stats: FodinhaRankingResponse;
  position: number;
}>();
</script>

<style scoped>
.position-badge {
  width: 28px;
  text-align: center;
  font-size: 22px;
  flex-shrink: 0;
}

.medals {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.medal {
  color: rgba(var(--v-theme-on-surface));
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
}

.games-played {
  font-size: 0.82rem;
  line-height: 1.15;
}
</style>
