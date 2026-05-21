<template>
  <div class="admin-players-page d-flex flex-column">
    <SetupHeader title="Admin" title-icon="mdi-shield-key" @back="goHome" />

    <v-container class="flex-grow-1 py-6">
      <div class="admin-wrapper mx-auto">
        <v-alert v-if="pageError" type="error" variant="tonal" density="comfortable" class="mb-4">
          {{ pageError }}
        </v-alert>

        <v-alert v-if="pageSuccess" type="success" variant="tonal" density="comfortable" class="mb-4">
          {{ pageSuccess }}
        </v-alert>

        <v-list class="admin-actions" bg-color="transparent" lines="two">
          <v-list-item rounded="lg" class="admin-action" @click="openAddPlayer">
            <template #prepend>
              <v-avatar color="secondary" variant="tonal" size="44">
                <v-icon icon="mdi-account-plus" />
              </v-avatar>
            </template>
            <v-list-item-title>Adicionar jogador</v-list-item-title>
            <v-list-item-subtitle>Cadastrar um novo jogador para seleção nas partidas.</v-list-item-subtitle>
            <template #append>
              <v-icon icon="mdi-chevron-right" class="text-medium-emphasis" />
            </template>
          </v-list-item>

          <v-list-item rounded="lg" class="admin-action" :disabled="playersStore.isLoading" @click="openDeletePlayer">
            <template #prepend>
              <v-avatar color="error" variant="tonal" size="44">
                <v-icon icon="mdi-account-remove" />
              </v-avatar>
            </template>
            <v-list-item-title>Excluir jogador</v-list-item-title>
            <v-list-item-subtitle>Remover um jogador cadastrado da lista.</v-list-item-subtitle>
            <template #append>
              <v-icon icon="mdi-chevron-right" class="text-medium-emphasis" />
            </template>
          </v-list-item>

          <v-list-item rounded="lg" class="admin-action" @click="openCancelMatch">
            <template #prepend>
              <v-avatar color="warning" variant="tonal" size="44">
                <v-icon icon="mdi-cancel" />
              </v-avatar>
            </template>
            <v-list-item-title>Cancelar partida</v-list-item-title>
            <v-list-item-subtitle>Anular uma sala em andamento ou finalizada pelo código.</v-list-item-subtitle>
            <template #append>
              <v-icon icon="mdi-chevron-right" class="text-medium-emphasis" />
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-container>

    <AdminAddPlayerDialog v-model="addDialog" />

    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-5">Excluir jogador</v-card-title>
        <v-card-text class="px-5">
          <v-alert v-if="playersStore.error" type="error" variant="tonal" density="compact" class="mb-4">
            {{ playersStore.error }}
          </v-alert>

          <v-select
            v-model="selectedPlayerId"
            :items="playersStore.players"
            item-title="name"
            item-value="id"
            label="Jogador"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :disabled="isDeleting || playersStore.isLoading"
            :loading="playersStore.isLoading"
            no-data-text="Nenhum jogador cadastrado"
          />

          <p v-if="selectedPlayer" class="text-caption text-medium-emphasis mt-3">
            {{ selectedPlayer.name }} será removido da lista de jogadores.
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn variant="tonal" rounded="lg" :disabled="isDeleting" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" rounded="lg" :disabled="!selectedPlayerId" :loading="isDeleting" @click="deletePlayer">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="cancelMatchDialog" max-width="380">
      <v-card rounded="lg">
        <v-form @submit.prevent="cancelMatch">
          <v-card-title class="pt-5 px-5">Cancelar partida</v-card-title>
          <v-card-text class="px-5">
            <v-alert v-if="cancelMatchError" type="error" variant="tonal" density="compact" class="mb-4">
              {{ cancelMatchError }}
            </v-alert>

            <v-alert v-if="cancelledMatch" type="success" variant="tonal" density="compact" class="mb-4">
              Sala {{ cancelledMatch.room_code }} cancelada.
            </v-alert>

            <v-text-field
              v-model="cancelRoomCode"
              label="Código da sala"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              autofocus
              :disabled="isCancellingMatch"
              :maxlength="12"
            />

            <p class="text-caption text-medium-emphasis mt-3">
              A partida ficará com status cancelado e não contará no ranking.
            </p>
          </v-card-text>
          <v-card-actions class="px-5 pb-5 ga-2">
            <v-btn variant="tonal" rounded="lg" :disabled="isCancellingMatch" @click="cancelMatchDialog = false">Fechar</v-btn>
            <v-btn color="warning" variant="flat" rounded="lg" type="submit" :disabled="!cancelRoomCode.trim()" :loading="isCancellingMatch">Cancelar partida</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getApiErrorMessage } from "@/api/error";
