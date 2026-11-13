<template>
  <div class="winner-hero">
    <GauderioAnimation state="victory" :size="160" />
    <div class="winner-hero__avatars-wrapper">
      <v-avatar v-for="(name, index) in winners" :key="`${index}-${name}`" :size="winners.length === 1 ? 96 : 72" class="winner-hero__avatar">
        <v-img :src="getPlayerAvatarUrl(name)" :alt="name" />
      </v-avatar>
    </div>

    <!-- Nome e subtítulo -->
    <p class="text-h5 font-weight-bold mt-3 mb-0">{{ winnerName }}</p>
    <p class="text-medium-emphasis mt-1">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import GauderioAnimation from "@/shared/components/GauderioAnimation.vue";
import { getPlayerAvatarUrl } from "@/shared/utils/avatar";

interface WinnerHeroProps {
  winnerName: string;
  winners: string[];
  subtitle?: string;
}

withDefaults(defineProps<WinnerHeroProps>(), {
  subtitle: "venceu a partida!",
});
</script>

<style scoped>
.winner-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  overflow-wrap: anywhere;
}

.winner-hero__avatars-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  max-width: 100%;
}

.winner-hero__avatar {
  border: 3px solid #f4c542;
  box-shadow: 0 0 16px rgba(244, 197, 66, 0.5);
}
</style>
