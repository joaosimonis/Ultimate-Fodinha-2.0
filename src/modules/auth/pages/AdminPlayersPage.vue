<template>
  <div class="admin-players-page d-flex flex-column">
    <SetupHeader title="Admin" title-icon="mdi-shield-key" @back="goHome">
      <template #actions>
        <v-btn icon variant="text" size="large" aria-label="Adicionar jogador" @click="addDialog = true">
          <v-icon icon="mdi-plus" size="28" />
        </v-btn>
      </template>
    </SetupHeader>

    <v-container class="flex-grow-1 py-6">
      <div class="players-wrapper mx-auto">
        <div v-if="playersStore.error" class="text-center py-12">
          <v-icon icon="mdi-alert-circle-outline" size="64" class="text-error mb-4" />
          <p class="text-subtitle-1 font-weight-bold mb-1">Não foi possível carregar jogadores</p>
          <p class="text-caption text-medium-emphasis mb-6">{{ playersStore.error }}</p>
          <v-btn color="secondary" rounded="lg" @click="loadPlayers">
            <v-icon start icon="mdi-refresh" />
            Tentar novamente
          </v-btn>
        </div>

        <div v-else-if="playersStore.players.length === 0" class="text-center py-12">
          <v-icon icon="mdi-account-group-outline" size="64" class="text-medium-emphasis mb-4" />
          <p class="text-subtitle-1 font-weight-bold mb-1">Nenhum jogador cadastrado</p>
          <p class="text-caption text-medium-emphasis mb-6">Use o botão de adicionar para cadastrar o primeiro personagem.</p>
        </div>

        <div v-else class="players-grid">
          <v-slide-y-transition group>
            <div v-for="player in playersStore.players" :key="player.id" class="player-card-wrapper">
              <div class="player-card text-center" @click="goToProfile(player.id)">
                <div class="avatar-wrapper">
                  <v-avatar size="72">
                    <v-img :src="getPlayerAvatarUrl(player.avatarKey)" :alt="player.name" />
                  </v-avatar>

                  <v-btn icon variant="flat" color="error" size="x-small" class="delete-btn" :disabled="isDeleting" @click.stop="confirmDelete(player)">
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

    <AdminAddPlayerDialog v-model="addDialog" />

    <v-dialog v-model="deleteDialog" max-width="320">
      <v-card rounded="lg">
        <v-card-title class="pt-5 px-5">Remover jogador?</v-card-title>
        <v-card-text class="px-5">
          <span class="font-weight-bold">{{ playerToDelete?.name }}</span> será removido da lista.
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn variant="tonal" rounded="lg" :disabled="isDeleting" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" rounded="lg" :loading="isDeleting" @click="deletePlayer">Remover</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AdminAddPlayerDialog from "@/modules/auth/components/AdminAddPlayerDialog.vue";
import type { RegisteredPlayer } from "@/modules/players/types/players.types";
import SetupHeader from "@/shared/components/SetupHeader.vue";
import { usePlayersStore } from "@/shared/store/usePlayersStore";
import { getPlayerAvatarUrl } from "@/shared/utils/avatar";

const router = useRouter();
const playersStore = usePlayersStore();

const addDialog = ref(false);
const deleteDialog = ref(false);
const playerToDelete = ref<RegisteredPlayer | null>(null);
const isDeleting = ref(false);

const loadPlayers = () => {
  void playersStore.loadPlayers().catch(() => {
    // Error state is already exposed by the store.
  });
};

const goHome = () => {
  router.push({ name: "home" });
};

const goToProfile = (playerId: string) => {
  router.push({ name: "player-profile", params: { id: playerId } });
};

const confirmDelete = (player: RegisteredPlayer) => {
  playerToDelete.value = player;
  deleteDialog.value = true;
};

const deletePlayer = async () => {
  if (!playerToDelete.value || isDeleting.value) return;

  isDeleting.value = true;

  try {
    await playersStore.removePlayer(playerToDelete.value.id);
  } catch {
    // Error state is already exposed by the store.
  } finally {
    deleteDialog.value = false;
    playerToDelete.value = null;
    isDeleting.value = false;
  }
};

onMounted(loadPlayers);
</script>

<style scoped>
.admin-players-page {
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
