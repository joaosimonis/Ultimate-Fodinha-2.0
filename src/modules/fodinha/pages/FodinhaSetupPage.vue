<template>
  <div class="setup-page d-flex flex-column">
    <SetupPageHeader title="Fodinha" title-icon="mdi-cards-spade" />

    <v-container class="flex-grow-1 py-6">
      <div class="setup-wrapper mx-auto">
        <div class="mb-6">
          <p class="text-subtitle-1 font-weight-bold mb-3">Jogadores</p>
          <div class="d-flex ga-2 mb-4">
            <v-text-field v-model="playerNameInput" label="Nome do jogador" variant="outlined" density="comfortable" hide-details clearable @keyup.enter="addPlayer" />
            <v-btn icon color="secondary" size="large" :disabled="!canAddPlayer" @click="addPlayer">
              <v-icon icon="mdi-plus" />
            </v-btn>
          </div>
          <v-slide-y-transition>
            <p v-if="playerError" class="text-caption text-error mb-3">
              {{ playerError }}
            </p>
          </v-slide-y-transition>
          <v-slide-y-transition group>
            <v-list v-if="players.length > 0" rounded="lg" class="pa-0 mb-2">
              <template v-for="(player, index) in players" :key="player.id">
                <v-list-item :title="player.name" rounded="lg">
                  <template #prepend>
                    <v-avatar color="secondary" size="36" class="mr-3">
                      <span class="text-caption font-weight-bold text-white">{{ index + 1 }}</span>
                    </v-avatar>
                  </template>
                  <template #append>
                    <v-btn icon variant="text" size="small" color="error" @click="removePlayer(player.id)">
                      <v-icon icon="mdi-close" size="20" />
                    </v-btn>
                  </template>
                </v-list-item>
                <v-divider v-if="index < players.length - 1" class="mx-4" />
              </template>
            </v-list>
          </v-slide-y-transition>
          <div v-if="players.length === 0" class="text-center py-4">
            <v-icon icon="mdi-account-group-outline" size="40" class="text-medium-emphasis mb-2" />
            <p class="text-caption text-medium-emphasis">Adicione pelo menos {{ FODINHA_MIN_PLAYERS }} jogadores</p>
          </div>
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
        <p v-if="!canStart && players.length < FODINHA_MIN_PLAYERS" class="text-caption text-medium-emphasis text-center mt-3">Adicione pelo menos {{ FODINHA_MIN_PLAYERS }} jogadores para iniciar</p>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import SetupPageHeader from "@/shared/components/SetupHeader.vue";
import { FODINHA_MIN_PLAYERS } from "@/modules/fodinha/constants/fodinha.constants";
import { useFodinhaSetup } from "@/modules/fodinha/composables/useFodinhaSetup";
import { useFodinhaStore } from "@/modules/fodinha/store/useFodinhaStore";
import audioMessi1 from "@/assets/audio-messi-1.mp3";
import audioMessi2 from "@/assets/audio-messi-2.mp3";

const router = useRouter();
const fodinhaStore = useFodinhaStore();
const { players, playerNameInput, playerError, selectedLives, livesOptions, canAddPlayer, canStart, addPlayer, removePlayer } = useFodinhaSetup();

const startGame = () => {
  const clickAudio = new Audio(audioMessi2);
  clickAudio.volume = 1;
  void clickAudio.play().catch(() => {
    // Ignore playback errors and continue game start flow.
  });

  fodinhaStore.setup({
    players: players.value,
    initialLives: selectedLives.value,
  });
  router.push({ name: "fodinha-game" });
};

onMounted(() => {
  const audio = new Audio(audioMessi1);
  audio.volume = 1;
  void audio.play().catch(() => {
    // Ignore autoplay blocking errors until user interaction.
  });
});
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
