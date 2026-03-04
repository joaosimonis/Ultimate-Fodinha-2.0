<template>
  <v-card rounded="lg" :class="{ 'player-eliminated': player.isEliminated, 'player-hit': shakeActive }" :elevation="player.isEliminated ? 0 : 2">
    <v-card-text class="pa-4">
      <div class="d-flex align-center justify-space-between">
        <v-avatar size="48" class="mr-3 flex-shrink-0">
          <v-img :src="getAvatarUrl(player.name)" :alt="player.name" />
        </v-avatar>
        <div class="flex-grow-1 mr-3">
          <p class="text-subtitle-1 font-weight-bold mb-1" :class="{ 'text-medium-emphasis': player.isEliminated }">
            {{ player.isEliminated ? "💀" : "" }} {{ player.name }}
          </p>
          <div class="d-flex flex-wrap ga-1">
            <span v-for="life in initialLives" :key="life" class="life-icon" :class="getLifeClasses(life)"> ❤️ </span>
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
import { onUnmounted, ref, watch } from "vue";
import type { FodinhaPlayer } from "@/modules/fodinha/types/fodinha.types";
import { getAvatarUrl } from "@/shared/utils/avatar";
import messiPutoAudio1 from "@/assets/messi-puto-1.mp3";
import messiPutoAudio2 from "@/assets/messi-puto-2.ogg";
import messiAudio4 from "@/assets/audio-messi-4.ogg";

interface FodinhaPlayerCardProps {
  player: FodinhaPlayer;
  initialLives: number;
}

const props = defineProps<FodinhaPlayerCardProps>();
const emit = defineEmits<{
  "add-life": [playerId: string];
  "remove-life": [playerId: string];
}>();

const removeLifeAudios = [messiPutoAudio1, messiPutoAudio2, messiAudio4];
const shakeActive = ref(false);
const breakingLife = ref<number | null>(null);
let shakeTimeout: ReturnType<typeof setTimeout> | null = null;
let breakTimeout: ReturnType<typeof setTimeout> | null = null;

const clearFeedbackTimeouts = () => {
  if (shakeTimeout) clearTimeout(shakeTimeout);
  if (breakTimeout) clearTimeout(breakTimeout);
};

const startDamageFeedback = () => {
  clearFeedbackTimeouts();
  shakeActive.value = false;
  requestAnimationFrame(() => {
    shakeActive.value = true;
    shakeTimeout = setTimeout(() => {
      shakeActive.value = false;
    }, 320);
  });
};

watch(
  () => props.player.lives,
  (currentLives, previousLives) => {
    if (currentLives < previousLives) {
      breakingLife.value = currentLives + 1;
      breakTimeout = setTimeout(() => {
        breakingLife.value = null;
      }, 420);
    }
  }
);

const getLifeClasses = (life: number) => ({
  "life-lost": life > props.player.lives,
  "life-broken": life === breakingLife.value,
});

const handleRemoveLife = (playerId: string) => {
  startDamageFeedback();
  const randomAudioSrc = removeLifeAudios[Math.floor(Math.random() * removeLifeAudios.length)];
  const audio = new Audio(randomAudioSrc);
  audio.volume = 1;
  void audio.play().catch(() => {
    // Ignore playback errors and keep game interaction responsive.
  });
  emit("remove-life", playerId);
};

onUnmounted(() => {
  clearFeedbackTimeouts();
});
</script>

<style scoped>
.player-eliminated {
  opacity: 0.45;
}

.life-icon {
  font-size: 20px;
  display: inline-block;
  transition: opacity 0.25s ease;
}

.life-lost {
  opacity: 0.15;
  filter: grayscale(1);
}

.life-broken {
  animation: heart-break 0.42s cubic-bezier(0.22, 0.9, 0.31, 1);
}

.player-hit {
  animation: player-shake 0.32s ease;
}

@keyframes player-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-4px);
  }
  40% {
    transform: translateX(4px);
  }
  60% {
    transform: translateX(-3px);
  }
  80% {
    transform: translateX(3px);
  }
}

@keyframes heart-break {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  35% {
    transform: scale(1.25) rotate(-8deg);
  }
  70% {
    transform: scale(0.9) rotate(8deg) translateY(2px);
    opacity: 0.55;
  }
  100% {
    transform: scale(0.78) rotate(-12deg) translateY(4px);
    opacity: 0.15;
  }
}
</style>
