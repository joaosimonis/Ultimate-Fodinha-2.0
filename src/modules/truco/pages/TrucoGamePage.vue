<template>
  <div class="game-page d-flex flex-column">
    <SetupHeader title="Truco" title-icon="mdi-cards" @back="confirmExit = true" />

    <v-container class="flex-grow-1 py-4">
      <div class="game-wrapper mx-auto">
        <div v-if="trucoStore.roomCode" class="room-status mb-4">
          <div class="room-status__main">
            <span class="room-status__code">#{{ trucoStore.roomCode }}</span>
            <span class="room-status__role">
              <v-icon :icon="isHost ? 'mdi-crown' : 'mdi-eye'" size="16" />
              {{ isHost ? "Host" : "Assistindo" }}
            </span>
          </div>

          <div class="room-status__online" :class="{ 'room-status__online--connected': roomSocket.status.value === 'connected' }">
            <v-icon icon="mdi-broadcast" size="16" />
            <span>{{ roomConnectionLabel }}</span>
          </div>
        </div>

        <div class="d-flex flex-column ga-4 mb-6">
          <TrucoTeamCard
            v-for="(team, index) in trucoStore.teams"
            :key="team.id"
            :team="team"
            :team-number="index + 1"
            :max-score="trucoStore.maxScore"
            :color="index === 0 ? 'primary' : 'error'"
            :readonly="!canControlRoom"
            @add-point="addPoint(team.id)"
            @remove-point="removePoint(team.id)"
          />
        </div>
      </div>
    </v-container>

    <!-- Dialog: Confirmar saída -->
    <v-dialog v-model="confirmExit" max-width="320">
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-5">Sair da partida?</v-card-title>
        <v-card-text class="px-5">Você poderá voltar enquanto a partida estiver salva neste dispositivo.</v-card-text>
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
          <WinnerHero class="mb-6" :winner-name="trucoStore.winner ? trucoStore.teamName(trucoStore.winner) : ''" :winners="trucoStore.winner ? trucoStore.winner.players.map((p) => p.name) : []" />

          <!-- Scoreboard -->
          <div class="scoreboard mb-6">
            <div class="scoreboard__team">
              <p class="scoreboard__score" :class="['scoreboard__score--team1', trucoStore.winner?.id === teamOne?.id ? 'scoreboard__score--winner' : 'scoreboard__score--loser']">
                {{ teamOne?.score }}
              </p>
              <p class="scoreboard__name">{{ teamOne ? trucoStore.teamName(teamOne) : "" }}</p>
            </div>

            <div class="scoreboard__divider">
              <p class="scoreboard__x">×</p>
            </div>

            <div class="scoreboard__team">
              <p class="scoreboard__score" :class="['scoreboard__score--team2', trucoStore.winner?.id === teamTwo?.id ? 'scoreboard__score--winner' : 'scoreboard__score--loser']">
                {{ teamTwo?.score }}
              </p>
              <p class="scoreboard__name">{{ teamTwo ? trucoStore.teamName(teamTwo) : "" }}</p>
            </div>
          </div>

          <v-alert v-if="finishError" type="error" variant="tonal" density="compact" class="mb-4 text-left">
            {{ finishError }}
          </v-alert>

          <div v-if="isHost" class="d-flex flex-column ga-3">
            <v-btn color="primary" variant="flat" rounded="lg" size="large" :disabled="isFinishing || isStartingRematch" :loading="isStartingRematch" @click="newGameSameTeams">
              <v-icon start icon="mdi-refresh" />
              <span>Revanche</span>
            </v-btn>
            <v-btn color="surface-variant" variant="tonal" rounded="lg" size="large" :disabled="isFinishing || isStartingRematch" @click="reconfigure">
              <v-icon start icon="mdi-cog" />
              <span>Novo jogo</span>
            </v-btn>
            <v-btn class="winner-dialog__home-btn" variant="outlined" color="medium-emphasis" rounded="lg" size="large" :disabled="isFinishing || isStartingRematch" @click="goHome">
              <v-icon start icon="mdi-home" />
              <span>Início</span>
            </v-btn>
          </div>

          <div v-else class="d-flex flex-column ga-3">
            <v-btn class="winner-dialog__home-btn" variant="outlined" color="medium-emphasis" rounded="lg" size="large" @click="goHome">
              <v-icon start icon="mdi-home" />
              <span>Ir para início</span>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getApiErrorMessage } from "@/api/error";
import { matchesApi } from "@/modules/matches/api";
import SetupHeader from "@/shared/components/SetupHeader.vue";
import WinnerHero from "@/shared/components/WinnerHero.vue";
import TrucoTeamCard from "@/modules/truco/components/TrucoTeamCard.vue";
import { useTrucoStore } from "@/modules/truco/store/useTrucoStore";
import { useRoomSocket } from "@/modules/rooms/composables/useRoomSocket";
import { useWakeLock } from "@/shared/composables/useWakeLock";
import { useConfetti } from "@/shared/composables/useConfetti";
import temaDaVitoriaAudio from "@/assets/audios/vitoria/tema-da-vitoria.mp3";

const router = useRouter();
const trucoStore = useTrucoStore();
const roomSocket = useRoomSocket();

