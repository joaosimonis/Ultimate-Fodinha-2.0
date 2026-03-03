<template>
  <div class="home-page d-flex flex-column">
    <AppHeader />
    <v-container class="content flex-grow-1 d-flex align-center justify-center">
      <div class="home-wrapper text-center">
        <h1 class="text-h4 font-weight-bold mb-2">Ultimate Fodinha 2.0</h1>
        <p class="mb-6 text-medium-emphasis">Contador rápido para Truco e Fodinha</p>
        <div class="d-flex flex-column ga-4">
          <v-btn block class="text-white" color="primary" rounded="lg" size="x-large" @click="goToTruco">
            <v-icon start icon="mdi-cards" /> 
            <span>Truco</span>
          </v-btn>
          <v-btn block class="text-white" color="secondary" rounded="lg" size="x-large" @click="goToFodinha">
            <v-icon start icon="mdi-cards-spade" /> 
            <span>Fodinha</span>
          </v-btn>
          <v-btn block class="text-white" color="amber-darken-1" rounded="lg" size="x-large" @click="goToRanking">
            <v-icon start icon="mdi-trophy" />
            <span>Ranking</span>
          </v-btn>
          <v-btn block class="text-white" color="teal-darken-2" rounded="lg" size="x-large" @click="goToPlayers">
            <v-icon start icon="mdi-account-plus" />
            <span>Adicionar jogadores</span>
          </v-btn>
        </div>
        <div class="mt-8">
          <span class="text-caption text-medium-emphasis">Versão 2.0</span>
        </div>
      </div>
    </v-container>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "@/shared/components/AppHeader.vue";
import AppFooter from "@/shared/components/AppFooter.vue";
import messiIntroducaoAudio from "@/assets/messi-introducao.ogg";

const router = useRouter();

const goToTruco = () => router.push({ name: "truco-setup" });
const goToFodinha = () => router.push({ name: "fodinha-setup" });
const goToRanking = () => router.push({ name: "ranking" });
const goToPlayers = () => router.push({ name: "players" });

const introAudio = new Audio(messiIntroducaoAudio);
introAudio.volume = 1;

const playIntroAudio = () => {
  void introAudio.play().catch(() => {
    // Ignore playback errors and wait for user interaction fallback.
  });
};

const handleFirstInteraction = () => {
  playIntroAudio();
};

const removeInteractionFallback = () => {
  window.removeEventListener("pointerdown", handleFirstInteraction);
  window.removeEventListener("keydown", handleFirstInteraction);
};

let introDelayTimeout: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  introDelayTimeout = setTimeout(() => {
    void introAudio.play().catch(() => {
      window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
      window.addEventListener("keydown", handleFirstInteraction, { once: true });
    });
  }, 1000);
});

onUnmounted(() => {
  if (introDelayTimeout) {
    clearTimeout(introDelayTimeout);
  }
  removeInteractionFallback();
  introAudio.pause();
  introAudio.currentTime = 0;
});
</script>

<style scoped>
.home-page {
  height: 100%;
}

.home-wrapper {
  max-width: 480px;
  width: 100%;
  padding: 16px;
}

.content {
  padding: 16px;
}
</style>
