<template>
  <div class="home-page d-flex flex-column">
    <Transition name="home-splash" @after-leave="revealHome">
      <HomeSplash v-if="isSplashVisible" @complete="finishSplash" />
    </Transition>

    <template v-if="isHomeReady">
      <AppHeader />

      <v-container class="content flex-grow-1 d-flex align-center justify-center">
        <div class="home-wrapper text-center">
          <h1 class="text-h4 font-weight-bold mb-2">Ultimate Fodinha 2.0</h1>
          <p class="mb-6 text-medium-emphasis">Contador rápido para Truco e Fodinha</p>
          <div class="d-flex flex-column ga-4">
            <v-btn block class="text-white" color="primary" rounded="lg" size="x-large" @click="goToTruco">
              <v-icon icon="mdi-cards" start />
              <span>Truco</span>
            </v-btn>
            <v-btn block class="text-white" color="blue-grey" rounded="lg" size="x-large" @click="goToCounter">
              <v-icon icon="mdi-counter" start />
              <span>Contador tradicional</span>
            </v-btn>
            <v-btn block class="text-white" color="secondary" rounded="lg" size="x-large" @click="goToFodinha">
              <v-icon icon="mdi-cards-spade" start />
              <span>Fodinha</span>
            </v-btn>
            <v-btn block class="text-white" color="deep-purple" rounded="lg" size="x-large" @click="goToRooms">
              <v-icon icon="mdi-lan-connect" start />
              <span>Partidas em andamento</span>
            </v-btn>
            <v-btn block class="text-white" color="amber-darken-1" rounded="lg" size="x-large" @click="goToRanking">
              <v-icon icon="mdi-trophy" start />
              <span>Ranking</span>
            </v-btn>
            <v-btn block class="text-white" color="teal-darken-2" rounded="lg" size="x-large" @click="goToPlayers">
              <v-icon icon="mdi-account-group" start />
              <span>Personagens</span>
            </v-btn>
          </div>
          <div class="mt-8">
            <span class="text-caption text-medium-emphasis">Versão 2.0</span>
          </div>
        </div>
      </v-container>

      <AppFooter />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import HomeSplash from "@/modules/home/components/HomeSplash.vue";
import { useHomeIntroAudio } from "@/modules/home/composables/useHomeIntroAudio";
import { useHomeSplash } from "@/modules/home/composables/useHomeSplash";
import AppFooter from "@/shared/components/AppFooter.vue";
import AppHeader from "@/shared/components/AppHeader.vue";

const router = useRouter();

const goToTruco = () => router.push({ name: "truco-setup" });
const goToCounter = () => router.push({ name: "counter-setup" });
const goToFodinha = () => router.push({ name: "fodinha-setup" });
const goToRooms = () => router.push({ name: "rooms" });
const goToRanking = () => router.push({ name: "ranking" });
const goToPlayers = () => router.push({ name: "players" });

const { isSplashVisible, isHomeReady, finishSplash, revealHome } = useHomeSplash();
useHomeIntroAudio(isHomeReady);
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

.home-splash-leave-active {
  transition: opacity 180ms ease-out;
}

.home-splash-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .home-splash-leave-active {
    transition: none;
  }
}
</style>
