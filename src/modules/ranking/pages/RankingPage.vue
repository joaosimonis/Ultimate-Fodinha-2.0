<template>
  <div class="setup-page d-flex flex-column">
    <SetupPageHeader title="Ranking" title-icon="mdi-trophy" />

    <!-- Abas -->
    <v-tabs v-model="activeTab" grow color="primary" class="mb-2">
      <v-tab value="fodinha">
        <v-icon icon="mdi-cards-spade" start />
        <span>Fodinha</span>
      </v-tab>
      <v-tab value="truco-players">
        <v-icon icon="mdi-cards" start />
        <span>Truco</span>
      </v-tab>
      <v-tab value="truco-teams">
        <v-icon icon="mdi-account-group" start />
        <span>Duplas/Trios</span>
      </v-tab>
    </v-tabs>

    <v-container class="flex-grow-1 py-4 px-4">
      <div class="ranking-wrapper mx-auto">
        <v-tabs-window v-model="activeTab">
          <!-- Aba: Fodinha -->
          <v-tabs-window-item value="fodinha">
            <div v-if="rankingStore.fodinhRanking.length === 0" class="empty-state">
              <v-icon icon="mdi-cards-spade" size="48" class="text-medium-emphasis mb-3" />
              <p class="text-body-2 text-medium-emphasis">Nenhuma partida registrada ainda</p>
            </div>
            <div v-else class="d-flex flex-column ga-3">
              <RankingPlayerCard v-for="(player, index) in rankingStore.fodinhRanking" :key="player.playerId" :stats="player" :position="index + 1" />
            </div>
          </v-tabs-window-item>

          <!-- Aba: Truco Jogadores -->
          <v-tabs-window-item value="truco-players">
            <div v-if="rankingStore.trucoPlayerRanking.length === 0" class="empty-state">
              <v-icon icon="mdi-cards" size="48" class="text-medium-emphasis mb-3" />
              <p class="text-body-2 text-medium-emphasis">Nenhuma partida registrada ainda</p>
            </div>
            <div v-else class="d-flex flex-column ga-3">
              <RankingPlayerCard v-for="(player, index) in rankingStore.trucoPlayerRanking" :key="player.playerId" :stats="player" :position="index + 1" />
            </div>
          </v-tabs-window-item>

          <!-- Aba: Truco Duplas -->
          <v-tabs-window-item value="truco-teams">
            <div v-if="rankingStore.trucoTeamRanking.length === 0" class="empty-state">
              <v-icon icon="mdi-account-group" size="48" class="text-medium-emphasis mb-3" />
              <p class="text-body-2 text-medium-emphasis">Nenhuma partida registrada ainda</p>
            </div>
            <div v-else class="d-flex flex-column ga-3">
              <RankingTeamCard v-for="(team, index) in rankingStore.trucoTeamRanking" :key="team.teamKey" :stats="team" :position="index + 1" />
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-container>

    <!-- Dialog: Confirmar limpeza -->
    <v-dialog v-model="confirmClear" max-width="320">
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-5">Limpar ranking?</v-card-title>
        <v-card-text class="px-5">Todos os dados serão apagados permanentemente.</v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn variant="tonal" rounded="lg" @click="confirmClear = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" rounded="lg" @click="clearRanking">Limpar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import SetupPageHeader from "@/shared/components/SetupHeader.vue";
import audioMuriloPuto from "@/assets/audios/murilo/audio-murilo-puto.ogg";
import { useRouter } from "vue-router";
import { useRankingStore } from "@/modules/ranking/store/useRankingStore";
import RankingPlayerCard from "@/modules/ranking/components/RankingPlayerCard.vue";
import RankingTeamCard from "@/modules/ranking/components/RankingTeamCard.vue";

const router = useRouter();
const rankingStore = useRankingStore();

const activeTab = ref("fodinha");
const confirmClear = ref(false);

const goBack = () => router.push({ name: "home" });

const clearRanking = () => {
  rankingStore.clearAll();
  confirmClear.value = false;
};

onMounted(() => {
  const audio = new Audio(audioMuriloPuto);
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

.ranking-wrapper {
  max-width: 480px;
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  text-align: center;
}

:deep(.v-tabs-window) {
  overflow: visible !important;
}
</style>
