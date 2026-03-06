<template>
  <div class="setup-page d-flex flex-column">
    <SetupPageHeader title="Fodinha" title-icon="mdi-cards-spade" />

    <v-container class="flex-grow-1 py-6">
      <div class="setup-wrapper mx-auto">
        <div class="mb-6">
          <p class="text-subtitle-1 font-weight-bold mb-3">Jogadores</p>
          <ChampionSelect v-model="selectedPlayers" />
        </div>
        <div class="mb-8">
          <p class="text-subtitle-1 font-weight-bold mb-3">Vidas iniciais</p>
          <div class="d-flex ga-3">
            <v-btn v-for="option in livesOptions" :key="option" :color="selectedLives === option ? 'secondary' : undefined" :variant="selectedLives === option ? 'flat' : 'outlined'" class="flex-grow-1" size="large" rounded="lg" @click="selectedLives = option"> ❤️ {{ option }} </v-btn>
          </div>
        </div>
        <v-btn block color="secondary" size="x-large" rounded="lg" class="text-white" :disabled="!canStart" @click="startGame">
          <v-icon start icon="mdi-play" />
          <span>Iniciar Jogo</span>
        </v-btn>
        <p v-if="!canStart && selectedPlayers.length < FODINHA_MIN_PLAYERS" class="text-caption text-medium-emphasis text-center mt-3">
          Adicione pelo menos {{ FODINHA_MIN_PLAYERS }} jogadores para iniciar
        </p>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import SetupPageHeader from "@/shared/components/SetupHeader.vue";
import { FODINHA_MIN_PLAYERS } from "@/modules/fodinha/constants/fodinha.constants";
import { useFodinhaSetup } from "@/modules/fodinha/composables/useFodinhaSetup";
import { useFodinhaStore } from "@/modules/fodinha/store/useFodinhaStore";
import ChampionSelect from "@/shared/ChampionSelect.vue";
import type { RegisteredPlayer } from "@/shared/types/players.types";

const router = useRouter();
const fodinhaStore = useFodinhaStore();
const { selectedLives, livesOptions } = useFodinhaSetup();
const selectedPlayers = ref<RegisteredPlayer[]>([])
const canStart = computed(() => selectedPlayers.value.length >= FODINHA_MIN_PLAYERS)

const startGame = () => {
  fodinhaStore.setup({
    players: selectedPlayers.value,
    initialLives: selectedLives.value,
  })
  router.push({ name: "fodinha-game" });
};
</script>

<style scoped>
.setup-page {
  height: 100%;
}

.setup-wrapper {
  max-width: 480px;
  width: 100%;
}
</style>
