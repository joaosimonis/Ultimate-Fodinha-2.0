<template>
  <v-card rounded="lg" :class="{ 'player-eliminated': player.isEliminated }" :elevation="player.isEliminated ? 0 : 2">
    <v-card-text class="pa-4">
      <div class="d-flex align-center justify-space-between">
        <div class="flex-grow-1 mr-3">
          <p class="text-subtitle-1 font-weight-bold mb-1" :class="{ 'text-medium-emphasis': player.isEliminated }">{{ player.isEliminated ? "💀" : "" }} {{ player.name }}</p>
          <div class="d-flex flex-wrap ga-1">
            <span v-for="life in initialLives" :key="life" class="life-icon" :class="{ 'life-lost': life > player.lives }"> ❤️ </span>
          </div>
        </div>

        <div class="d-flex align-center ga-2">
          <v-btn icon variant="tonal" color="success" size="small" :disabled="player.isEliminated" @click="$emit('add-life', player.id)">
            <v-icon icon="mdi-plus" />
          </v-btn>

          <v-btn icon variant="flat" color="error" size="small" :disabled="player.isEliminated" @click="handleRemoveLife(player.id)">
            <v-icon icon="mdi-minus" />
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { FodinhaPlayer } from "@/modules/fodinha/fodinha.types";
import messiPutoAudio1 from "@/assets/messi-puto-1.mp3";
import messiPutoAudio2 from "@/assets/messi-puto-2.ogg";
import messiAudio4 from "@/assets/audio-messi-4.ogg";

interface FodinhaPlayerCardProps {
  player: FodinhaPlayer;
  initialLives: number;
}

defineProps<FodinhaPlayerCardProps>();
const emit = defineEmits<{
  "add-life": [playerId: string];
  "remove-life": [playerId: string];
}>();

const removeLifeAudios = [messiPutoAudio1, messiPutoAudio2, messiAudio4];

const handleRemoveLife = (playerId: string) => {
  const randomAudioSrc = removeLifeAudios[Math.floor(Math.random() * removeLifeAudios.length)];
  const audio = new Audio(randomAudioSrc);
  audio.volume = 1;
  void audio.play().catch(() => {
    // Ignore playback errors and keep game interaction responsive.
  });
  emit("remove-life", playerId);
};
</script>

<style scoped>
.player-eliminated {
  opacity: 0.45;
}

.life-icon {
  font-size: 20px;
  transition: opacity 0.3s ease;
}

.life-lost {
  opacity: 0.15;
  filter: grayscale(1);
}
</style>
