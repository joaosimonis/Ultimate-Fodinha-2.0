<template>
  <div class="game-page d-flex flex-column">
    <SetupHeader title="Fodinha" title-icon="mdi-cards-spade" @back="openExitConfirmation" />

    <v-container class="flex-grow-1 py-4">
      <div class="game-wrapper mx-auto">
        <v-slide-y-transition group>
          <div v-for="player in fodinhaStore.players" :key="player.id" class="mb-3">
            <FodinhaPlayerCard
              :player="player"
              :initial-lives="fodinhaStore.initialLives"
              @add-life="fodinhaStore.addLife"
              @remove-life="fodinhaStore.removeLife"
            />
          </div>
        </v-slide-y-transition>
      </div>
    </v-container>

    <v-dialog v-model="confirmExit" max-width="320">
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-5">Sair da partida?</v-card-title>
        <v-card-text class="px-5">O progresso será perdido.</v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn variant="tonal" rounded="lg" @click="closeExitConfirmation">Cancelar</v-btn>
          <v-btn color="error" variant="flat" rounded="lg" @click="exitGame">Sair</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <FodinhaWinnerDialog
      v-model="showWinner"
      :winner="fodinhaStore.winner ?? null"
      :top-three="topThree"
      @new-game="newGameSamePlayers"
      @reconfigure="reconfigure"
      @go-home="goHome"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";

import SetupHeader from "@/shared/components/SetupHeader.vue";
import FodinhaPlayerCard from "@/modules/fodinha/components/FodinhaPlayerCard.vue";
import FodinhaWinnerDialog from "@/modules/fodinha/components/FodinhaWinnerDialog.vue";
import { useFodinhaGame } from "@/modules/fodinha/composables/useFodinhaGame";
import { useWakeLock } from "@/shared/composables/useWakeLock";
import { useConfetti } from "@/shared/composables/useConfetti";

const { fireConfetti } = useConfetti();
const { request } = useWakeLock();
const { fodinhaStore, confirmExit, showWinner, topThree, openExitConfirmation, closeExitConfirmation, exitGame, newGameSamePlayers, reconfigure, goHome } = useFodinhaGame();

watch(
  () => fodinhaStore.winner, 
  (winner) => {
    if (winner) {
      showWinner.value = true
      fireConfetti()
    }
  }
)

onMounted(() => {
  void request()
})
</script>

<style scoped>
.game-page {
  height: 100%;
}

.game-wrapper {
  max-width: 480px;
  width: 100%;
}
</style>
