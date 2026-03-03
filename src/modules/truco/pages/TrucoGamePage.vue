<template>
  <div class="game-page d-flex flex-column">
    <SetupHeader title="Truco" title-icon="mdi-cards" @back="confirmExit = true" />

    <v-container class="flex-grow-1 py-4">
      <div class="game-wrapper mx-auto">
        <!-- Cards das equipes -->
        <div class="d-flex flex-column ga-4 mb-6">
          <TrucoTeamCard v-for="(team, index) in trucoStore.teams" :key="team.id" :team="team" :team-number="index + 1" :max-score="trucoStore.maxScore" :color="index === 0 ? 'primary' : 'error'" @add-point="trucoStore.addPoint(team.id)" @remove-point="trucoStore.removePoint(team.id)"/>
        </div>
      </div>
    </v-container>

    <!-- Dialog: Confirmar saída -->
    <v-dialog v-model="confirmExit" max-width="320">
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-5">Sair da partida?</v-card-title>
        <v-card-text class="px-5">O progresso será perdido.</v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn variant="tonal" rounded="lg" @click="confirmExit = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" rounded="lg" @click="exitGame">Sair</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Vencedor -->
    <v-dialog v-model="showWinner" persistent max-width="360">
      <v-card rounded="lg" class="text-center">
        <v-card-text class="pa-6">
          <p class="text-h2 mb-2">🏆</p>
          <p class="text-h5 font-weight-bold mb-1">{{ trucoStore.winner ? trucoStore.teamName(trucoStore.winner) : "" }}</p>
          <p class="text-medium-emphasis mb-6">venceu a partida!</p>

          <!-- Placar final -->
          <v-card variant="tonal" rounded="lg" class="mb-6">
            <v-card-text class="pa-4">
              <div v-for="(team, index) in trucoStore.teams" :key="team.id">
                <div class="d-flex align-center justify-space-between py-2">
                  <div>
                    <p class="text-caption text-medium-emphasis">Equipe {{ index + 1 }}</p>
                    <p class="text-body-1 font-weight-bold">{{ trucoStore.teamName(team) }}</p>
                  </div>
                  <p class="text-h4 font-weight-black" :class="trucoStore.winner?.id === team.id ? 'text-primary' : ''">
                    {{ team.score }}
                  </p>
                </div>
                <v-divider v-if="index < trucoStore.teams.length - 1" />
              </div>
            </v-card-text>
          </v-card>

          <div class="d-flex flex-column ga-3">
            <v-btn color="primary" variant="flat" rounded="lg" size="large" @click="newGameSameTeams"> 
              <v-icon start icon="mdi-refresh" /> 
              <span>Novo jogo</span> 
            </v-btn>
            <v-btn variant="tonal" rounded="lg" size="large" @click="reconfigure"> 
              <v-icon start icon="mdi-cog" /> 
              <span>Reconfigurar</span>
            </v-btn>
            <v-btn variant="text" rounded="lg" @click="goHome"> 
              <v-icon start icon="mdi-home" /> 
              <span>Início</span>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import SetupHeader from "@/shared/components/SetupHeader.vue";
import TrucoTeamCard from "@/modules/truco/components/TrucoTeamCard.vue";
import { useTrucoStore } from "@/modules/truco/store/useTrucoStore";

const router = useRouter();
const trucoStore = useTrucoStore();

// --- Saída ---
const confirmExit = ref(false);
const exitGame = () => {
  confirmExit.value = false;
  trucoStore.clear();
  router.push({ name: "home" });
};

// --- Vencedor ---
const showWinner = ref(Boolean(trucoStore.winner));
watch(
  () => trucoStore.winner,
  (winner) => {
    if (winner) showWinner.value = true;
  }
);

// --- Ações pós-jogo ---
const newGameSameTeams = () => {
  trucoStore.reset();
  showWinner.value = false;
};

const reconfigure = () => {
  showWinner.value = false;
  trucoStore.clear();
  router.push({ name: "truco-setup" });
};

const goHome = () => {
  showWinner.value = false;
  trucoStore.clear();
  router.push({ name: "home" });
};
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
