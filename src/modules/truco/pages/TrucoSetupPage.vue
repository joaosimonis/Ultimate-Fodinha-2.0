<template>
  <div class="setup-page d-flex flex-column">
    <SetupHeader title="Truco" title-icon="mdi-cards" @back="goBack" />

    <v-container class="flex-grow-1 py-6">
      <div class="setup-wrapper mx-auto">
        <!-- Modo de jogo -->
        <div class="mb-6">
          <p class="text-subtitle-1 font-weight-bold mb-3">Modo de jogo</p>
          <div class="d-flex ga-3">
            <v-btn v-for="m in TRUCO_MODES" :key="m" :color="selectedMode === m ? 'primary' : undefined" :variant="selectedMode === m ? 'flat' : 'outlined'" class="flex-grow-1" size="large" rounded="lg" @click="onModeChange(m)">
              <v-icon start :icon="m === 'dupla' ? 'mdi-account-multiple' : 'mdi-account-group'" />
              {{ m === "dupla" ? "Dupla" : "Trio" }}
            </v-btn>
          </div>
        </div>

        <v-divider class="mb-6" />

        <!-- Equipe 1 -->
        <div class="mb-6">
          <p class="text-subtitle-1 font-weight-bold mb-3">
            <v-icon icon="mdi-shield" color="primary" size="20" class="mr-1" />
            Equipe 1
          </p>
          <v-text-field v-model="team1Name" label="Nome da equipe (opcional)" variant="outlined" density="comfortable" class="mb-3" hide-details />
          <ChampionSelect v-model="team1Players" :max="playersPerTeam" :exclude="team2Players" />
        </div>
        <v-divider class="mb-6" />

        <!-- Equipe 2 -->
        <div class="mb-6">
          <p class="text-subtitle-1 font-weight-bold mb-3">
            <v-icon icon="mdi-shield" color="error" size="20" class="mr-1" />
            Equipe 2
          </p>
          <v-text-field v-model="team2Name" label="Nome da equipe (opcional)" variant="outlined" density="comfortable" class="mb-3" hide-details />
          <ChampionSelect v-model="team2Players" :max="playersPerTeam" :exclude="team1Players" />
        </div>

        <v-divider class="mb-6" />

        <!-- Pontuação máxima -->
        <div class="mb-8">
          <p class="text-subtitle-1 font-weight-bold mb-3">Pontuação máxima</p>
          <div class="d-flex ga-3">
            <v-btn v-for="option in TRUCO_MAX_SCORE_OPTIONS" :key="option" :color="selectedMaxScore === option ? 'primary' : undefined" :variant="selectedMaxScore === option ? 'flat' : 'outlined'" class="flex-grow-1" size="large" rounded="lg" @click="selectedMaxScore = option">
              {{ option }}
            </v-btn>
          </div>
        </div>

        <!-- Botão iniciar -->
        <v-btn block color="primary" size="x-large" rounded="lg" class="text-white" :disabled="!canStart" :loading="isStarting" @click="startGame">
          <v-icon start icon="mdi-play" />
          Iniciar Jogo
        </v-btn>

        <p v-if="setupError" class="text-caption text-error text-center mt-3">
          {{ setupError }}
        </p>

        <p v-if="!canStart" class="text-caption text-medium-emphasis text-center mt-3">
          {{ startBlockReason }}
        </p>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { getApiErrorMessage } from "@/api/error";
import { matchesApi } from "@/modules/matches/api";
import SetupHeader from "@/shared/components/SetupHeader.vue";
import ChampionSelect from "@/shared/ChampionSelect.vue";
import { useTrucoStore } from "@/modules/truco/store/useTrucoStore";
import { TRUCO_MODES, TRUCO_MAX_SCORE_OPTIONS, TRUCO_MAX_SCORE_DEFAULT, TRUCO_PLAYERS_PER_MODE } from "@/modules/truco/constants/truco.constants";
import type { TrucoMode } from "../types/truco.types";
import type { RegisteredPlayer } from "@/modules/players/types/players.types";

const router = useRouter();
const trucoStore = useTrucoStore();

const team1Name = ref("");
const team2Name = ref("");
const isStarting = ref(false);
const setupError = ref("");

const selectedMode = ref<TrucoMode>("dupla");
const playersPerTeam = computed(() => TRUCO_PLAYERS_PER_MODE[selectedMode.value]);

const buildTeamName = (players: RegisteredPlayer[]): string => players.map((p) => p.name).join(" + ");

const onModeChange = (mode: TrucoMode) => {
  selectedMode.value = mode;
  team1Players.value = [];
  team2Players.value = [];
};

const team1Players = ref<RegisteredPlayer[]>([]);
const team2Players = ref<RegisteredPlayer[]>([]);

const selectedMaxScore = ref(TRUCO_MAX_SCORE_DEFAULT);

const canStart = computed(() => team1Players.value.length === playersPerTeam.value && team2Players.value.length === playersPerTeam.value && !isStarting.value);

const startBlockReason = computed(() => {
  const needed = playersPerTeam.value;
  if (team1Players.value.length < needed && team2Players.value.length < needed) return `Selecione ${needed} jogadores em cada equipe`;
  if (team1Players.value.length < needed) return `Selecione ${needed} jogadores na Equipe 1`;
  if (team2Players.value.length < needed) return `Selecione ${needed} jogadores na Equipe 2`;
  return "";
});

const startGame = async () => {
  if (!canStart.value) return;

  const team1 = { name: team1Name.value || buildTeamName(team1Players.value), players: team1Players.value };
  const team2 = { name: team2Name.value || buildTeamName(team2Players.value), players: team2Players.value };

  isStarting.value = true;
  setupError.value = "";

  try {
    const match = await matchesApi.create({
      mode: "truco",
      max_score: selectedMaxScore.value,
    });

    await matchesApi.addPlayers(match.id, {
      players: [
        ...team1.players.map((player) => ({
          player_id: player.id,
          team_name: team1.name,
        })),
        ...team2.players.map((player) => ({
          player_id: player.id,
          team_name: team2.name,
        })),
      ],
    });

    trucoStore.setup({
      teams: [team1, team2],
      maxScore: selectedMaxScore.value,
      mode: selectedMode.value,
      matchId: match.id,
      roomCode: match.room_code,
      hostToken: match.host_token ?? "",
    });

    router.push({ name: "truco-game" });
  } catch (error) {
    setupError.value = getApiErrorMessage(error);
  } finally {
    isStarting.value = false;
  }
};

const goBack = () => router.push({ name: "home" });
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
