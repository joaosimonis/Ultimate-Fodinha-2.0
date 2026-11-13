<template>
  <div class="rooms-page d-flex flex-column">
    <SetupHeader title="Salas" title-icon="mdi-lan-connect" />

    <v-tabs v-model="selectedMode" grow color="primary" height="48" class="rooms-tabs mb-2">
      <v-tab v-for="filter in roomFilters" :key="filter.value" :value="filter.value">
        <v-icon :icon="filter.icon" start />
        <span>{{ filter.label }}</span>
      </v-tab>
    </v-tabs>

    <v-container class="flex-grow-1 py-6">
      <div class="rooms-wrapper mx-auto">
        <AppLoading v-if="isLoading" message="Carregando salas..." />

        <AppErrorState v-else-if="loadError" :message="loadError" action-label="Tentar novamente" @action="loadRooms" />

        <AppEmptyState v-else-if="filteredRooms.length === 0" message="Nenhuma sala em andamento." />

        <div v-else class="d-flex flex-column ga-3">
          <v-card v-for="room in filteredRooms" :key="room.id" rounded="lg" variant="outlined">
            <v-card-text class="pa-4">
              <div class="d-flex align-start justify-space-between ga-3 mb-3">
                <div>
                  <div class="d-flex align-center ga-2 mb-1">
                    <v-icon :icon="getRoomIcon(room.mode)" size="22" />
                    <span class="text-subtitle-1 font-weight-bold">{{ getRoomModeLabel(room.mode) }}</span>
                  </div>
                  <p class="text-caption text-medium-emphasis mb-0">Sala {{ room.room_code }}</p>
                </div>

                <v-chip color="success" variant="tonal" size="small">Ao vivo</v-chip>
              </div>

              <div class="d-flex align-center justify-space-between ga-3">
                <div class="text-body-2 text-medium-emphasis">
                  <span v-if="room.mode === 'fodinha'">Vidas: {{ room.lives ?? "-" }}</span>
                  <span v-else>Pontuação máxima: {{ room.max_score ?? "-" }}</span>
                </div>

                <v-btn color="primary" variant="flat" rounded="lg" :loading="joiningRoomCode === room.room_code" :disabled="Boolean(joiningRoomCode)" @click="enterRoom(room.room_code)">
                  <v-icon start icon="mdi-login" />
                  <span>Entrar</span>
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <p v-if="joinError" class="text-caption text-error text-center mt-4">
          {{ joinError }}
        </p>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { getApiErrorMessage } from "@/api/error";
import { matchesApi } from "@/modules/matches/api";
import type { MatchMode, MatchResponse } from "@/modules/matches/types/matches.types";
import { useJoinRoom } from "@/modules/rooms/composables/useJoinRoom";
import AppEmptyState from "@/shared/components/AppEmptyState.vue";
import AppErrorState from "@/shared/components/AppErrorState.vue";
import AppLoading from "@/shared/components/AppLoading.vue";
import SetupHeader from "@/shared/components/SetupHeader.vue";

type RoomModeFilter = MatchMode | "all";

const selectedMode = ref<RoomModeFilter>("all");
const rooms = ref<MatchResponse[]>([]);
const isLoading = ref(true);
const loadError = ref("");
const joinError = ref("");
const joiningRoomCode = ref<string | null>(null);
const { joinRoom } = useJoinRoom();
const roomFilters: Array<{ value: RoomModeFilter; label: string; icon: string }> = [
  { value: "all", label: "Todas", icon: "mdi-card-multiple-outline" },
  { value: "fodinha", label: "Fodinha", icon: "mdi-cards-spade" },
  { value: "truco", label: "Truco", icon: "mdi-cards" },
];

const filteredRooms = computed(() => {
  if (selectedMode.value === "all") {
    return rooms.value;
  }

  return rooms.value.filter((room) => room.mode === selectedMode.value);
});

const getRoomModeLabel = (mode: MatchMode) => (mode === "fodinha" ? "Fodinha" : "Truco");

const getRoomIcon = (mode: MatchMode) => (mode === "fodinha" ? "mdi-cards-spade" : "mdi-cards");

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return getApiErrorMessage(error);
  }

  return error instanceof Error ? error.message : "Erro inesperado.";
};

const loadRooms = async () => {
  isLoading.value = true;
  loadError.value = "";
  joinError.value = "";

  try {
    rooms.value = await matchesApi.list({ status: "live" });
  } catch (error) {
    loadError.value = getErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
};

const enterRoom = async (roomCode: string) => {
  joiningRoomCode.value = roomCode;
  joinError.value = "";

  try {
    await joinRoom(roomCode);
  } catch (error) {
    joinError.value = getErrorMessage(error);
  } finally {
    joiningRoomCode.value = null;
  }
};

onMounted(() => {
  void loadRooms();
});
</script>

<style scoped>
.rooms-page {
  height: 100%;
}

.rooms-wrapper {
  max-width: 520px;
  width: 100%;
}

.rooms-tabs {
  flex: 0 0 auto;
}

.rooms-tabs :deep(.v-slide-group__container),
.rooms-tabs :deep(.v-slide-group__content),
.rooms-tabs :deep(.v-tab) {
  height: 48px;
  max-height: 48px;
}

.rooms-tabs :deep(.v-tab) {
  min-width: 0;
  letter-spacing: 0;
  text-transform: none;
}

</style>
