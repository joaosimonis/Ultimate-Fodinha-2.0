<template>
  <div class="game-page d-flex flex-column">
    <SetupHeader title="Fodinha" title-icon="mdi-cards-spade" @back="openExitConfirmation" />

    <v-container class="flex-grow-1 py-4">
      <div class="game-wrapper mx-auto">
        <RoomStatusBar class="mb-4" :room-code="fodinhaStore.roomCode" :is-host="isHost" :status="roomSocket.status.value" :viewer-count="roomSocket.viewerCount.value" color="secondary" />

        <v-slide-y-transition group>
          <div v-for="player in fodinhaStore.players" :key="player.id" class="mb-3">
            <FodinhaPlayerCard
              :player="player"
              :initial-lives="fodinhaStore.initialLives"
              :active-players-count="fodinhaStore.activePlayers.length"
              :readonly="!canControlRoom"
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
      :is-host="isHost"
      @new-game="newGameSamePlayers"
      @reconfigure="reconfigure"
      @go-home="goHome"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watch } from "vue";

import SetupHeader from "@/shared/components/SetupHeader.vue";
import FodinhaPlayerCard from "@/modules/fodinha/components/FodinhaPlayerCard.vue";
import FodinhaWinnerDialog from "@/modules/fodinha/components/FodinhaWinnerDialog.vue";
import { useFodinhaGame } from "@/modules/fodinha/composables/useFodinhaGame";
import { useRoomSocket } from "@/modules/rooms/composables/useRoomSocket";
import { useWakeLock } from "@/shared/composables/useWakeLock";
import { useConfetti } from "@/shared/composables/useConfetti";
import RoomStatusBar from "@/shared/components/RoomStatusBar.vue";
import temaDaVitoriaAudio from "@/assets/audios/vitoria/tema-da-vitoria.mp3";

const { fireConfetti, stopConfetti } = useConfetti();
const { request } = useWakeLock();
const { fodinhaStore, confirmExit, showWinner, topThree, isFinishing, isStartingRematch, finishError, openExitConfirmation, closeExitConfirmation, exitGame, newGameSamePlayers, reconfigure, goHome } = useFodinhaGame();
const roomSocket = useRoomSocket();
const victoryAudio = new Audio(temaDaVitoriaAudio);
victoryAudio.volume = 1;
const isHost = computed(() => Boolean(fodinhaStore.hostToken));
const canControlRoom = computed(() => isHost.value && roomSocket.status.value === "connected");

const stopVictoryEffects = () => {
  stopConfetti();
  victoryAudio.pause();
  victoryAudio.currentTime = 0;
};

watch(showWinner, (visible) => {
  if (!visible) stopVictoryEffects();
}, { flush: "sync" });

onBeforeUnmount(stopVictoryEffects);

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

</style>
