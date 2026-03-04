<template>
  <v-card rounded="lg" :elevation="2">
    <v-card-text class="pa-4">
      <!-- Nome da equipe + placar -->
      <div class="d-flex align-center justify-space-between mb-3">
        <div>
          <p class="text-caption text-medium-emphasis mb-0">Equipe {{ teamNumber }}</p>
          <p class="text-subtitle-1 font-weight-bold">{{ trucoStore.teamName(team) }}</p>
        </div>
        <p class="score-display font-weight-black" :class="{ 'score-display--pulse': scorePulseActive }" :style="{ color: `rgb(var(--v-theme-${color}))` }">
          {{ team.score }}<span class="text-caption text-medium-emphasis font-weight-regular"> /{{ maxScore }}</span>
        </p>
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

      <!-- Botões de pontuação -->
      <div class="d-flex ga-3 justify-end">
        <v-btn icon variant="tonal" color="grey" size="x-large" :disabled="!!trucoStore.winner || team.score === 0" @click="$emit('remove-point')">
          <v-icon icon="mdi-minus" size="28" />
        </v-btn>

        <v-btn icon :color="color" size="x-large" :disabled="!!trucoStore.winner" @click="$emit('add-point')">
          <v-icon icon="mdi-plus" size="28" />
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useTrucoStore } from "@/modules/truco/store/useTrucoStore";
import { getAvatarUrl } from "@/shared/utils/avatar";
import type { TrucoTeam } from "../types/truco.types";

const props = defineProps<{
  team: TrucoTeam;
  teamNumber: number;
  maxScore: number;
  color: string;
}>();

defineEmits<{
  "add-point": [];
  "remove-point": [];
}>();

const trucoStore = useTrucoStore();
const scorePulseActive = ref(false);

watch(
  () => props.team.score,
  () => {
    scorePulseActive.value = false;
    requestAnimationFrame(() => {
      scorePulseActive.value = true;
      setTimeout(() => {
        scorePulseActive.value = false;
      }, 320);
    });
  }
);
</script>

<style scoped>
.score-display {
  font-size: 2.5rem;
  line-height: 1;
  transform-origin: right center;
}

.score-display--pulse {
  animation: score-pulse 0.32s ease-out;
}

@keyframes score-pulse {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  45% {
    transform: scale(1.18);
    filter: brightness(1.35);
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}
</style>