const teamOne = computed(() => trucoStore.teams[0] ?? null);
const teamTwo = computed(() => trucoStore.teams[1] ?? null);
const isHost = computed(() => Boolean(trucoStore.hostToken));
const canControlRoom = computed(() => isHost.value && roomSocket.status.value === "connected");
const roomConnectionLabel = computed(() => {
  if (roomSocket.status.value === "connecting") return "Conectando...";
  if (roomSocket.status.value === "reconnecting") return "Reconectando...";
  if (roomSocket.status.value === "error") return "Conexão perdida";

  return `${roomSocket.viewerCount.value} online`;
});

const { fireConfetti } = useConfetti();
const { request } = useWakeLock();
const victoryAudio = new Audio(temaDaVitoriaAudio);
victoryAudio.volume = 1;

const confirmExit = ref(false);
const isFinishing = ref(false);
const isStartingRematch = ref(false);
const finishError = ref("");
const exitGame = () => {
  confirmExit.value = false;
  router.push({ name: "home" });
};

const showWinner = ref(Boolean(trucoStore.winner));

const getScoresByTeamName = () =>
  trucoStore.teams.reduce<Record<string, number>>((scoresByTeamName, team) => {
    scoresByTeamName[trucoStore.teamName(team)] = team.score;
    return scoresByTeamName;
  }, {});

const publishScores = () => {
  if (!trucoStore.hostToken) return;

  roomSocket.sendRoomState(
    {
      mode: "truco",
      scores: getScoresByTeamName(),
    },
    trucoStore.hostToken
  );
};

const addPoint = (teamId: string) => {
  trucoStore.addPoint(teamId);
  publishScores();
};

const removePoint = (teamId: string) => {
  trucoStore.removePoint(teamId);
  publishScores();
};

const finishMatch = async () => {
  if (!trucoStore.matchId || !trucoStore.hostToken || isFinishing.value || trucoStore.teams.length !== 2) return;

  isFinishing.value = true;
  finishError.value = "";

  try {
    await matchesApi.finish(trucoStore.matchId, {
      teams: trucoStore.teams.map((team) => ({
        team_name: trucoStore.teamName(team),
        final_score: team.score,
      })),
    });
  } catch (error) {
    finishError.value = getApiErrorMessage(error);
  } finally {
    isFinishing.value = false;
  }
};

const newGameSameTeams = async () => {
  if (isFinishing.value || isStartingRematch.value || trucoStore.teams.length !== 2) return;

  const rematchTeams = trucoStore.teams.map((team) => ({
    name: trucoStore.teamName(team),
    players: team.players,
  }));

  isStartingRematch.value = true;
  finishError.value = "";

  try {
    const match = await matchesApi.create({
      mode: "truco",
      max_score: trucoStore.maxScore,
    });

    await matchesApi.addPlayers(match.id, {
      players: rematchTeams.flatMap((team) =>
        team.players.map((player) => ({
          player_id: player.id,
          team_name: team.name,
        }))
      ),
    });

    trucoStore.setup({
      teams: rematchTeams,
      maxScore: trucoStore.maxScore,
      mode: trucoStore.mode,
      matchId: match.id,
      roomCode: match.room_code,
      hostToken: match.host_token ?? "",
    });

    showWinner.value = false;
  } catch (error) {
    finishError.value = getApiErrorMessage(error);
  } finally {
    isStartingRematch.value = false;
  }
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

watch(
  () => roomSocket.liveState.value?.scores,
  (scores) => {
    if (scores) {
      trucoStore.syncScores(scores);
    }
  }
);

watch(
  () => trucoStore.winner,
  (winner) => {
    if (winner) {
      showWinner.value = true;
      void finishMatch();
      fireConfetti();
      void victoryAudio.play().catch(() => {
        // Ignore playback errors and keep winner flow responsive.
      });
    }
  }
);

onMounted(() => {
  void request();

  if (trucoStore.roomCode) {
    roomSocket.connect(trucoStore.roomCode);
  }
});
</script>

<style scoped>
.game-page {
  height: 100%;
}

.game-wrapper {
  max-width: 480px;
  width: 100%;
}

.room-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 28px;
  padding: 0 2px;
}

.room-status__main,
.room-status__role,
.room-status__online {
  display: flex;
  align-items: center;
}

.room-status__main {
  min-width: 0;
  gap: 8px;
}

.room-status__code {
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
  white-space: nowrap;
}

.room-status__role {
  color: rgba(var(--v-theme-on-surface), 0.7);
  gap: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
}

.room-status__online {
  color: rgba(var(--v-theme-on-surface), 0.55);
  gap: 4px;
  flex-shrink: 0;
  font-size: 0.8rem;
  white-space: nowrap;
}

.room-status__online--connected {
  color: rgb(var(--v-theme-success));
}

.winner-dialog__home-btn {
  background: rgba(var(--v-theme-on-surface), 0.03);
  border-color: rgba(var(--v-theme-on-surface), 0.08);
}

.scoreboard {
  background: transparent;
  border: 2px solid rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px;
}

.scoreboard__team {
  text-align: center;
  width: 40%;
}

.scoreboard__score {
  font-size: 2.8rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 4px; 
}

.scoreboard__score--team1 {
  color: rgb(var(--v-theme-primary));
}

.scoreboard__score--team2 {
  color: rgb(var(--v-theme-error));
}

.scoreboard__score--winner {
  text-shadow: 0 0 24px currentColor;
}

.scoreboard__score--loser {
  opacity: 0.35;
}

.scoreboard__name {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.5);
  word-break: break-word;
  line-height: 1.3;
}

.scoreboard__divider {
  display: flex;
  align-items: center;
}

.scoreboard__x {
  font-size: 1.2rem;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), 0.2);
}
</style>
