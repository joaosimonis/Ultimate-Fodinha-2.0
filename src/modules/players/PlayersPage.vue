<template>
  <div class="players-page d-flex flex-column">
    <v-app-bar flat density="comfortable" class="px-2">
      <v-container class="d-flex align-center py-0">
        <v-btn icon variant="text" size="large" @click="goBack">
          <v-icon icon="mdi-arrow-left" size="28" />
        </v-btn>
        <h3 class="font-weight-bold text-center flex-grow-1">👥 Jogadores</h3>
        <v-btn icon variant="text" size="large" @click="openAddDialog">
          <v-icon icon="mdi-plus" size="28" />
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-container class="flex-grow-1 py-6">
      <div class="players-wrapper mx-auto">
        <!-- Estado vazio -->
        <div v-if="playersStore.players.length === 0" class="text-center py-12">
          <v-icon icon="mdi-account-group-outline" size="64" class="text-medium-emphasis mb-4" />
          <p class="text-subtitle-1 font-weight-bold mb-1">Nenhum jogador cadastrado</p>
          <p class="text-caption text-medium-emphasis mb-6">Adicione jogadores para usar no Fodinha</p>
          <v-btn color="secondary" rounded="lg" @click="openAddDialog"> <v-icon start icon="mdi-plus" /> Adicionar jogador </v-btn>
        </div>

        <!-- Grid de jogadores -->
        <div v-else class="players-grid">
          <v-slide-y-transition group>
            <div v-for="player in playersStore.players" :key="player.id" class="player-card-wrapper">
              <v-card rounded="lg" elevation="2" class="player-card text-center pa-3">
                <v-avatar size="72" class="mb-2">
                  <v-img :src="getAvatarUrl(player.name)" :alt="player.name" />
                </v-avatar>
                <p class="text-body-2 font-weight-bold text-truncate">{{ player.name }}</p>
                <v-btn icon variant="text" color="error" size="x-small" class="delete-btn" @click="confirmDelete(player)">
                  <v-icon icon="mdi-close" size="16" />
                </v-btn>
              </v-card>
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
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.player-card {
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
}
</style>
