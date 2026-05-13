<template>
  <div class="game-page d-flex flex-column">
    <SetupHeader title="Fodinha" title-icon="mdi-cards-spade" @back="openExitConfirmation">
      <template #actions>
        <div class="header-actions">
          <v-chip v-if="fodinhaStore.roomCode" :color="roomSocket.status.value === 'connected' ? 'success' : 'medium-emphasis'" variant="tonal" size="small" prepend-icon="mdi-broadcast" rounded="lg">
            {{ roomSocket.viewerCount.value }}
          </v-chip>

          <v-chip v-if="fodinhaStore.roomCode" color="secondary" variant="tonal" size="small" prepend-icon="mdi-pound" rounded="lg">
            {{ fodinhaStore.roomCode }}
          </v-chip>
        </div>
      </template>
    </SetupHeader>

    <v-container class="flex-grow-1 py-4">
      <div class="game-wrapper mx-auto">
        <v-slide-y-transition group>
          <div v-for="player in fodinhaStore.players" :key="player.id" class="mb-3">
            <FodinhaPlayerCard
              :player="player"
              :initial-lives="fodinhaStore.initialLives"
              :active-players-count="fodinhaStore.activePlayers.length"
              @add-life="addLife"
              @remove-life="removeLife"
            />
          </div>
        </v-slide-y-transition>
      </div>
    </v-container>

    <v-dialog v-model="confirmExit" max-width="320">
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-5">Sair da partida?</v-card-title>
        <v-card-text class="px-5">Você poderá voltar enquanto a partida estiver salva neste dispositivo.</v-card-text>
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
      :finish-error="finishError"
      :is-finishing="isFinishing"
      :is-starting-rematch="isStartingRematch"
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
import { useRoomSocket } from "@/modules/rooms/composables/useRoomSocket";
import { useWakeLock } from "@/shared/composables/useWakeLock";
import { useConfetti } from "@/shared/composables/useConfetti";
import temaDaVitoriaAudio from "@/assets/audios/vitoria/tema-da-vitoria.mp3";

const { fireConfetti } = useConfetti();
const { request } = useWakeLock();
const { fodinhaStore, confirmExit, showWinner, topThree, isFinishing, isStartingRematch, finishError, openExitConfirmation, closeExitConfirmation, exitGame, newGameSamePlayers, reconfigure, goHome } = useFodinhaGame();
const roomSocket = useRoomSocket();
const victoryAudio = new Audio(temaDaVitoriaAudio);
victoryAudio.volume = 1;

const getLivesByPlayerId = () =>
  fodinhaStore.players.reduce<Record<string, number>>((livesByPlayerId, player) => {
    livesByPlayerId[player.id] = player.lives;
    return livesByPlayerId;
  }, {});

const publishLives = () => {
  if (!fodinhaStore.hostToken) return;

  roomSocket.sendRoomState(
    {
      mode: "fodinha",
      lives: getLivesByPlayerId(),
    },
    fodinhaStore.hostToken
  );
};

const addLife = (playerId: string) => {
  fodinhaStore.addLife(playerId);
  publishLives();
};

const removeLife = (playerId: string) => {
  fodinhaStore.removeLife(playerId);
  publishLives();
};

watch(
  () => roomSocket.liveState.value?.lives,
  (lives) => {
    if (lives) {
      fodinhaStore.syncLives(lives);
    }
  }
);

watch(
  () => fodinhaStore.winner, 
  (winner) => {
    if (winner) {
      showWinner.value = true
      fireConfetti()
      void victoryAudio.play().catch(() => {
        // Ignore playback errors and keep winner flow responsive.
      });
    }
  }
)

onMounted(() => {
  void request();

  if (fodinhaStore.roomCode) {
    roomSocket.connect(fodinhaStore.roomCode);
  }
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
