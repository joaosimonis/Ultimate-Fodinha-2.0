<template>
  <v-dialog :model-value="modelValue" persistent max-width="360" @update:model-value="$emit('update:modelValue', $event)">
    <v-card rounded="lg" class="text-center">
      <v-card-text class="pa-6">
        <WinnerHero class="mb-4" :winner-name="winner?.name ?? ''" tone="secondary" />
        <div v-if="topThree.length > 1" class="mb-6 text-left">
          <p class="text-subtitle-2 font-weight-bold mb-2">Ranking</p>
          <div v-for="(player, index) in topThree" :key="player.id" class="d-flex align-center ga-2 mb-1">
            <span>{{ medals[index] }}</span>
            <span>{{ player.name }}</span>
          </div>
        </div>
        <div class="d-flex flex-column ga-3">
          <v-btn color="secondary" variant="flat" rounded="lg" size="large" @click="$emit('new-game')">
            <v-icon start icon="mdi-refresh" />
            <span>Revanche</span>
          </v-btn>
          <v-btn color="surface-variant" variant="tonal" rounded="lg" size="large" @click="$emit('reconfigure')">
            <v-icon start icon="mdi-cog" />
            <span>Novo jogo</span>
          </v-btn>
          <v-btn class="winner-dialog__home-btn" variant="outlined" color="medium-emphasis" rounded="lg" size="large" @click="$emit('go-home')">
            <v-icon start icon="mdi-home" />
            <span>Início</span>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { FodinhaPlayer } from "@/modules/fodinha/types/fodinha.types";
import WinnerHero from "@/shared/components/WinnerHero.vue";

interface FodinhaWinnerDialogProps {
  modelValue: boolean;
  winner: FodinhaPlayer | null;
  topThree: FodinhaPlayer[];
}

defineProps<FodinhaWinnerDialogProps>();
defineEmits<{
  "update:modelValue": [value: boolean];
  "new-game": [];
  reconfigure: [];
  "go-home": [];
}>();

const medals = ["🥇", "🥈", "🥉"];
</script>

<style scoped>
.winner-dialog__home-btn {
  background: rgba(var(--v-theme-on-surface), 0.03);
  border-color: rgba(var(--v-theme-on-surface), 0.08);
}
</style>
