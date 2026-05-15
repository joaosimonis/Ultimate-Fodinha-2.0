<template>
  <div class="setup-page d-flex flex-column">
    <SetupPageHeader title="Ranking" title-icon="mdi-trophy" />

    <v-tabs v-model="activeTab" grow color="primary" height="48" class="ranking-tabs mb-2">
      <v-tab value="fodinha">
        <v-icon icon="mdi-cards-spade" start />
        <span>Fodinha</span>
      </v-tab>
      <v-tab value="truco-duo">
        <v-icon icon="mdi-account-multiple" start />
        <span>Dupla</span>
      </v-tab>
      <v-tab value="truco-trio">
        <v-icon icon="mdi-account-group" start />
        <span>Trio</span>
      </v-tab>
    </v-tabs>

    <v-container class="flex-grow-1 py-4 px-4">
      <div class="ranking-wrapper mx-auto">
        <AppLoading v-if="isLoading" message="Carregando ranking..." />

        <AppErrorState v-else-if="error" :message="error" action-label="Tentar novamente" @action="loadRankings" />

        <v-tabs-window v-else v-model="activeTab">
          <v-tabs-window-item value="fodinha">
            <div v-if="fodinhaRanking.length === 0" class="empty-state">
              <v-icon icon="mdi-cards-spade" size="48" class="text-medium-emphasis mb-3" />
              <p class="text-body-2 text-medium-emphasis">Nenhuma partida registrada ainda</p>
            </div>
            <div v-else class="d-flex flex-column ga-3">
              <FodinhaRankingCard v-for="player in fodinhaRanking" :key="player.player_id" :stats="player" :position="player.position" />
            </div>
          </v-tabs-window-item>

          <v-tabs-window-item value="truco-duo">
            <div v-if="trucoDuoRanking.length === 0" class="empty-state">
              <v-icon icon="mdi-account-multiple" size="48" class="text-medium-emphasis mb-3" />
              <p class="text-body-2 text-medium-emphasis">Nenhuma partida registrada ainda</p>
            </div>
            <div v-else class="d-flex flex-column ga-3">
              <TrucoRankingCard v-for="team in trucoDuoRanking" :key="team.team_key" :stats="team" :position="team.position" />
            </div>
          </v-tabs-window-item>

          <v-tabs-window-item value="truco-trio">
            <div v-if="trucoTrioRanking.length === 0" class="empty-state">
              <v-icon icon="mdi-account-group" size="48" class="text-medium-emphasis mb-3" />
              <p class="text-body-2 text-medium-emphasis">Nenhuma partida registrada ainda</p>
            </div>
            <div v-else class="d-flex flex-column ga-3">
              <TrucoRankingCard v-for="team in trucoTrioRanking" :key="team.team_key" :stats="team" :position="team.position" />
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getApiErrorMessage } from "@/api/error";
import { rankingApi } from "@/modules/ranking/api";
import FodinhaRankingCard from "@/modules/ranking/components/FodinhaRankingCard.vue";
import TrucoRankingCard from "@/modules/ranking/components/TrucoRankingCard.vue";
import type { FodinhaRankingResponse, TrucoTeamRankingResponse } from "@/modules/ranking/types/ranking.types";
import AppErrorState from "@/shared/components/AppErrorState.vue";
import AppLoading from "@/shared/components/AppLoading.vue";
import SetupPageHeader from "@/shared/components/SetupHeader.vue";

const activeTab = ref("fodinha");
const fodinhaRanking = ref<FodinhaRankingResponse[]>([]);
const trucoDuoRanking = ref<TrucoTeamRankingResponse[]>([]);
const trucoTrioRanking = ref<TrucoTeamRankingResponse[]>([]);
const isLoading = ref(false);
const error = ref("");

const loadRankings = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    const [fodinha, trucoDuo, trucoTrio] = await Promise.all([
      rankingApi.getFodinhaRanking(),
      rankingApi.getTrucoTeamRanking(2),
      rankingApi.getTrucoTeamRanking(3),
    ]);

    fodinhaRanking.value = fodinha;
    trucoDuoRanking.value = trucoDuo;
    trucoTrioRanking.value = trucoTrio;
  } catch (err) {
    error.value = getApiErrorMessage(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  void loadRankings();
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

.ranking-tabs {
  flex: 0 0 auto;
}

.ranking-tabs :deep(.v-slide-group__container),
.ranking-tabs :deep(.v-slide-group__content),
.ranking-tabs :deep(.v-tab) {
  height: 48px;
  max-height: 48px;
}

.ranking-tabs :deep(.v-tab) {
  min-width: 0;
  letter-spacing: 0;
  text-transform: none;
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
