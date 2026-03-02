<template>
  <v-card rounded="lg" :elevation="2">
    <v-card-text class="pa-4">
      <!-- Nome da equipe + placar -->
      <div class="d-flex align-center justify-space-between mb-3">
        <div>
          <p class="text-caption text-medium-emphasis mb-0">Equipe</p>
          <p class="text-subtitle-1 font-weight-bold">{{ trucoStore.teamName(team) }}</p>
        </div>
        <div class="text-right">
          <p class="score-display font-weight-black" :style="{ color: `rgb(var(--v-theme-${color}))` }">
            {{ team.score }}
          </p>
          <p class="text-caption text-medium-emphasis">/ {{ maxScore }}</p>
        </div>
      </div>

      <!-- Avatares dos jogadores -->
      <div class="d-flex ga-2 mb-4">
        <div v-for="player in team.players" :key="player.id" class="d-flex align-center ga-1">
          <v-avatar size="32">
            <v-img :src="getAvatarUrl(player.name)" :alt="player.name" />
          </v-avatar>
          <span class="text-caption">{{ player.name }}</span>
        </div>
      </div>

      <!-- Botão +1 -->
      <v-btn block :color="color" size="x-large" rounded="lg" class="text-white" :disabled="!!trucoStore.winner" @click="$emit('add-point')">
        <v-icon start icon="mdi-plus" size="28" />
        <span class="text-h6">+1 Ponto</span>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useTrucoStore } from "@/modules/truco/store/useTrucoStore";
import { getAvatarUrl } from "@/shared/utils/avatar";
import type { TrucoTeam } from "../types/truco.types";

defineProps<{
  team: TrucoTeam;
  maxScore: number;
  color: string;
}>();

defineEmits<{
  "add-point": [];
}>();

const trucoStore = useTrucoStore();
</script>

<style scoped>
.score-display {
  font-size: 2.5rem;
  line-height: 1;
}
</style>
