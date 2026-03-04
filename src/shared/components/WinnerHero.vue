<template>
  <div class="winner-hero">
    <LottieAnimation :src="trophyAnimation" :size="160" :autoplay="true" :loop="true" class="mx-auto" />

    <p class="text-h5 font-weight-bold mb-1 winner-hero__name">{{ winnerName }}</p>
    <p class="text-medium-emphasis">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import LottieAnimation from "@/shared/components/LottieAnimation.vue";
import trophyAnimation from "@/assets/animation/Trophy.json";

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

.winner-hero__name {
  margin-bottom: 0.1rem !important;
  line-height: 1.15;
}
</style>