import AdminAddPlayerDialog from "@/modules/auth/components/AdminAddPlayerDialog.vue";
import { matchesApi } from "@/modules/matches/api";
import type { MatchResponse } from "@/modules/matches/types/matches.types";
import SetupHeader from "@/shared/components/SetupHeader.vue";
import { usePlayersStore } from "@/shared/store/usePlayersStore";

const router = useRouter();
const playersStore = usePlayersStore();

const addDialog = ref(false);
const deleteDialog = ref(false);
const selectedPlayerId = ref<string | null>(null);
const isDeleting = ref(false);
const cancelMatchDialog = ref(false);
const cancelRoomCode = ref("");
const isCancellingMatch = ref(false);
const cancelMatchError = ref("");
const cancelledMatch = ref<MatchResponse | null>(null);
const pageError = ref("");
const pageSuccess = ref("");

const selectedPlayer = computed(() => playersStore.players.find((player) => player.id === selectedPlayerId.value) ?? null);

const clearPageFeedback = () => {
  pageError.value = "";
  pageSuccess.value = "";
};

const loadPlayers = () => {
  void playersStore.loadPlayers().catch(() => {
    pageError.value = playersStore.error ?? "Não foi possível carregar jogadores.";
  });
};

const goHome = () => {
  router.push({ name: "home" });
};

const openAddPlayer = () => {
  clearPageFeedback();
  addDialog.value = true;
};

const openDeletePlayer = () => {
  clearPageFeedback();
  selectedPlayerId.value = null;
  deleteDialog.value = true;

  if (!playersStore.hasLoaded) {
    loadPlayers();
  }
};

const openCancelMatch = () => {
  clearPageFeedback();
  cancelRoomCode.value = "";
  cancelMatchError.value = "";
  cancelledMatch.value = null;
  cancelMatchDialog.value = true;
};

const deletePlayer = async () => {
  const player = selectedPlayer.value;
  if (!player || isDeleting.value) return;

  isDeleting.value = true;
  clearPageFeedback();

  try {
    await playersStore.removePlayer(player.id);
    pageSuccess.value = `${player.name} foi excluído.`;
    deleteDialog.value = false;
    selectedPlayerId.value = null;
  } catch {
    pageError.value = playersStore.error ?? "Não foi possível excluir o jogador.";
  } finally {
    isDeleting.value = false;
  }
};

const cancelMatch = async () => {
  const roomCode = cancelRoomCode.value.trim().toUpperCase();
  if (!roomCode || isCancellingMatch.value) return;

  isCancellingMatch.value = true;
  cancelMatchError.value = "";
  cancelledMatch.value = null;
  clearPageFeedback();

  try {
    const match = await matchesApi.cancelByRoomCode(roomCode);
    cancelledMatch.value = match;
    pageSuccess.value = `Sala ${match.room_code} cancelada.`;
    cancelRoomCode.value = match.room_code;
  } catch (error) {
    cancelMatchError.value = getApiErrorMessage(error);
  } finally {
    isCancellingMatch.value = false;
  }
};

onMounted(loadPlayers);
</script>

<style scoped>
.admin-players-page {
  height: 100%;
}

.admin-wrapper {
  max-width: 480px;
  width: 100%;
}

.admin-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-action {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
