<template>
  <div class="d-flex flex-column h-100">
    <SetupHeader title="Contador tradicional" title-icon="mdi-counter" />
    <v-container class="flex-grow-1 py-4">
      <div class="counter-wrapper mx-auto">
        <p class="text-caption text-medium-emphasis text-center mb-4">Somente neste dispositivo · Sem histórico ou ranking</p>
        <div class="d-flex flex-column ga-4 mb-6">
          <v-card v-for="(team, index) in counter.teams" :key="index" :elevation="2" rounded="lg">
            <v-card-text class="pa-4">
              <div class="d-flex align-center justify-space-between ga-3 mb-4">
                <div class="team-heading">
                  <p class="text-caption text-medium-emphasis">Equipe {{ index === 0 ? 'A' : 'B' }}</p>
                  <p class="text-subtitle-1 font-weight-bold team-name">{{ team.name }}</p>
                  <p v-if="counter.winner === team" class="text-success font-weight-bold">Vencedora!</p>
                </div>
                <p class="score font-weight-black flex-shrink-0" :class="index === 0 ? 'text-primary' : 'text-error'">
                  {{ team.score }}<span class="text-caption text-medium-emphasis"> /{{ counter.maxScore }}</span>
                </p>
              </div>
              <div class="d-flex ga-3 justify-end">
                <v-btn :aria-label="`Remover ponto de ${team.name}`" color="grey" :disabled="team.score === 0" icon size="x-large" variant="tonal" @click="counter.removePoint(index)">
                  <v-icon icon="mdi-minus" size="28" />
                </v-btn>
                <v-btn :aria-label="`Adicionar ponto para ${team.name}`" :color="index === 0 ? 'primary' : 'error'" :disabled="!!counter.winner" icon size="x-large" @click="counter.addPoint(index)">
                  <v-icon icon="mdi-plus" size="28" />
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>
        <v-btn block rounded="lg" size="large" variant="outlined" @click="newCounter">Novo contador</v-btn>
      </div>
    </v-container>

    <v-dialog v-model="showWinner" max-width="360" scrollable>
      <v-card class="text-center" rounded="lg">
        <v-card-text class="pa-6">
          <WinnerHero v-if="counter.winner" class="mb-6" :winner-name="counter.winner.name" :winners="[]" />
          <div class="d-flex align-center justify-space-around ga-3 mb-6">
            <template v-for="(team, index) in counter.teams" :key="index">
              <span v-if="index === 1" class="text-h5 text-medium-emphasis">×</span>
              <div class="final-team">
                <p class="text-h3 font-weight-black" :class="index === 0 ? 'text-primary' : 'text-error'">{{ team.score }}</p>
                <p class="text-body-2 team-name">{{ team.name }}</p>
              </div>
            </template>
          </div>
          <div class="d-flex flex-column ga-3">
            <v-btn color="primary" rounded="lg" size="large" variant="flat" @click="rematch">Revanche</v-btn>
            <v-btn rounded="lg" size="large" variant="tonal" @click="newCounter">Novo contador</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import SetupHeader from "@/shared/components/SetupHeader.vue";
import WinnerHero from "@/shared/components/WinnerHero.vue";
import { useWakeLock } from "@/shared/composables/useWakeLock";
import { useCounterStore } from "../store/useCounterStore";

const router = useRouter();
const counter = useCounterStore();
const showWinner = ref(Boolean(counter.winner));
const { request } = useWakeLock();

watch(() => counter.winner, (winner) => { showWinner.value = Boolean(winner); });
onMounted(() => { void request(); });

function rematch () {
  counter.rematch();
  showWinner.value = false;
}

function newCounter () {
  showWinner.value = false;
  void router.push({ name: "counter-setup", query: { new: "1" } });
}
</script>

<style scoped>
.counter-wrapper { max-width: 480px; width: 100%; }
.team-heading { min-width: 0; }
.team-name { overflow-wrap: anywhere; }
.score { font-size: 2.5rem; line-height: 1; }
.final-team { width: 40%; min-width: 0; }
</style>
