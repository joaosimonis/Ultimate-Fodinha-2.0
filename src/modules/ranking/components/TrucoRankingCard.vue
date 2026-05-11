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

        <div class="team-avatars">
          <v-avatar v-for="(player, index) in stats.players" :key="player.id" size="36" :style="{ marginLeft: index > 0 ? '-10px' : '0', zIndex: stats.players.length - index }">
            <v-img :src="getPlayerAvatarUrl(player.avatar_key)" :alt="player.name" />
          </v-avatar>
        </div>

        <div class="flex-grow-1">
          <p class="text-subtitle-2 font-weight-bold mb-0">{{ teamName }}</p>
          <p class="games-played text-medium-emphasis mb-0">{{ stats.games_played }} jogos</p>
        </div>

        <div class="record">
          <span class="record__wins">{{ stats.wins }}V</span>
          <span class="record__losses">{{ stats.losses }}D</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getPlayerAvatarUrl } from "@/shared/utils/avatar";
import type { TrucoTeamRankingResponse } from "@/modules/ranking/types/ranking.types";

const props = defineProps<{
  stats: TrucoTeamRankingResponse;
  position: number;
}>();

const teamName = computed(() => props.stats.players.map((player) => player.name).join(" + "));
</script>

<style scoped>
.position-badge {
  width: 28px;
  text-align: center;
  font-size: 22px;
  flex-shrink: 0;
}

.team-avatars {
  display: flex;
  flex-shrink: 0;
  min-width: 64px;
}

.games-played {
  font-size: 0.82rem;
  line-height: 1.15;
}

.record {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.record__wins,
.record__losses {
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
}

.record__wins {
  color: rgb(var(--v-theme-success));
}

.record__losses {
  color: rgb(var(--v-theme-error));
}
</style>
