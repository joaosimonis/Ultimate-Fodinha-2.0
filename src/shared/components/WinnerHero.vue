<template>
  <div class="winner-hero">
    <!-- Avatar do vencedor + coroa -->
    <div class="winner-hero__avatar-wrapper mt-6">
      <LottieAnimation :src="CrownAnimation" :size="80" :autoplay="true" :loop="true" class="winner-hero__crown" />
      <v-avatar size="96" class="winner-hero__avatar">
        <v-img :src="getAvatarUrl(winnerName)" :alt="winnerName" />
      </v-avatar>
    </div>

    <p class="text-h5 font-weight-bold mt-3 mb-0">{{ winnerName }}</p>
    <p class="text-medium-emphasis mt-1">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import LottieAnimation from "@/shared/components/LottieAnimation.vue";
import CrownAnimation from "@/assets/animation/Crown.json";
import { getAvatarUrl } from "@/shared/utils/avatar";

interface WinnerHeroProps {
  winnerName: string;
  subtitle?: string;
}

withDefaults(defineProps<WinnerHeroProps>(), {
  subtitle: "venceu a partida!",
});
</script>

<style scoped>
.winner-hero {
  display: grid;
  justify-items: center;
  gap: 0;
}

.winner-hero__avatar-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.winner-hero__crown {
  position: absolute;
  top: -52px;
  z-index: 1;
}

.winner-hero__avatar {
  border: 3px solid #f4c542;
  box-shadow: 0 0 16px rgba(244, 197, 66, 0.5);
}
</style>
