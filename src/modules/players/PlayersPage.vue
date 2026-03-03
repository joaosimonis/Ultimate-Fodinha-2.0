<template>
  <div class="players-page d-flex flex-column">
    <SetupHeader title="Jogadores" title-icon="mdi-account-group" @back="goBack">
      <template #actions>
        <v-btn icon variant="text" size="large" @click="openAddDialog">
          <v-icon icon="mdi-plus" size="28" />
        </v-btn>
      </template>
    </SetupHeader>

    <v-container class="flex-grow-1 py-6">
      <div class="players-wrapper mx-auto">
        <!-- Estado vazio -->
        <div v-if="playersStore.players.length === 0" class="text-center py-12">
          <v-icon icon="mdi-account-group-outline" size="64" class="text-medium-emphasis mb-4" />
          <p class="text-subtitle-1 font-weight-bold mb-1">Nenhum jogador cadastrado</p>
          <p class="text-caption text-medium-emphasis mb-6">Adicione jogadores para usar no Ultimate Fodinha 2.0</p>
          <v-btn color="secondary" rounded="lg" @click="openAddDialog"> <v-icon start icon="mdi-plus" /> Adicionar jogador </v-btn>
        </div>

        <!-- Grid de jogadores -->
        <div v-else class="players-grid">
          <v-slide-y-transition group>
            <div v-for="player in playersStore.players" :key="player.id" class="player-card-wrapper">
              <div class="player-card text-center">
                <div class="avatar-wrapper">
                  <v-avatar size="72">
                    <v-img :src="getAvatarUrl(player.name)" :alt="player.name" />
                  </v-avatar>
                  <v-btn icon variant="flat" color="error" size="x-small" class="delete-btn" @click="confirmDelete(player)">
                    <v-icon icon="mdi-close" size="10" />
                  </v-btn>
                </div>
                <p class="text-caption font-weight-bold mt-1 text-truncate">{{ player.name }}</p>
              </div>
            </div>
          </v-slide-y-transition>
        </div>
      </div>
    </v-container>

    <!-- Dialog: Adicionar jogador -->
    <v-dialog v-model="addDialog" max-width="320">
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-5">Novo jogador</v-card-title>
        <v-card-text class="px-5 pb-2">
          <v-text-field v-model="newPlayerName" label="Nome do jogador" variant="outlined" density="comfortable" autofocus :error-messages="addError" @keyup.enter="addPlayer" />
          <!-- Preview do avatar -->
          <div v-if="newPlayerName.trim()" class="d-flex align-center ga-3 mt-1">
            <v-avatar size="40">
              <v-img :src="getAvatarUrl(newPlayerName)" />
            </v-avatar>
            <span class="text-caption text-medium-emphasis">Preview do avatar</span>
          </div>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn variant="tonal" rounded="lg" @click="closeAddDialog">Cancelar</v-btn>
          <v-btn color="secondary" variant="flat" rounded="lg" :disabled="!newPlayerName.trim()" @click="addPlayer"> Adicionar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Confirmar exclusão -->
    <v-dialog v-model="deleteDialog" max-width="320">
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-5">Remover jogador?</v-card-title>
        <v-card-text class="px-5">
          <span class="font-weight-bold">{{ playerToDelete?.name }}</span> será removido da lista.
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn variant="tonal" rounded="lg" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" rounded="lg" @click="deletePlayer">Remover</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import SetupHeader from "@/shared/components/SetupHeader.vue";
import { usePlayersStore } from "@/shared/store/usePlayersStore";
import { getAvatarUrl } from "@/shared/utils/avatar";
import type { RegisteredPlayer } from "@/shared/types/players.types";

const router = useRouter();
const playersStore = usePlayersStore();

// --- Navegação ---
const goBack = () => router.push({ name: "home" });

// --- Adicionar ---
const addDialog = ref(false);
const newPlayerName = ref("");
const addError = ref("");

const openAddDialog = () => {
  newPlayerName.value = "";
  addError.value = "";
  addDialog.value = true;
};

const closeAddDialog = () => {
  addDialog.value = false;
};

const addPlayer = () => {
  const name = newPlayerName.value.trim();

  if (!name) return;

  if (playersStore.players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
    addError.value = "Já existe um jogador com esse nome.";
    return;
  }

  playersStore.addPlayer(name);
  closeAddDialog();
};

// --- Remover ---
const deleteDialog = ref(false);
const playerToDelete = ref<RegisteredPlayer | null>(null);

const confirmDelete = (player: RegisteredPlayer) => {
  playerToDelete.value = player;
  deleteDialog.value = true;
};

const deletePlayer = () => {
  if (playerToDelete.value) {
    playersStore.removePlayer(playerToDelete.value.id);
  }
  deleteDialog.value = false;
  playerToDelete.value = null;
};
</script>

<style scoped>
.players-page {
  height: 100%;
}

.players-wrapper {
  max-width: 480px;
  width: 100%;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.player-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-wrapper {
  position: relative;
}

.delete-btn {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px !important;
  height: 18px !important;
}

.player-card-wrapper {
  display: flex;
  justify-content: center;
}
</style>
