<template>
  <v-dialog :model-value="modelValue" persistent max-width="360" @update:model-value="$emit('update:modelValue', $event)">
    <v-card rounded="lg" class="text-center">
      <v-card-text class="pa-6">
        <p class="text-h2 mb-2">🏆</p>
        <p class="text-h5 font-weight-bold mb-1">{{ winner?.name }}</p>
        <p class="text-medium-emphasis mb-6">venceu a partida!</p>
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
            <span>Novo jogo</span>
          </v-btn>
          <v-btn variant="tonal" rounded="lg" size="large" @click="$emit('reconfigure')">
            <v-icon start icon="mdi-cog" />
            <span>Reconfigurar</span>
          </v-btn>
          <v-btn variant="text" rounded="lg" @click="$emit('go-home')">
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
