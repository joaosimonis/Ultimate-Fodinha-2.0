<template>
  <div class="d-flex flex-column h-100">
    <SetupHeader title="Contador tradicional" title-icon="mdi-counter" />
    <v-container class="flex-grow-1 py-6">
      <div class="counter-wrapper mx-auto">
        <v-alert class="mb-6" type="info" variant="tonal">
          As partidas neste modo não contam para o ranking e não são salvas no histórico.
        </v-alert>

        <div v-if="counter.hasGame && !showSetup" class="d-flex flex-column ga-4">
          <v-card rounded="lg" variant="tonal">
            <v-card-text class="text-center">
              <p class="text-subtitle-1 font-weight-bold mb-2">Contador salvo neste dispositivo</p>
              <p class="saved-score">{{ counter.teams[0]?.name }} {{ counter.teams[0]?.score }} × {{ counter.teams[1]?.score }} {{ counter.teams[1]?.name }}</p>
              <p class="text-caption mt-2">Até {{ counter.maxScore }} pontos</p>
            </v-card-text>
          </v-card>
          <v-btn color="primary" rounded="lg" size="x-large" @click="router.push({ name: 'counter-game' })">Continuar contador</v-btn>
          <v-btn rounded="lg" size="large" variant="outlined" @click="showSetup = true">Novo contador</v-btn>
        </div>

        <v-form v-else @submit.prevent="requestStart">
          <v-text-field v-model="teamAName" class="mb-3" label="Nome da Equipe A (opcional)" placeholder="Equipe A" variant="outlined" />
          <v-text-field v-model="teamBName" class="mb-3" label="Nome da Equipe B (opcional)" placeholder="Equipe B" variant="outlined" />

          <p class="text-subtitle-1 font-weight-bold mb-3">Pontuação máxima</p>
          <div aria-label="Pontuação máxima" class="d-flex ga-3 mb-8" role="group">
            <v-btn v-for="option in TRUCO_MAX_SCORE_OPTIONS" :key="option" :aria-pressed="maxScore === option" class="flex-grow-1" :color="maxScore === option ? 'primary' : undefined" rounded="lg" size="large" :variant="maxScore === option ? 'flat' : 'outlined'" @click="maxScore = option">{{ option }}</v-btn>
          </div>
          <v-btn block color="primary" rounded="lg" size="x-large" type="submit">
            <v-icon icon="mdi-play" start />
            Iniciar contador
          </v-btn>
          <v-btn v-if="counter.hasGame" block class="mt-3" variant="text" @click="router.push({ name: 'counter-game' })">Continuar contador salvo</v-btn>
        </v-form>
      </div>
    </v-container>

    <v-dialog v-model="confirmReplace" max-width="360">
      <v-card rounded="lg" title="Substituir contador salvo?">
        <v-card-text>O placar salvo neste dispositivo será apagado para iniciar o novo contador.</v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-btn variant="tonal" @click="confirmReplace = false">Cancelar</v-btn>
          <v-btn color="primary" variant="flat" @click="startCounter">Substituir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TRUCO_MAX_SCORE_DEFAULT, TRUCO_MAX_SCORE_OPTIONS } from "@/modules/truco/constants/truco.constants";
import SetupHeader from "@/shared/components/SetupHeader.vue";
import { type CounterMaxScore, useCounterStore } from "../store/useCounterStore";

const router = useRouter();
const route = useRoute();
const counter = useCounterStore();
const showSetup = ref(route.query.new === "1");
const teamAName = ref("");
const teamBName = ref("");
const maxScore = ref<CounterMaxScore>(TRUCO_MAX_SCORE_DEFAULT);
const confirmReplace = ref(false);

function startCounter () {
  counter.setup([teamAName.value, teamBName.value], maxScore.value);
  confirmReplace.value = false;
  void router.push({ name: "counter-game" });
}

function requestStart () {
  if (counter.hasGame) confirmReplace.value = true;
  else startCounter();
}
</script>

<style scoped>
.counter-wrapper { max-width: 480px; width: 100%; }
.saved-score { overflow-wrap: anywhere; }
</style>
